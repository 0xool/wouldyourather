import React, { Component } from 'react'
import Header from '../Header/Header'
import axios from 'axios'
import * as STATICS from '../../Const/Const';
import QB from './QuestionBox'
import { Link } from 'react-router-dom';

const questionsList =  (questions) => {
    
    if (questions == null || questions.lenght == 0) {
        return(
            <div style={{textAlign:'center',justifySelf:'center',alignSelf:'center' }}>!سوالی موجود نمی باشد</div>
        )
    }
    
    if (questions.lenght != 0){
        var renderedOutput = questions.map((item,index) => <QB firstQuestion={item.firstQuestion} secondQuestion={item.secondQuestion} id={item._id} key={index} number={index + 1}/>)
        return(
            <div style={{width:'100%',height:'100%',flexDirection:'column' , display:'flex',alignSelf:'center',justifySelf:'center',overflow:'scroll',margin:8}}>
                {renderedOutput}
            </div>
        )
    }
}

const backComponent = () => {
    return (
        <Link to={{pathname:'/'}} className='Back-from-list' >
            بازکشت
        </Link>
    )
}

class QuestionListView extends Component {
    
    state = {
        questions:[],
     }

    constructor (){
        super()
        this.getQuestions()

    }
    
    
    getQuestions () {
        axios.get(`${STATICS.SERVER_API_ADDRESS}getAllQuestion`).then( (res) => {
            var tempQ = res.data
            this.setState({
                questions:tempQ
            })
        }).catch(err => {
            alert(`network error: ${err}`)
        })
    }
    
    

    render () {

        var list = (this.state.questions.length == 0) ? null : this.state.questions

        return (
            <div style={{backgroundColor:'292929',width:'100%',height:'100%'}}>
                <div className='Question-list-container'>
                    <Header/>
                    <div className='Question-list'>
                        {questionsList(list)}
                    </div>
                    {backComponent()}
                </div>
            </div>
        )
    }
}

export default QuestionListView