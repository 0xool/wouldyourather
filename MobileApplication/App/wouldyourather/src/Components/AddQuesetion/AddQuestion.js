import React, { Component } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    View,
    Image,
    Text,
    TextInput,
    StatusBar,
    Alert,
    Keyboard,
    TouchableHighlight,
    TouchableWithoutFeedback,
    } from 'react-native';

import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Flurry from 'react-native-flurry-sdk'
import axios from 'react-native-axios'
import {goHome, goAddQuestion} from '../../Screens/Navigation/Navigation'
import AsyncStorage from '@react-native-community/async-storage';


import { SERVER_API_ADDRESS } from '../../Utilities/Constants';
import { connect } from 'react-redux';
import {hideAddQuestion,showAddQuestion} from '../../Redux/Actions/MainPageAction'

import { BackHandler } from 'react-native';


var plusImage = require('../../Images/plus.png')
var backImage = require('../../Images/back.png')


const styles = StyleSheet.create({
    gameView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: Colors.black,
        width: '100%',
        height: '100%',
    },
    firstQuestionView: {
        backgroundColor: '#d42222',
        flexGrow:1 ,        
        justifyContent: 'center',
        alignItems: 'center',
    },
    orView: {
        backgroundColor: '#292929',
        height:50,
        width: 50,
        borderRadius: 25,
        zIndex:5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondQuestionView: {
        backgroundColor: '#2467e2',
        flexGrow:1 ,
        justifyContent: 'center',
        alignItems: 'center',
    },
    midLineView: {
        backgroundColor: '#292929',
        height: 10,  
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:5,
    },
    headerView: {
        backgroundColor: '#292929',
        height: 50,  
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerView: {
        backgroundColor: '#292929',
        height: 60,  
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionText: {
        alignSelf: 'center',
        color:'white',
        fontSize:20,

    },
    inputStyle: {
        width:200,
        borderWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign:'center',
        fontSize: 20,
        color:'white',
    },
  });

class AddQuestion extends Component {

    constructor() {
        super()
        this.state = {
            isLoading: true,
            firstQuestionInput:'',
            secondQuestionInput:'',
        }
    
        // this.getQuestions = this.getQuestions.bind(this)
        this.saveQuestion = this.saveQuestion.bind(this)
        this.firstQuestionTextChange = this.firstQuestionTextChange.bind(this)
        this.secondQuestionTextChange = this.secondQuestionTextChange.bind(this)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.submit = this.submit.bind(this);

        //load data from db and show
        }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    }

    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.hide()
        return true;
    }

    componentDidMount () {
        
        }
    
    saveQuestion(firstQuestion,secondQuestion) {

        }

    firstQuestionTextChange (text) {
        this.setState({firstQuestionInput:text})
    }

    secondQuestionTextChange (text) {
        this.setState({secondQuestionInput:text})
    }

    async getUserInfo(qID){
        try {
            const username = await AsyncStorage.getItem('username')
            const id = await AsyncStorage.getItem('userID')
            if(username !== null  && id !== null) {
                axios.post(`${SERVER_API_ADDRESS}addToUserQuestionById`,{q_id:qID,_id:id}).then(() => {
                }).catch((err) => {
                    console.log(err)
                })     
            }else {
                //major erro if u are here
            }
        } catch(e) {
            // error reading value
            console.log(e)
        }
    }

    submit (){
        Flurry.logEvent('Add Question Event');
        axios.post(`${SERVER_API_ADDRESS}postQuestion`,{firstQuestion:this.state.firstQuestionInput,secondQuestion:this.state.secondQuestionInput}).then( (res) => {
            Alert.alert(
                'سوال اضافه شد',
                'سوال شما با موفقیت ثبت شد!',
                [
                  {text: 'بازی کردن', onPress: () => this.props.hideAddQuestionRedux()},
                  {text: 'اضافه کردن سوال', onPress: () => {
                      //reset page state
                      this.firsTextInput.clear()
                      this.secondTextInput.clear()
                  }},
                ],
                {cancelable: false},
              )
                //if use has logged in add question to user                
                this.getUserInfo(res.data.id)
            }).catch(err => {
            Alert.alert(
                'اشکال در بر قراری ارتباط با سرور',
                'سوال ثبت نشد',
                [ 
                 {text: 'باشه', onPress: () => console.log('OK Pressed')}
                ],
                {cancelable: false},
              )
            }) 
    }

    backBtnClicked (){
        this.props.hide()
    }
    
    render () {

        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style = { {backgroundColor:'#292929' , height:'100%' , width:'100%'}}>
                <View  style = { {backgroundColor:'#292929' , height:'100%' , width:'100%'}}>
                        <StatusBar style = { {backgroundColor:'#292929'}} barStyle="dark-content" />
                        <SafeAreaView style={{backgroundColor:'#292929'}}>
                            <View style={styles.gameView}>
                                
                                <View style={styles.headerView}><Text style={{fontSize:25,color:'white'}}>اضافه کردن سوال</Text></View>
                                
                                <View style={styles.firstQuestionView}><TextInput ref={input => { this.firsTextInput = input }} onChangeText={text => this.firstQuestionTextChange(text)} placeholder='وارد کردن سوال اول' style={styles.inputStyle}></TextInput></View>
                                
                                <View style={styles.midLineView}>
                                    <View style={styles.orView}>
                                        <Text style={{color:'white',fontSize:20}}>یا</Text>
                                    </View>
                                </View>    

                                <View style={styles.secondQuestionView}><TextInput ref={input => { this.secondTextInput = input }} onChangeText={text => this.secondQuestionTextChange(text)} placeholder='وارد کردن سوال دوم' style={styles.inputStyle}></TextInput></View>
                                
                                <View style={styles.footerView}></View>
                                <TouchableHighlight onPress={() => {if (this.state.isLoading) this.submit()}} style={{alignItems:'center',justifyContent:'center',borderRadius:25,position:'absolute',backgroundColor:'white',width:50,height:50,right:16,bottom:'10%'}}>
                                    <Image style={{height:'50%',width:'50%'}} source={plusImage}></Image>
                                </TouchableHighlight>    
                                <TouchableHighlight onPress={() => {if (this.state.isLoading) this.props.hideAddQuestionRedux()}} style={{alignItems:'center',justifyContent:'center',borderRadius:25,position:'absolute',backgroundColor:'white',width:50,height:50,left:16,bottom:'10%'}}>
                                    <Image style={{height:'50%',width:'50%'}} source={backImage}></Image>
                                    </TouchableHighlight>    
                            </View>
                            
                        </SafeAreaView>
                    
                    </View>
                </TouchableWithoutFeedback>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    // Action
      return {
        hideAddQuestionRedux: () => dispatch(hideAddQuestion()),
     };
  };
  
  // Exports
  export default connect(null,mapDispatchToProps)(AddQuestion);
