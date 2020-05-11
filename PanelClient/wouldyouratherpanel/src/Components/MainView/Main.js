import React, { Component } from 'react'
import UserManager from '../../Manager/userManager.js'
import Axios from 'axios'
import userManager from '../../Manager/userManager.js'
import * as STATICS from '../../Const/Const';
import OptionMenu from './OptionMenu'
import Header from '../Header/Header'
import * as SessionManager from '../../Utilities/Utilities'

const loginView = (handleUserChange,handlePassChange,submitClicked,signup) => {
    if (!userManager.isLogin){
    return(
        <div className='Main-login-container'>
            
            <div className='Main-login-panel'>
            
                <div className='Main-login-logo-text'>ورود به پنل کدومش</div>
                <div style={{position:'absolute',right:0,height:'100%',width:'50%',backgroundColor:'#d42222',zIndex:0}}></div>
                {/* <div className='Main-login-panel-username'>نام کاربری</div> */}
                {/* <div className='Main-login-panel-password'>رمز عبور</div> */}
                <div className='Main-login-panel-username-input' >
                    <input type="text" style={{height:35, textAlign:'center',backgroundColor:'#292929',place:'white',borderColor:'#292929',color:'white'}}  onChange={handleUserChange} placeholder='نام کاربری' />
                </div>
                <div className='Main-login-panel-password-input' >
                    <input type="text" style={{height:35, textAlign:'center',backgroundColor:'#292929',place:'white',borderColor:'#292929',color:'white'}}  onChange={handlePassChange} placeholder='رمز عبور' type='password'/>
                </div>
                <div style={{color:'white'}} className='Main-login-panel-submit' onClick={submitClicked}>
                      ورود
                </div>
                <div style={{color:'white'}} className='Main-login-panel-signup' onClick={signup}>
                      ثبت نام
                </div>
            </div>
        </div>
    )
    }else {
        return(
            <OptionMenu/>
        )
    }
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
        this.signup = this.signup.bind(this)
    }

    handlePassChange (event) {
        this.setState({password: event.target.value});
    }

    handleUserChange (event) {
        this.setState({username: event.target.value});
    }

    signup() {

    }

    submitLogin () {
        console.log(this.state.username)
        if (this.state.username == null || this.state.username == ''){
            alert('Enter Username')
            return        
        }
        if (this.state.password == null || this.state.password == ''){
            alert('Enter Password')
            return
        }
        Axios.post(`${STATICS.SERVER_API_ADDRESS}adminLogin`,{username:this.state.username,password:this.state.password}).then(res => {
            console.log(res.data.session)
            SessionManager.setSession(res.data.session)
            console.log(res)
            if (res.status == 200){
                userManager.isLogin = true
                this.forceUpdate()
            }
        }).catch(err => {
            if(err.response){
                if (err.response.status == 400){            
                    alert('Wrong Username or Password')
                }
            }
        })
    }

    render () {
        return (
            
            <div style={{width:'100%',height:'100%'}}>
                <Header/>
                {loginView(this.handleUserChange,this.handlePassChange,this.submitLogin,this.signup)}
            </div>
        )
    }

}

export default Main