import React, { Component } from 'react'
import Header from '../Header/Header'
import axios from 'axios'
import * as STATICS from '../../Const/Const';
import UB from './UserBox'
import { Link,Redirect } from 'react-router-dom';
import * as SessionManager from '../../Utilities/Utilities'
import userManager from '../../Manager/userManager';


const usersList =  (users,updateView) => {
    
    if (users == null || users.lenght == 0) {
        return(
            <div style={{textAlign:'center',justifySelf:'center',alignSelf:'center' }}>!کاربری موجود نمی باشد</div>
        )
    }
    
    if (users.lenght != 0){
        
        var renderedOutput = users.map((item,index) => <UB updateView={updateView} name={item.username} email={item.email} id={item._id} key={index} number={index + 1}/>)
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



class UserListView extends Component {
    
    state = {
        users:[],
        redirect:false
     }

    constructor (){
        super()
        this.getUsers()
        this.updateView = this.updateView.bind(this)
    }

    componentWillMount() {
        this.Auth()
    }

    updateView() {
        this.getUsers()
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
 
    
    getUsers () {
        axios.get(`${STATICS.SERVER_API_ADDRESS}getAllUsers`).then( (res) => {
            var tempQ = res.data
            this.setState({
                users:tempQ
            })
        }).catch(err => {
            alert(`network error: ${err}`)
        })
    }

    render () {

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
          }

        var list = (this.state.users.length == 0) ? null : this.state.users

        return (
            <div style={{backgroundColor:'292929',width:'100%',height:'100%'}}>
                <div className='User-list-container'>
                    <Header/>
                    <div className='User-list'>
                        {usersList(list,this.updateView)}
                    </div>
                    {backComponent()}
                </div>
            </div>
        )
    }
}

export default UserListView