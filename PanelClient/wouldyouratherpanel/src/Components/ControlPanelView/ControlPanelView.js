import React, { Component } from 'react'
import Header from '../Header/Header'
import axios from 'axios'
import * as STATICS from '../../Const/Const';
import { Link,Redirect } from 'react-router-dom';
import * as SessionManager from '../../Utilities/Utilities'
import userManager from '../../Manager/userManager';
// MAJOR REFACTORINT REQUIERED


const usersList =  (users,updateView) => {
    
    if (users == null || users.lenght == 0) {
        return(
            <div style={{textAlign:'center',justifySelf:'center',alignSelf:'center' }}>!کاربری موجود نمی باشد</div>
        )
    }
    
    if (users.lenght != 0){
        
        return(
            <div style={{width:'100%',height:'100%',flexDirection:'column' , display:'flex',alignSelf:'center',justifySelf:'center',overflow:'scroll',margin:8}}>
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



class ControlPanelView extends Component {
    
    state = {
        redirect:false,
        configData: {},
        buyUsComponentLimit:'',
        rateUsComponentLimit:'',
        shareUsTutorialAnimationStart:'',
        buyUsPopUpTimer:'',
        buyUsPopUpText:'',
        rateUsFirstText:'',
        rateUsSecondText:'',
        buyUsFirstText:'',
        buyUsSecondText:'',
        addQuestionRuleText:'',
        shareUsShakeAnimationStart:'',
        showPopUpAdLimit:'',
    }

    constructor (){
        super()
    }

    componentWillMount() {
        this.Auth()
        this.getInitialConfig = this.getInitialConfig.bind(this)
    }

    getInitialConfig () {
        axios.get(`${STATICS.SERVER_API_ADDRESS}getClientConfig`).then((res) => {
            this.setState({configData:res})
        }).catch(err => {
            console.log(err)
        })
    }

    onBuyUsLimitEdit =  (event) => {
        if (this.state.buyUsComponentLimit == ''){
            event.target.value = this.state.configData.data.buyUsComponentLimit
        }
        if (this.state.buyUsComponentLimit != '' || this.state.buyUsComponentLimit != null){
            this.setState({
                buyUsComponentLimit:event.target.value
            })
        }
    }
    rateUsComponentLimitEdit = (event) => {
        if (this.state.rateUsComponentLimit == ''){
            event.target.value = this.state.configData.data.rateUsComponentLimit
        }
        if (this.state.rateUsComponentLimit != '' || this.state.rateUsComponentLimit != null){
            this.setState({
                rateUsComponentLimit:event.target.value
            })
        }
    }
    shareUsTutorialAnimationStartEdit = (event) => {
        if (this.state.shareUsTutorialAnimationStart == ''){
            event.target.value = this.state.configData.data.shareUsTutorialAnimationStart
        }
        if (this.state.shareUsTutorialAnimationStart != '' || this.state.shareUsTutorialAnimationStart != null){
            this.setState({
                shareUsTutorialAnimationStart:event.target.value
            })
        }
    }
    rateUsFirstTextEdit = (event) =>  {
        if (this.state.rateUsFirstText == ''){
            event.target.value = this.state.configData.data.rateUsFirstText
        }
        if (this.state.rateUsFirstText != '' || this.state.rateUsFirstText != null){
            this.setState({
                rateUsFirstText:event.target.value
            })
        }
    }
    rateUsSecondTextEdit = (event) => {
        if (this.state.rateUsSecondText == ''){
            event.target.value = this.state.configData.data.rateUsSecondText
        }
        if (this.state.rateUsSecondText != '' || this.state.rateUsSecondText != null){
            this.setState({
                rateUsSecondText:event.target.value
            })
        }
    }
    buyUsSecondTextEdit = (event) => {
        if (this.state.buyUsSecondText == ''){
            event.target.value = this.state.configData.data.buyUsSecondText
        }
        if (this.state.buyUsSecondText != '' || this.state.buyUsSecondText != null){
            this.setState({
                buyUsSecondText:event.target.value
            })
        }
    }
    addQuestionRuleTextEdit =  (event) => {
        if (this.state.addQuestionRuleText == ''){
            event.target.value = this.state.configData.data.addQuestionRuleText
        }
        if (this.state.addQuestionRuleText != '' || this.state.addQuestionRuleText != null){
            this.setState({
                addQuestionRuleText:event.target.value
            })
        }
    }
    shareUsShakeAnimationStartEdit = (event) => {
        if (this.state.shareUsShakeAnimationStart == ''){
            event.target.value = this.state.configData.data.shareUsShakeAnimationStart
        }
        if (this.state.shareUsShakeAnimationStart != '' || this.state.shareUsShakeAnimationStart != null){
            this.setState({
                shareUsShakeAnimationStart:event.target.value
            })
        }
    }
    showPopUpAdLimitEdit = (event) => {
        if (this.state.showPopUpAdLimit == ''){
            event.target.value = this.state.configData.data.showPopUpAdLimit
        }
        if (this.state.showPopUpAdLimit != '' || this.state.showPopUpAdLimit != null){
            this.setState({
                showPopUpAdLimit:event.target.value
            })
        }
    }
    buyUsFirstTextEdit = (event) => {
        if (this.state.buyUsFirstText == ''){
            event.target.value = this.state.configData.data.buyUsFirstText
        }
        if (this.state.buyUsFirstText != '' || this.state.buyUsFirstText != null){
            this.setState({
                buyUsFirstText:event.target.value
            })
        }
    }
    buyUsPopUpTextEdit = (event) => {
        if (this.state.buyUsPopUpText == ''){
            event.target.value = this.state.configData.data.buyUsPopUpText
        }
        if (this.state.buyUsPopUpText != '' || this.state.buyUsPopUpText != null){
            this.setState({
                buyUsPopUpText:event.target.value
            })
        }
    }
    buyUsPopUpTimerEdit = (event) => {
        if (this.state.buyUsPopUpTimer == ''){
            event.target.value = this.state.configData.data.buyUsPopUpTimer
        }
        if (this.state.buyUsPopUpTimer != '' || this.state.buyUsPopUpTimer != null){
            this.setState({
                buyUsPopUpTimer:event.target.value
            })
        }
    }

    update = () => {
        var update = {}

        if(this.state.buyUsPopUpTimer != ''){
            update.buyUsPopUpTimer = this.state.buyUsPopUpTimer
        }

        if(this.state.buyUsPopUpText != ''){
            update.buyUsPopUpText = this.state.buyUsPopUpText
        }

        if(this.state.buyUsFirstText != ''){
            update.buyUsFirstText = this.state.buyUsFirstText
        }
        if(this.state.showPopUpAdLimit != ''){
            update.showPopUpAdLimit = this.state.showPopUpAdLimit
        }
        if(this.state.shareUsShakeAnimationStart != ''){
            update.shareUsShakeAnimationStart = this.state.shareUsShakeAnimationStart
        }
        if(this.state.addQuestionRuleText != ''){
            update.addQuestionRuleText = this.state.addQuestionRuleText
        }
        if(this.state.rateUsFirstText != ''){
            update.rateUsFirstText = this.state.rateUsFirstText
        }
        if(this.state.rateUsSecondText != ''){
            update.rateUsSecondText = this.state.rateUsSecondText
        }
        if(this.state.shareUsTutorialAnimationStart != ''){
            update.shareUsTutorialAnimationStart = this.state.shareUsTutorialAnimationStart
        }
        if(this.state.rateUsComponentLimit != ''){
            update.rateUsComponentLimit = this.state.rateUsComponentLimit
        }
        if(this.state.buyUsComponentLimit != ''){
            update.buyUsComponentLimit = this.state.buyUsComponentLimit
        }
        if(this.state.buyUsSecondText != ''){
            update.buyUsSecondText = this.state.buyUsSecondText
        }

        axios.post(`${STATICS.SERVER_API_ADDRESS}updateControlSegment`,update).then((res) => {
            this.forceUpdate()
            alert('تغییرات اعمال شد')            
        }).catch(err => {

        })
    }

    Auth (){
        
        const session = SessionManager.getSession()
        axios.get(`${STATICS.SERVER_API_ADDRESS}isUserAuth`,{params:{isLoggedIn:session}}).then( (res) => {
            
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
 
    render () {

        const buyUsComponentLimit = (this.state.configData.data) ? this.state.configData.data.buyUsComponentLimit : ''
        const rateUsComponentLimit = (this.state.configData.data) ? this.state.configData.data.rateUsComponentLimit : ''
        const shareUsTutorialAnimationStart = (this.state.configData.data) ? this.state.configData.data.shareUsTutorialAnimationStart : ''

        const buyUsPopUpTimer = (this.state.configData.data) ? this.state.configData.data.buyUsPopUpTimer : ''
        const buyUsPopUpText = (this.state.configData.data) ? this.state.configData.data.buyUsPopUpText : ''
        const rateUsFirstText = (this.state.configData.data) ? this.state.configData.data.rateUsFirstText : ''

        const rateUsSecondText = (this.state.configData.data) ? this.state.configData.data.rateUsSecondText : ''
        const buyUsFirstText = (this.state.configData.data) ? this.state.configData.data.buyUsFirstText : ''
        const buyUsSecondText = (this.state.configData.data) ? this.state.configData.data.buyUsSecondText : ''

        const addQuestionRuleText = (this.state.configData.data) ? this.state.configData.data.addQuestionRuleText : ''
        const shareUsShakeAnimationStart = (this.state.configData.data) ? this.state.configData.data.shareUsShakeAnimationStart : ''
        const showPopUpAdLimit = (this.state.configData.data) ? this.state.configData.data.showPopUpAdLimit : ''

        const shareUsTutorialAnimationStartComponent = () => {
            return (
                <div className='Control-box-container' style={{width:'95%',borderRadius:10,backgroundColor:'#7493b1',boxShadow:'2px 2px 0px black'}}> 
                    <div dir='rtl'  style={{display:'flex',height:'100%',marginRight:10, textAlign:'center',alignContent:'center',justifyItems:'center'}}><b style={{textAlign:'center',alignSelf:'center'}}>زمان شروع انیمیشن انگشت اشتراک</b></div>
                    <div dir='rtl'  style={{display:'flex',height:50,alignContent:'center',justifyItems:'center'}}>
                        <input onChange={this.shareUsTutorialAnimationStartEdit} dir='rtl' style={{width:'80%', textAlign:'center',backgroundColor:'#282c34',place:'white',borderColor:'#d42222',color:'white',border:'none'}} placeholder={shareUsTutorialAnimationStart}></input>
                    </div>
                </div>
            )
        }
        const buyUsPopUpTimerComponent = () => {
            return (
                <div className='Control-box-container' style={{width:'95%',borderRadius:10,backgroundColor:'#7493b1',boxShadow:'2px 2px 0px black'}}> 
                    <div dir='rtl'  style={{display:'flex',height:'100%',marginRight:10, textAlign:'center',alignContent:'center',justifyItems:'center'}}><b style={{textAlign:'center',alignSelf:'center'}}>زمان نمایش پاپ آپ خرید از ما</b></div>
                    <div dir='rtl'  style={{display:'flex',height:50,alignContent:'center',justifyItems:'center'}}>
                        <input onChange={this.buyUsPopUpTimerEdit} dir='rtl' style={{width:'80%', textAlign:'center',backgroundColor:'#282c34',place:'white',borderColor:'#d42222',color:'white',border:'none'}} placeholder={buyUsPopUpTimer}></input>
                    </div>
                </div>
            )
        }
        const buyUsPopUpTextComponent = () => {
            return (
                <div className='Control-box-container' style={{width:'95%',borderRadius:10,backgroundColor:'#7493b1',boxShadow:'2px 2px 0px black'}}> 
                    <div dir='rtl'  style={{display:'flex',height:'100%',marginRight:10, textAlign:'center',alignContent:'center',justifyItems:'center'}}><b style={{textAlign:'center',alignSelf:'center'}}>متن پاپ آپ خرید از ما</b></div>
                    <div dir='rtl'  style={{display:'flex',height:50,alignContent:'center',justifyItems:'center'}}>
                        <textarea onChange={this.buyUsPopUpTextEdit} dir='rtl' style={{ textAlign:'center',backgroundColor:'#282c34',place:'white',borderColor:'#d42222',color:'white',border:'none'}} placeholder={buyUsPopUpText}></textarea>
                    </div>
                </div>
            )
        }
        const rateUsFirstTextComponent = () => {
            return (
                <div className='Control-box-container' style={{width:'95%',borderRadius:10,backgroundColor:'#7493b1',boxShadow:'2px 2px 0px black'}}> 
                    <div dir='rtl'  style={{display:'flex',height:'100%',marginRight:10, textAlign:'center',alignContent:'center',justifyItems:'center'}}><b style={{textAlign:'center',alignSelf:'center'}}>متن دوم سوال رای دادن به ما</b></div>
                    <div dir='rtl'  style={{display:'flex',height:50,alignContent:'center',justifyItems:'center'}}>
                        <textarea onChange={this.rateUsFirstTextEdit} dir='rtl' style={{width:'80%', textAlign:'center',backgroundColor:'#282c34',place:'white',borderColor:'#d42222',color:'white',border:'none'}} placeholder={rateUsFirstText}></textarea>
                    </div>
                </div>
            )
        }
        const rateUsSecondTextComponent = () => {
            return (
                <div className='Control-box-container' style={{width:'95%',borderRadius:10,backgroundColor:'#7493b1',boxShadow:'2px 2px 0px black'}}> 
                    <div dir='rtl'  style={{display:'flex',height:'100%',marginRight:10, textAlign:'center',alignContent:'center',justifyItems:'center'}}><b style={{textAlign:'center',alignSelf:'center'}}>متن دوم سوال رای دادم به ما:</b></div>
                    <div dir='rtl'  style={{display:'flex',height:50,alignContent:'center',justifyItems:'center'}}>
                        <textarea onChange={this.rateUsSecondTextEdit} dir='rtl' style={{width:'80%', textAlign:'center',backgroundColor:'#282c34',place:'white',borderColor:'#d42222',color:'white',border:'none'}} placeholder={rateUsSecondText}></textarea>
                    </div>
                </div>
            )
        }
        const buyUsFirstTextComponent = () => {
            return (
                <div className='Control-box-container' style={{width:'95%',borderRadius:10,backgroundColor:'#7493b1',boxShadow:'2px 2px 0px black'}}> 
                    <div dir='rtl'  style={{display:'flex',height:'100%',marginRight:10, textAlign:'center',alignContent:'center',justifyItems:'center'}}><b style={{textAlign:'center',alignSelf:'center'}}>متن اول سوال خرید از ما:</b></div>
                    <div dir='rtl'  style={{display:'flex',height:50,alignContent:'center',justifyItems:'center'}}>
                        <textarea dir='rtl' onChange={this.buyUsFirstTextEdit} style={{width:'80%', textAlign:'center',backgroundColor:'#282c34',place:'white',borderColor:'#d42222',color:'white',border:'none'}} placeholder={buyUsFirstText}></textarea>
                    </div>
                </div>
            )
        }
        const buyUsSecondTextComponent = () => {
            return (
                <div className='Control-box-container' style={{width:'95%',borderRadius:10,backgroundColor:'#7493b1',boxShadow:'2px 2px 0px black'}}> 
                    <div dir='rtl'  style={{display:'flex',height:'100%',marginRight:10, textAlign:'center',alignContent:'center',justifyItems:'center'}}><b style={{textAlign:'center',alignSelf:'center'}}>متن دوم سوال خرید از ما:</b></div>
                    <div dir='rtl'  style={{display:'flex',height:50,alignContent:'center',justifyItems:'center'}}>
                        <textarea onChange={this.buyUsSecondTextEdit} dir='rtl' style={{width:'80%', textAlign:'center',backgroundColor:'#282c34',place:'white',borderColor:'#d42222',color:'white',border:'none'}} placeholder={buyUsSecondText}></textarea>
                    </div>
                </div>
            )
        }
        const shareUsShakeAnimationStartComponent = () => {
            return (
                <div className='Control-box-container' style={{width:'95%',borderRadius:10,backgroundColor:'#7493b1',boxShadow:'2px 2px 0px black'}}> 
                    <div dir='rtl'  style={{display:'flex',height:'100%',marginRight:10, textAlign:'center',alignContent:'center',justifyItems:'center'}}><b style={{textAlign:'center',alignSelf:'center'}}>محدودیت انیمیشن لرزش دکمه اشتراک سوال:</b></div>
                    <div dir='rtl'  style={{display:'flex',height:50,alignContent:'center',justifyItems:'center'}}>
                        <input onChange={this.shareUsShakeAnimationStartEdit} dir='rtl' style={{width:'80%', textAlign:'center',backgroundColor:'#282c34',place:'white',borderColor:'#d42222',color:'white',border:'none'}} placeholder={shareUsShakeAnimationStart}></input>
                    </div>
                </div>
            )
        }
        const showPopUpAdLimitComponent = () => {
            return (
                <div className='Control-box-container' style={{width:'95%',borderRadius:10,backgroundColor:'#7493b1',boxShadow:'2px 2px 0px black'}}> 
                    <div dir='rtl'  style={{display:'flex',height:'100%',marginRight:10, textAlign:'center',alignContent:'center',justifyItems:'center'}}><b style={{textAlign:'center',alignSelf:'center'}}>محدودیت نشان دادن تبلیغات:</b></div>
                    <div dir='rtl'  style={{display:'flex',height:50,alignContent:'center',justifyItems:'center'}}>
                        <input onChange={this.showPopUpAdLimitEdit} dir='rtl' style={{width:'80%', textAlign:'center',backgroundColor:'#282c34',place:'white',borderColor:'#d42222',color:'white',border:'none'}} placeholder={showPopUpAdLimit}></input>
                    </div>
                </div>
            )
        }

        const addQuestionRuleComponent = () => {
            return (
                <div className='Control-box-container' style={{width:'95%',borderRadius:10,backgroundColor:'#7493b1',boxShadow:'2px 2px 0px black'}}> 
                    <div dir='rtl'  style={{display:'flex',height:'100%',marginRight:10, textAlign:'center',alignContent:'center',justifyItems:'center'}}><b style={{textAlign:'center',alignSelf:'center'}}>متن قوانین ساخت سوال</b></div>
                    <div dir='rtl'  style={{display:'flex',width:'70%',height:300,alignContent:'center',justifyItems:'center'}}>
                        <textarea onChange={this.addQuestionRuleTextEdit} dir='rtl' style={{width:'80%', textAlign:'center',backgroundColor:'#282c34',place:'white',borderColor:'#d42222',color:'white',border:'none'}} placeholder={addQuestionRuleText}></textarea>
                    </div>
                </div>
            )
        }
        
        const buyUsLimitComponent = () => {
            return (
                <div className='Control-box-container' style={{width:'95%',borderRadius:10,backgroundColor:'#7493b1',boxShadow:'2px 2px 0px black'}}> 
                    <div dir='rtl'  style={{display:'flex',height:'100%',marginRight:10, textAlign:'center',alignContent:'center',justifyItems:'center'}}><b style={{textAlign:'center',alignSelf:'center'}}>نشان دادن خرید از ما بعد از:</b></div>
                    <div dir='rtl'  style={{display:'flex',height:50,alignContent:'center',justifyItems:'center'}}>
                        <input onChange={this.onBuyUsLimitEdit} dir='rtl' style={{width:'80%', textAlign:'center',backgroundColor:'#282c34',place:'white',borderColor:'#d42222',color:'white',border:'none'}} placeholder={buyUsComponentLimit}></input>
                    </div>
                </div>
            )
        }

        const rateUsComponent = () => {
            return (
                <div className='Control-box-container' style={{width:'95%',borderRadius:10,backgroundColor:'#7493b1',boxShadow:'2px 2px 0px black'}}> 
                    <div dir='rtl'  style={{display:'flex',height:'100%',marginRight:10, textAlign:'center',alignContent:'center',justifyItems:'center'}}><b style={{textAlign:'center',alignSelf:'center'}}>نشان دادن رای دادن به ما بعد از:</b></div>
                    <div dir='rtl'  style={{display:'flex',height:50,alignContent:'center',justifyItems:'center'}}>
                        <input onChange={this.rateUsComponentLimitEdit} dir='rtl' style={{width:'80%', textAlign:'center',backgroundColor:'#282c34',place:'white',borderColor:'#d42222',color:'white',border:'none'}} placeholder={rateUsComponentLimit}></input>
                    </div>
                </div>
            )
        }

        this.getInitialConfig()

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
          }

          
        return (
            <div style={{backgroundColor:'292929',width:'100%',height:'100%'}}>
                <div className='Control-list-container'>
                    <Header/>
                    <div className='Control-list'>
                        <div style={{width:'100%',height:'100%',flexDirection:'column' , display:'flex',alignSelf:'center',justifySelf:'center',justifyItems:'center',alignContent:'center',overflow:'scroll',margin:8}}>
                            {buyUsLimitComponent()}
                            {rateUsComponent()}
                            {addQuestionRuleComponent()}

                            {showPopUpAdLimitComponent()}
                            {shareUsShakeAnimationStartComponent()}
                            {buyUsSecondTextComponent()}

                            {buyUsFirstTextComponent()}
                            {rateUsSecondTextComponent()}
                            {rateUsFirstTextComponent()}


                            {buyUsPopUpTextComponent()}
                            {shareUsTutorialAnimationStartComponent()}
                            {buyUsPopUpTimerComponent()}


                        </div>
                    </div>
                    {backComponent()}
                    <div onClick={this.update} style={{borderRadius:'50%',height:75,width:75,position:'absolute',right:30,bottom:50,backgroundColor:'green',color:'white',textAlign:'center',justifyItems:'center',alignContent:'center',display:'flex'}}><b style={{alignSelf:'center'}}>اعمال تغییرات</b></div>
                </div>
            </div>
        )
    }
}

export default ControlPanelView