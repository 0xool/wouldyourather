import React, { Component } from 'react'
import Header from '../Header/Header'
import axios from 'axios'
import * as STATICS from '../../Const/Const';
import QB from './QuestionBox'
import { Link,Redirect } from 'react-router-dom';
import * as SessionManager from '../../Utilities/Utilities'
import userManager from '../../Manager/userManager';

const questionsList =  (questions,updateView) => {
    
    if (questions == null || questions.lenght == 0) {
        return(
            <div style={{textAlign:'center',justifySelf:'center',alignSelf:'center' }}>!سوالی موجود نمی باشد</div>
        )
    }
    
    if (questions.lenght != 0){
        var renderedOutput = questions.map((item,index) => <QB updateView={updateView} firstQuestion={item.firstQuestion} secondQuestion={item.secondQuestion} id={item._id} key={index} number={index + 1}/>)
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
        redirect:false
     }

    constructor (){
        super()
        this.getQuestions()
        this.updateView = this.updateView.bind(this)
    }

    updateView() {
        this.getQuestions()
        // this.forceUpdate()
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

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
          }

        var list = (this.state.questions.length == 0) ? null : this.state.questions

        return (
            <div style={{backgroundColor:'292929',width:'100%',height:'100%'}}>
                <div className='Question-list-container'>
                    <Header/>
                    <div className='Question-list'>
                        {questionsList(list,this.updateView)}
                    </div>
                    {backComponent()}
                </div>
            </div>
        )
    }
}

export default QuestionListView