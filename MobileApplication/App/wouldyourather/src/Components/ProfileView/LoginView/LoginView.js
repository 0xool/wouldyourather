import React, { Component } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    View,
    Image,
    Alert,
    Text,
    StatusBar,
    TouchableHighlight,
    TouchableOpacity,
    Animated,
    Button,
    Keyboard,
    TextInput,
    TouchableWithoutFeedback,
    } from 'react-native';
import {changeViewToSignup,changeViewToLogin,changeViewToProfile} from '../../../Redux/Actions/ProfilePageAction'

import { connect } from 'react-redux';
import Flurry from 'react-native-flurry-sdk';
import axios from 'react-native-axios'

import { SERVER_API_ADDRESS } from '../../../Utilities/Constants';
import AsyncStorage from '@react-native-community/async-storage';
import {hideProfileView} from '../../../Redux/Actions/MainPageAction'


    const styles = StyleSheet.create({
        loginBackground: {
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
        loginMenu: {
            borderRadius: 10,
            backgroundColor: '#d42222',                    
            justifyContent: 'center',
            alignItems: 'center',
            width:'80%',
            height:'65%',
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
            margin: 20,
            backgroundColor: '#292929',
            height:50,
            width: '80%',
            borderRadius: 10,
            zIndex:5,
            justifyContent: 'center',
            alignItems: 'center',
        },
        loginMenuText: {
            // position:'absolute',
            color:'white',
            // top:'10%',
            // alignSelf:'center',
            
            fontSize: 30,
            marginBottom:8,
        },
        loginMenuBottonText: {
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
        
        
        
        headerView: {
            // backgroundColor: '#292929',
            // height: 50,  
            // justifyContent: 'center',
            // alignItems: 'center',
        },
        footerView: {
            backgroundColor: '#292929',
            height: 70,  
            justifyContent: 'center',
            alignItems: 'center',
        },
        questionText: {
            alignSelf: 'center',
            color:'white',
            fontSize:20,
        }
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

var backImage = require('../../../Images/back.png')


class LoginView extends Component {
    
    constructor(){
        super()
        this.state = {
            isLoading: true,
            username:'',
            password:'',
        }

        this.usernameTextChange = this.usernameTextChange.bind(this)
        this.passwordTextChange = this.passwordTextChange.bind(this)
        this.login = this.login.bind(this)
        this.signup = this.signup.bind(this)
        this.backToGame = this.backToGame.bind(this)
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

    login() {
        if (this.state.username == null || this.state.username == ''){
            Alert.alert('خطا در ایمیل' , 'ایمیل خود را وارد کنید',[{text:'باشه'}])
            return
        }else if (this.state.password == null || this.state.password == ''){
            Alert.alert('خطا در رمز عبور' , 'رمز عبور خود را وارد کنید',[{text:'باشه'}])
            return
        }

        this.setState({isLoading:true})
        Flurry.logEvent('Login Event');
        axios.post(`${SERVER_API_ADDRESS}userLogin`,{email:this.state.username,password:this.state.password}).then((res) => {            
            saveUserInfo(res.data.doc.username.toString(),res.data.doc.email.toString(),res.data.doc._id.toString())
            this.props.changeViewToProfile()
            this.props.reload()
        }).catch(err => {            
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

    signup() {
        this.setState({isLoading:false})   
        this.props.changeViewToSignup()
    }

    backToGame() {
        this.props.hideProfileView()
    }
    
    render () {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style = { {backgroundColor:'#292929' , height:'100%' , width:'100%'}}>
                <View style={styles.loginBackground}> 
                    <TouchableOpacity onPress={() => {this.backToGame()}} style={{alignItems:'center',justifyContent:'center',borderRadius:25,position:'absolute',backgroundColor:'white',width:30,height:30,left:16,top:16}}>
                    <Image style={{height:'50%',width:'50%'}} source={backImage}></Image>
                    </TouchableOpacity>                    
                    <View style={styles.loginMenu}>
                        <View style={styles.backgroundEffect}/>
                        <Text style={styles.loginMenuText}>ورود به کدومش</Text>
                        <View style={styles.usernameView}>
                            <TextInput  ref={input => { this.firsTextInput = input }} onChangeText={text => this.usernameTextChange(text)} placeholder='ایمیل' style={styles.inputStyle} placeholderTextColor="white"></TextInput>
                        </View>
                        <View style={styles.passwordView}>
                            <TextInput secureTextEntry={true} ref={input => { this.firsTextInput = input }} onChangeText={text => this.passwordTextChange(text)} placeholder='رمز عبور' style={styles.inputStyle} placeholderTextColor="white"></TextInput>
                        </View>
                        <View style={styles.buttonView}>
                            <TouchableHighlight onPress={() => {if (this.state.isLoading) this.login()}} style={{backgroundColor: '#292929',alignItems:'center',justifyContent:'center',borderRadius:10,position:'absolute',width:'45%',height:'40%',right:8}}>
                                <Text style={styles.loginMenuBottonText}>ورود</Text>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={() => {if (this.state.isLoading) this.signup()}} style={{backgroundColor: '#292929',alignItems:'center',justifyContent:'center',borderRadius:10,position:'absolute',width:'45%',height:'40%',left:8}}>
                                <Text style={styles.loginMenuBottonText}>ثبت نام</Text>
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
        hideProfileView: () => dispatch(hideProfileView()),
    };
};

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(LoginView);