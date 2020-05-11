import React, { Component } from 'react'
import axios from 'axios'
import '../../App.css';
import { Link,Redirect } from 'react-router-dom';
import * as SessionManager from '../../Utilities/Utilities'
import userManager from '../../Manager/userManager';
import * as STATICS from '../../Const/Const';
import Header from '../Header/Header'


const firstQuestionComponent = (firstQuestion) => {
    return (
        <div className='Validate-first-question'>
            {firstQuestion}
        </div>
    )
}

const secondQuestionComponent = (secondQuestion) => {
    return (
        <div className='Validate-second-question'>
            {secondQuestion}
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

const mainView = (lodaing,finished,state,acceptHandler,rejectHandler,backToadminPanel) => {
    
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
                {firstQuestionComponent(state.currentQuestion.firstQuestion)}
                {orQuestionComponent()}
                {secondQuestionComponent(state.currentQuestion.secondQuestion)}
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
        axios.post(`${STATICS.SERVER_API_ADDRESS}validateQuestionById`,{_id:this.state.currentQuestion._id})
        if (index < this.state.unveridiedQuestions.length){
            this.setState({questionIndex:index})
            var currentQuestion = this.state.unveridiedQuestions[index]
            this.setState({currentQuestion:currentQuestion})
        }else{
            this.setState({finished:true})
        }
        
    }

    backToadminPanel() {

    }

    rejectHandler () {
        var index = this.state.questionIndex + 1
        axios.delete(`${STATICS.SERVER_API_ADDRESS}deleteQuestionById`,{data:{id:this.state.currentQuestion._id}}).then(res => console.log(res))
        if (index < this.state.unveridiedQuestions.length){
            this.setState({questionIndex:index})            
            var currentQuestion = this.state.unveridiedQuestions[index]
            this.setState({currentQuestion:currentQuestion})
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
                {mainView(this.state.lodaing,this.state.finished,this.state,this.acceptHandler,this.rejectHandler,this.backToadminPanel)}
            </div>
        )
    }


    

}

export default ValidateQuestion