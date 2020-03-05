import React, { Component } from 'react'
import axios from 'axios'
import '../../App.css';
import { Link } from 'react-router-dom';



const firstQuestionComponent = (firstQuestionEnter) => {
    return (
        <div className='Validate-first-question'>
            <input type="text"  onChange={firstQuestionEnter} />
        </div>
    )
}

const secondQuestionComponent = (secondQuestioEnter) => {
    return (
        <div className='Validate-second-question'>
            <input type="text"  onChange={secondQuestioEnter} />
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
                    .سوال های خود را وارد کنید
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

        axios.post('http://localhost:3001/api/postQuestion',{firstQuestion:this.state.firstQuestion,secondQuestion:this.state.secondQuestion}).then(
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
                {mainView(this.firstQuestionEnter,this.secondQuestionEnter,this.sendQuestion)}
            </div>
        )
    }


    

}

export default AddQuestion