import React, { Component } from 'react'
import axios from 'axios'
import '../../App.css';
import { Link,Redirect } from 'react-router-dom';
import * as SessionManager from '../../Utilities/Utilities'
import userManager from '../../Manager/userManager';
import * as STATICS from '../../Const/Const';
import Header from '../Header/Header'


const firstQuestionComponent = (firstQuestion,editHandler) => {
    return (
        <div className='Validate-first-question'>
            <input type="text" style={{width:'80%', textAlign:'center',backgroundColor:'#d42222',place:'white',borderColor:'#2467e2',color:'white',border:'none'}}  onChange={editHandler} onSelect={editHandler} placeholder={firstQuestion}></input>
        </div>
    )
}

const secondQuestionComponent = (secondQuestion,editHandler) => {
    return (
        <div className='Validate-second-question'>
            <input type="text" style={{width:'80%', textAlign:'center',backgroundColor:'#2467e2',place:'white',borderColor:'#2467e2',color:'white',border:'none'}}  onChange={editHandler} onSelect={editHandler} placeholder={secondQuestion}></input>
        </div>
    )
}

const orQuestionComponent = () => {
    
    return (
        <div className='Validate-or'>
            یا
        </div>
    )
}

const acceptComponent = (handler) => {
    return (
        <div className='Validate-accept'  onClick={handler}>
            قبول
        </div>
    )
}

const declineComponent = (handler) => {
    return (
        <div className='Validate-decline' onClick={handler}>
            رد
        </div>
    )
}

const mainView = (lodaing,finished,state,acceptHandler,rejectHandler,backToadminPanel,firstEditHandler,secondEditHandler) => {
    
    if (lodaing){
        return(
            <div style={{width:'100%',height:'100vh',backgroundColor:'61dafb'}}></div>
        )
    }
    
    if (!finished) {
        return (
            <div className='Validate-container'>
                <div className="Validate-logo">
                    آیا سوال را تايید می کنید؟
                </div>
                {firstQuestionComponent(state.currentQuestion.firstQuestion,firstEditHandler)}
                {orQuestionComponent()}
                {secondQuestionComponent(state.currentQuestion.secondQuestion,secondEditHandler)}
                {acceptComponent(acceptHandler)}
                {declineComponent(rejectHandler)}
                <Link to={{pathname:'/'}} className="Validate-back" onClick={backToadminPanel}>
                    بازگشت
                </Link>
            </div>
        )
    }else{
        return (
        <div className='Validate-container'>
            <div className='Validate-or'>
            تمام
            </div>
            <Link to={{pathname:'/'}} className="Validate-back" onClick={backToadminPanel}>
                بازگشت
            </Link>
        </div>
        )
    }
}



class ValidateQuestion extends Component {
    state = {
        unveridiedQuestions:[],
        currentQuestion:{},
        firstEditedQuestion:'',
        secondEditedQuestion:'',
        questionIndex:0,
        finished:false,
        lodaing:true,
        redirect:false,
    }
    
    constructor(props){
        super(props)

        this.acceptHandler = this.acceptHandler.bind(this)
        this.rejectHandler = this.rejectHandler.bind(this)
        this.backToadminPanel = this.backToadminPanel.bind(this)

        this.firstQuestionEdited = this.firstQuestionEdited.bind(this)
        this.secondQuestionEdited = this.secondQuestionEdited.bind(this)
        this.questionEditSend = this.questionEditSend.bind(this)
    }

    componentWillMount() {
        this.Auth()
    }

    Auth (){
        
        const session = SessionManager.getSession()
        axios.get(`${STATICS.SERVER_API_ADDRESS}isUserAuth`,{params:{isLoggedIn:session}}).then( (res) => {
            console.log(res.data.auth)
            if (!res.data.auth) {
                userManager.isLogin = false
                this.setState({
                    redirect:true
                })
                return
            }
        
        }).catch(err => {
                userManager.isLogin = false
                this.setState({
                    redirect:true
                })
            console.log(`network error: ${err}`)
        })     
    } 

    firstQuestionEdited (event) {
        if (this.state.firstEditedQuestion == ''){
            event.target.value = this.state.currentQuestion.firstQuestion
            this.setState({
                firstEditedQuestion:event.target.value
            })
        }

        if (event.target.value != this.state.currentQuestion.firstQuestion){
            this.setState({
                firstEditedQuestion:event.target.value
            })
        }
    }

    secondQuestionEdited (event) {

        if (this.state.secondEditedQuestion == ''){
            event.target.value = this.state.currentQuestion.secondQuestion
            this.setState({
                secondEditedQuestion:event.target.value
            })
        }

        if (event.target.value != this.state.currentQuestion.secondQuestion){
            this.setState({
                secondEditedQuestion:event.target.value
            })
        }

    }

    questionEditSend (onSuccess) {
        if (this.state.firstEditedQuestion == '' && this.state.secondEditedQuestion == '') {
            return
        }

        const first = (this.state.firstEditedQuestion == '') ? this.state.currentQuestion.firstQuestion : this.state.firstEditedQuestion
        const second = (this.state.secondEditedQuestion == '') ? this.state.currentQuestion.secondQuestion : this.state.secondEditedQuestion


        axios.post(`${STATICS.SERVER_API_ADDRESS}updateQuestion`,{id:this.state.currentQuestion._id,firstQuestion:first,secondQuestion:second}).then( () => {
            console.log('the fuck')
        }).catch(err => {
            // alert(‍'خطا در برقراری ارتباط با سرور')
            console.log('the fuck2')
        })
    }

    componentDidMount() {
        const request = axios.get(`${STATICS.SERVER_API_ADDRESS}getUnverifiedQuestions`)
                    .then(response => {
                        this.setState({lodaing:false})
                        this.setState({unveridiedQuestions:response.data})  
                        if (this.state.unveridiedQuestions.length > 0)
                            this.setState({currentQuestion:this.state.unveridiedQuestions[this.state.questionIndex]})                       
                        else {
                            this.setState({finished:true})
                        }
                        return response.data
                    })
    }

    acceptHandler () {
        var index = this.state.questionIndex + 1
        axios.post(`${STATICS.SERVER_API_ADDRESS}validateQuestionById`,{_id:this.state.currentQuestion._id}).then(() => {
            this.questionEditSend(() => {            

            })

            if (index < this.state.unveridiedQuestions.length){
                

                this.setState({questionIndex:index})
                var currentQuestion = this.state.unveridiedQuestions[index]
                this.setState({currentQuestion:currentQuestion,firstEditedQuestion:'',secondEditedQuestion:''})
            }else{
                this.setState({finished:true})
            } 
        }).catch((err) => {
            console.log(err)
        })
    }

    backToadminPanel() {

    }

    rejectHandler () {
        var index = this.state.questionIndex + 1
        axios.delete(`${STATICS.SERVER_API_ADDRESS}deleteQuestionById`,{data:{id:this.state.currentQuestion._id}}).then(res => console.log(res))
        if (index < this.state.unveridiedQuestions.length){
            this.setState({questionIndex:index})            
            var currentQuestion = this.state.unveridiedQuestions[index]
            this.setState({currentQuestion:currentQuestion,firstEditedQuestion:'',secondEditedQuestion:''})
        }else {
            this.setState({finished:true})
        }
    }

    render () {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
          }

        return (
            <div style={{width:'100%',height:'100%'}}>
                <Header/>
                {mainView(this.state.lodaing,this.state.finished,this.state,this.acceptHandler,this.rejectHandler,this.backToadminPanel,this.firstQuestionEdited,this.secondQuestionEdited)}
            </div>
        )
    } 

}

export default ValidateQuestion