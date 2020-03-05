import React, { Component } from 'react'
import UserManager from '../../Manager/userManager.js'
import Axios from 'axios'
import userManager from '../../Manager/userManager.js'
import { Link } from 'react-router-dom'


const loginView = (state,handleUserChange,handlePassChange,submitClicked) => {
    console.log(UserManager.isLogin)
    if (!userManager.isLogin){
    return(
        <div className='Main-login-container'>
            <div className='Main-login-logo'>یا آ یا آ یا</div>
            <div className='Main-login-panel'>
                <div className='Main-login-panel-username'>نام کاربری</div>
                <div className='Main-login-panel-password'>رمز عبور</div>
                <div className='Main-login-panel-username-input'>
                    <input type="text"  onChange={handleUserChange} />
                </div>
                <div className='Main-login-panel-password-input'>
                    <input type="text"  onChange={handlePassChange} />
                </div>
                <div className='Main-login-panel-submit' onClick={submitClicked}>
                      ورود
                </div>
            </div>
        </div>
    )
    }else {
        return(
            <div className='Main-view-login-container'>
                <Link to={{pathname:'/addQuestion'}} className='Main-view-login-add-question'>
                    اضافه کردن سوال
                </Link>
                <Link to={{pathname:'/validateQuestion'}} className='Main-view-login-check-question'>
                    چک کردن سوال
                </Link>
            </div>
        )
    }
}

const mainView = () => {

}

class Main extends Component {

    state = {
        username:'',
        password:'',

    }

    constructor(props) {
        super(props)

        this.handlePassChange = this.handlePassChange.bind(this)
        this.handleUserChange = this.handleUserChange.bind(this)
        this.submitLogin = this.submitLogin.bind(this)
    }

    handlePassChange (event) {
        this.setState({password: event.target.value});
    }

    handleUserChange (event) {
        this.setState({username: event.target.value});
    }

    submitLogin () {
        if (this.state.username == null){
            alert('Enter Username')
            return        
        }
        if (this.state.password == null){
            alert('Enter Password')
            return
        }
        Axios.post('http://localhost:3001/server/api/adminLogin',{username:this.state.username,password:this.state.password}).then(res => {
            if (res.status == 200){
                userManager.isLogin = true
                this.forceUpdate()
            }
        }).catch(err => {
            if (err.response.status == 400){
                console.log('wasi?')
                alert('Wrong Username or Password')
            }
        })
    }

    render () {



        return (
            <div style={{width:'100%',height:'100%'}}>
                {loginView(this.state,this.handleUserChange,this.handlePassChange,this.submitLogin)}
            </div>
        )
    }

}

export default Main