import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Alert,
    Text,
    TouchableHighlight,    
    Keyboard,
    TextInput,
    TouchableWithoutFeedback,
    } from 'react-native';
import {changeViewToSignup,changeViewToLogin,changeViewToProfile} from '../../Redux/Actions/ProfilePageAction'
import { connect } from 'react-redux';
import Flurry from 'react-native-flurry-sdk';
import axios from 'react-native-axios'
import { SERVER_API_ADDRESS } from '../../Utilities/Constants';
import AsyncStorage from '@react-native-community/async-storage';


    const styles = StyleSheet.create({
        singupBackground: {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#292929',
            width: '100%',
            height: '100%',
        },
        backgroundEffect: {
            position:'absolute',
            width:'50%',
            height:'100%',
            top:0,
            left:0,
            backgroundColor:'#2467e2'    
        },
        singupMenu: {
            borderRadius: 10,
            backgroundColor: '#d42222',                    
            justifyContent: 'center',
            alignItems: 'center',
            width:'80%',
            height:'75%',
        },
        usernameView: {
            margin: 8,
            backgroundColor: '#292929',
            height:50,
            width: '80%',
            borderRadius: 10,
            zIndex:5,
            justifyContent: 'center',
            alignItems: 'center',
        },
        passwordView: {
            margin: 8,
            backgroundColor: '#292929',
            height:50,
            width: '80%',
            borderRadius: 10,
            zIndex:5,
            justifyContent: 'center',
            alignItems: 'center',
        },
        emailView: {
            margin: 8,
            backgroundColor: '#292929',
            height:50,
            width: '80%',
            borderRadius: 10,
            zIndex:5,
            justifyContent: 'center',
            alignItems: 'center',
        },
        singupMenuText: {
            // position:'absolute',
            color:'white',
            // top:'10%',
            // alignSelf:'center',
            
            fontSize: 30,
            marginBottom:8,
        },
        singupMenuBottonText: {
            // position:'absolute',
            color:'white',
            // top:'10%',
            // alignSelf:'center',
            
            fontSize: 22,
            marginBottom:2,
        },
        buttonView: {
            height:100,
            width: '85%',
            borderRadius: 10,
            zIndex:5,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection:'row'
        },
        inputStyle: {
            borderWidth: 0,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign:'center',
            fontSize: 15,
            color:'white',            
        },
    });

//=============================================================================================================
const saveUserInfo = async (username,email,userID) => {
    try {
        
        await AsyncStorage.setItem('username', username)
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('userID', userID)
    } catch (e) {
        // saving error
        console.log(e)
    }
}

class SignupView extends Component {
    
    constructor(){
        super()
        this.state = {
            isLoading: true,
            username:'',
            password:'',
            repeatPassword:'',
            email:'',
        }

        this.usernameTextChange = this.usernameTextChange.bind(this)
        this.passwordTextChange = this.passwordTextChange.bind(this)
        this.repeatPasswordTextChange = this.repeatPasswordTextChange.bind(this)
        this.emailTextChange = this.emailTextChange.bind(this)
        this.backToLogin = this.backToLogin.bind(this)
        this.signup = this.signup.bind(this)
    }

    passwordTextChange(text) {
        this.setState({
            password:text,
        })
    }

    usernameTextChange(text){
        this.setState({
            username:text,
        })
    }

    repeatPasswordTextChange(text) {
        this.setState({
            repeatPassword: text,
        })
    }

    emailTextChange(text) {
        this.setState({
            email: text,
        })
    }

    signup() {
        if (this.state.username == null || this.state.username == ''){
            Alert.alert('خطا در نام کاربری' , 'نام کاربری خود را وارد کنید',[{text:'باشه'}])
            return
        }else if (this.state.password == null || this.state.password == ''){
            Alert.alert('خطا در رمز عبور' , 'رمز عبور خود را وارد کنید',[{text:'باشه'}])
            return
        }else if (this.state.password == null || this.state.password == ''){
            Alert.alert('خطا در رمز عبور' , 'تکرار رمز عبور خود را وارد کنید',[{text:'باشه'}])
            return
        }else if (this.state.password == null || this.state.password == ''){
            Alert.alert('خطا در ایمیل' , 'ایمیل خود را وارد کنید',[{text:'باشه'}])
            return
        }

        if (this.state.password != this.state.repeatPassword){
            Alert.alert('خطا در رمز عبور' , 'رمز عبور با تکرار یکسان نمی باشد',[{text:'باشه'}])
            return
        }

        this.setState({isLoading:true})
        Flurry.logEvent('SignUp Event');
        axios.post(`${SERVER_API_ADDRESS}createUser`,{username:this.state.username,password:this.state.password,email:this.state.email}).then( (res) => {
            
            this.setState({isLoading:false}) 
            saveUserInfo(this.state.username,this.state.email,res.data.id.toString()) 

            this.props.changeViewToProfile()
            this.props.reload()    
            Alert.alert(
                'حساب شما با موفقیت ساخته شد',
                'خوش آمدید',
                [ 
                 {text: 'باشه'}
                ],
                {cancelable: false},
              )
        }).catch(err => {    
            this.setState({isLoading:false})  
            console.log(err)      
            Alert.alert(
                'اشکال در بر قراری ارتباط با سرور',
                '',
                [ 
                 {text: 'باشه'}
                ],
                {cancelable: false},
              )
            })
    }

    backToLogin() {
        this.setState({isLoading:false})   
        this.props.changeViewToLogin()     
    }
    
    render () {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style = { {backgroundColor:'#292929' , height:'100%' , width:'100%'}}>
                <View style={styles.singupBackground}>                    
                    <View style={styles.singupMenu}>
                        <View style={styles.backgroundEffect}/>
                        <Text style={styles.singupMenuText}>ثبت نام در کدومش</Text>
                        <View style={styles.usernameView}>
                            <TextInput  ref={input => { this.firsTextInput = input }} onChangeText={text => this.usernameTextChange(text)} placeholder='نام کاربری' style={styles.inputStyle} placeholderTextColor="white"></TextInput>
                        </View>
                        <View style={styles.passwordView}>
                            <TextInput secureTextEntry={true} ref={input => { this.passwordTextInput = input }} onChangeText={text => this.passwordTextChange(text)} placeholder='رمز عبور' style={styles.inputStyle} placeholderTextColor="white"></TextInput>
                        </View>
                        <View style={styles.passwordView}>
                            <TextInput secureTextEntry={true} ref={input => { this.repeatPasswordTextInput = input }} onChangeText={text => this.repeatPasswordTextChange(text)} placeholder=' تکرار رمز عبور ' style={styles.inputStyle} placeholderTextColor="white"></TextInput>
                        </View>
                        <View style={styles.emailView}>
                            <TextInput ref={input => { this.emailTextInput = input }} onChangeText={text => this.emailTextChange(text)} placeholder='ایمیل' style={styles.inputStyle} placeholderTextColor="white"></TextInput>
                        </View>
                        <View style={styles.buttonView}>
                            <TouchableHighlight onPress={() => {if (this.state.isLoading) this.signup()}} style={{backgroundColor: '#292929',alignItems:'center',justifyContent:'center',borderRadius:10,position:'absolute',width:'45%',height:'40%',right:8}}>
                                <Text style={styles.singupMenuBottonText}>ثبت نام</Text>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={() => {if (this.state.isLoading) this.backToLogin()}} style={{backgroundColor: '#292929',alignItems:'center',justifyContent:'center',borderRadius:10,position:'absolute',width:'45%',height:'40%',left:8}}>
                                <Text style={styles.singupMenuBottonText}>بازگشت</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

//=============================================================================================================
// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {
// Redux Store --> Component
return {
    viewStatus: state.profilePageReducer.viewStatus,        
};
};
//=============================================================================================================
// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
// Action
    return {
        changeViewToSignup: () => dispatch(changeViewToSignup()),
        changeViewToLogin: () => dispatch(changeViewToLogin()),
        changeViewToProfile: () => dispatch(changeViewToProfile()),
    };
};

// Exports
export default connect(null, mapDispatchToProps)(SignupView);