import React, { Component } from 'react'
import * as STATICS from '../../Const/Const';
import axios from 'axios'
const trash = require('../Resources/Images/trash.png')
const edit = require('../Resources/Images/edit.png')

class QuestionBox extends Component {
    
    state = {
        initialFirstQusetion:'',
        initialSecondQusetion:'',
        id:'',
        firstQuestion:'',
        secondQuestion:'',
    }

    constructor(){
        super()

        this.edit = this.edit.bind(this)
        this.delete = this.delete.bind(this)
        this.onFirstQuestionEdit = this.onFirstQuestionEdit.bind(this)
        this.onSecondQuestionEdit = this.onSecondQuestionEdit.bind(this)
    }

    componentDidMount(){
        if(this.props.firstQuestion != null && this.props.secondQuestion != null){
            this.setState({
                initialFirstQusetion:this.props.firstQuestion,
                initialSecondQusetion:this.props.secondQuestion,
                id:this.props.id
            })
        }
    }

    onFirstQuestionEdit (event) {
        if (this.state.firstQuestion == ''){
            event.target.value = this.state.initialFirstQusetion            
        }
        if (this.state.firstQuestion != '' || this.state.firstQuestion != null){
            this.setState({
                firstQuestion:event.target.value
            })
        }
    }

    onSecondQuestionEdit (event) {
        if (this.state.secondQuestion == ''){
            event.target.value = this.state.initialSecondQusetion            
        }
        if (this.state.secondQuestion != '' || this.state.secondQuestion != null){
            this.setState({
                secondQuestion:event.target.value
            })
        }
    }
    
    edit() {
        var first = (this.state.firstQuestion == '') ? this.state.initialFirstQusetion : this.state.firstQuestion
        var second = (this.state.secondQuestion == '') ? this.state.initialSecondQusetion : this.state.secondQuestion
            
        axios.post(`${STATICS.SERVER_API_ADDRESS}updateQuestion`,{id:this.state.id,firstQuestion:first,secondQuestion:second}).then( () => {
            alert('.سوال با موفقیت تغییر یافت')
            this.forceUpdate()
        }).catch((err) => {
            alert('خطا در برقراری ارتباط با سرور')
        })
    }

    delete() {
        axios.delete(`${STATICS.SERVER_API_ADDRESS}deleteQuestionById`,{data:{id:this.state.id}}).then((res) =>{
            alert('.سوال با موفقیت حذف شد')
            this.props.updateView()
        }
        ).catch(err => {
            alert('خطا در برقراری ارتباط با سرور')
        })
    }

    render () {
        return(
                <div className='Question-box-container' style={{height:130,width:'95%',borderRadius:10,backgroundColor:'#7493b1',boxShadow:'2px 2px 0px black'}}>
                <div dir='rtl' className='Question-box-second-section'><input type="text" style={{width:'80%', textAlign:'center',backgroundColor:'#2467e2',place:'white',borderColor:'#2467e2',color:'white',border:'none'}} placeholder={this.state.initialSecondQusetion} onChange={this.onSecondQuestionEdit} onSelect={this.onSecondQuestionEdit}/></div>
                <div dir='rtl' className='Question-box-first-section'><input type="text" style={{width:'80%', textAlign:'center',backgroundColor:'#d42222',place:'white',borderColor:'#d42222',color:'white',border:'none'}} placeholder={this.state.initialFirstQusetion} onChange={this.onFirstQuestionEdit} onSelect={this.onFirstQuestionEdit}/></div>
                <div className='Question-box-edit-section' onClick={this.edit}><img style={{width:25,height:25,justifySelf:'center',alignSelf:'center'}} src={edit}></img><b style={{color:'black',fontSize:10,textAlign:'center',width:50,height:25,justifySelf:'center',alignSelf:'center',padding:4}}>اعمال تغییرات</b></div>
                <div className='Question-box-delete-section' onClick={this.delete}><img style={{width:25,height:25,justifySelf:'center',alignSelf:'center'}} src={trash}></img><b style={{color:'black',fontSize:10,textAlign:'center',width:50,height:25,justifySelf:'center',alignSelf:'center',padding:4}}>پاک کردن سوال</b></div>
                <div className='Question-box-number-section'><div style={{justifySelf:'center',alignSelf:'center'}}>{`.${this.props.number}`}</div></div>
            </div>
        )
    }
}

export default QuestionBox