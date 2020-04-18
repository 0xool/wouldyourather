import React, { Component } from 'react'
import axios from 'axios'
import '../../App.css';
import { Link } from 'react-router-dom';
import * as STATICS from '../../Const/Const';
import Header from '../Header/Header'


const firstQuestionComponent = (firstQuestionEnter) => {
    return (
        <div className='Validate-first-question'>
            <input type="text" style={{width:'80%',height:50, textAlign:'center',backgroundColor:'#292929',place:'white',borderColor:'#292929',color:'white'}} placeholder='سوال اول'  onChange={firstQuestionEnter} />
        </div>
    )
}

const secondQuestionComponent = (secondQuestioEnter) => {
    return (
        <div className='Validate-second-question'>
            <input type="text" style={{width:'80%',height:50, textAlign:'center',backgroundColor:'#292929',place:'white',borderColor:'#292929',color:'white'}} placeholder='سوال دوم'  onChange={secondQuestioEnter} />
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

const addComponent = (sendQuestion) => {
    return (
        <div className='Add-accept'  onClick={sendQuestion}>
            اضافه کن
        </div>
    )
}

const backComponent = () => {
    return (
        <Link to={{pathname:'/'}} className='Validate-decline' >
            بازکشت
        </Link>
    )
}


const mainView = (firstQuestionEnter,secondQuestionEnter,sendQuestion) => {
        return (
            <div className='Validate-container'>
                <div className="Validate-logo">
                    .سوال خود را وارد کنید
                </div>
                {firstQuestionComponent(firstQuestionEnter)}
                {orQuestionComponent()}
                {secondQuestionComponent(secondQuestionEnter)}
                {addComponent(sendQuestion)}
                {backComponent()}
            </div>
        )
}



class AddQuestion extends Component {
    state = {
        firstQuestion: '',
        secondQuestion: '',

    }
    
    constructor(props){
        super(props)

    }




    firstQuestionEnter (event) {
        this.setState({firstQuestion: event.target.value});
    }

    secondQuestionEnter (event) {
        this.setState({secondQuestion: event.target.value});
    }

    sendQuestion () {

        if(this.state.firstQuestion == ''){
            alert('سوال اول خالی است.')
            return
        }
        if(this.state.secondQuestion == ''){
            alert('سوال دوم خالی است.')
            return
        }

        axios.post(`${STATICS.SERVER_API_ADDRESS}postQuestion`,{firstQuestion:this.state.firstQuestion,secondQuestion:this.state.secondQuestion}).then(
            alert('سوال اضافه شد')
        ).catch(err => {
            alert(err.response.data)
        })
    }

    render () {
        this.firstQuestionEnter = this.firstQuestionEnter.bind(this)
        this.secondQuestionEnter = this.secondQuestionEnter.bind(this)
        this.sendQuestion = this.sendQuestion.bind(this)

        return (
            <div style={{width:'100%',height:'100%'}}>
                <Header/>
                {mainView(this.firstQuestionEnter,this.secondQuestionEnter,this.sendQuestion)}
            </div>
        )
    }


    

}

export default AddQuestion