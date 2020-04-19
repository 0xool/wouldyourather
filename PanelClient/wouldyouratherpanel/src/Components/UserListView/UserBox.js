import React, { Component } from 'react'
import * as STATICS from '../../Const/Const';
import axios from 'axios'
const trash = require('../Resources/Images/trash.png')


class QuestionBox extends Component {
    
    state = {
        name:'',
        email:'',
        id:'',
    }

    constructor(){
        super()
        
        this.delete = this.delete.bind(this)        
    }

    componentDidMount(){
        if(this.props.name != null && this.props.email != null){
            this.setState({
                email:this.props.email,
                name:this.props.name,
                id:this.props.id
            })
        }
    }

    delete() {
        axios.delete(`${STATICS.SERVER_API_ADDRESS}deleteUserById`,{data:{id:this.state.id}}).then((res) =>{
            alert('.کاربر با موفقیت حذف شد')
        }
        ).catch(err => {
            // alert(‍'خطا در برقراری ارتباط با سرور')
        })
    }

    render () {
        return(
                <div className='User-box-container' style={{height:80,width:'95%',borderRadius:10,backgroundColor:'#7493b1',boxShadow:'2px 2px 0px black'}}>
                 <div className='User-box-name-section'><b style={{width:'80%',alignSelf:'center',justifySelf:'center', textAlign:'center',color:'black'}}>{`${this.props.name} :نام کاربری`}</b></div>
                    <div className='User-box-email-section'><b style={{width:'80%',alignSelf:'center',justifySelf:'center', textAlign:'center',color:'black'}}>{`${this.props.email} :ایمیل`}</b></div>
                    <div className='User-box-delete-section' onClick={this.delete}><img style={{width:15,height:15,justifySelf:'center',alignSelf:'center'}} src={trash}></img><b style={{color:'black',fontSize:10,textAlign:'center',width:50,height:25,justifySelf:'center',alignSelf:'center',padding:4}}>حذف کردن کاربر</b></div>
                    <div className='User-box-number-section'><div style={{justifySelf:'center',alignSelf:'center'}}>{`.${this.props.number}`}</div></div>
                </div>
        )
    }
}

export default QuestionBox