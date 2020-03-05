import React, { Component } from 'react'
import axios from 'axios'
import '../../App.css';
import { Link } from 'react-router-dom';



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
    }
    
    constructor(props){
        super(props)

    }

    componentDidMount() {
        const request = axios.get(`http://localhost:3001/api/getUnverifiedQuestions`)
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
        axios.post("http://localhost:3001/api/validateQuestionById",{_id:this.state.currentQuestion._id})
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
        axios.delete("http://localhost:3001/api/deleteQuestionById",{data:{_id:this.state.currentQuestion._id}}).then(res => console.log(res))
        if (index < this.state.unveridiedQuestions.length){
            this.setState({questionIndex:index})            
            var currentQuestion = this.state.unveridiedQuestions[index]
            this.setState({currentQuestion:currentQuestion})
        }else {
            this.setState({finished:true})
        }
    }

    render () {
        this.acceptHandler = this.acceptHandler.bind(this)
        this.rejectHandler = this.rejectHandler.bind(this)
        this.backToadminPanel = this.backToadminPanel.bind(this)

        return (
            <div style={{width:'100%',height:'100%'}}>
                {mainView(this.state.lodaing,this.state.finished,this.state,this.acceptHandler,this.rejectHandler,this.backToadminPanel)}
            </div>
        )
    }


    

}

export default ValidateQuestion