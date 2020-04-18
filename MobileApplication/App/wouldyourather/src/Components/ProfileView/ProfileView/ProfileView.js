import React , {Component} from 'react'
import LoginView from '../LoginView/LoginView.js'
import SignupView from '../SignupView.js'


import ListView from './ListComponent/ListComponent'
import {changeViewToSignup,changeViewToLogin,changeViewToProfile} from '../../../Redux/Actions/ProfilePageAction'
import {hideProfileView} from '../../../Redux/Actions/MainPageAction'


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
    } from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { SERVER_API_ADDRESS } from '../../../Utilities/Constants';


import axios from 'react-native-axios'

var backImage = require('../../../Images/back.png')
var logoutImage = require('../../../Images/logout.png')
const styles = StyleSheet.create({
    profileBackground: {
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
    profileInfoView: {
        backgroundColor: '#292929',                    
        justifyContent: 'center',
        alignItems: 'center',
        width:'100%',
        height:'25%',
    },
    profileChoiceView: {
        backgroundColor: '#3E6259',
        height:'10%',
        width: '100%',
        zIndex:5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:'row'
    },
    listView: {        
        backgroundColor: '#3E6259',        
        width: '100%',
        height:'65%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginMenuText: {
        color:'white',        
        fontSize: 30,
        marginBottom:8,
    },
    loginMenuBottonText: {
        color:'white',        
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
    },
    boxWithShadow: {
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.8,
        shadowRadius: 1,  
    }
});

const listView = (data,text) => {    
    if (data != null && data.length > 0){
        return (<ListView data={data} text={text}></ListView>)
    }else return(<View style={{backgroundColor:'#292929'}}><Text style={{color:'white',fontSize:15}}>سوالی وجود ندارد</Text></View>)
}

const profileView = (currentView,data,username,email,onQuestionPress,onBookmarkPress,onBackPress,text,signout) => {
    return (
        <View style={styles.profileBackground, styles.boxWithShadow}>
            <View style={styles.profileInfoView}>
                <TouchableOpacity onPress={() => {onBackPress()}} style={{alignItems:'center',justifyContent:'center',borderRadius:25,position:'absolute',backgroundColor:'white',width:30,height:30,left:16,top:16}}>
                <Image style={{height:'50%',width:'50%'}} source={backImage}></Image>
                </TouchableOpacity> 
                <TouchableOpacity onPress={() => {signout()}} style={{alignItems:'center',justifyContent:'center',borderRadius:25,position:'absolute',backgroundColor:'white',width:30,height:30,right:16,top:16}}>
                <Image style={{height:'50%',width:'50%'}} source={logoutImage}></Image>
                </TouchableOpacity> 
                <Text style={{fontSize:40,color:'white'}}>{username}</Text>
                <Text style={{fontSize:8,color:'white'}}>{email}</Text>
            </View>
            <View style={styles.profileChoiceView}>
                <TouchableHighlight onPress={() => {onQuestionPress()}} style={{alignItems:'center',justifyContent:'center',position:'absolute',width:'48%',height:'100%',right:8}}>
                    <Text style={{fontSize:15,color:'white'}}>سوال های ساخته شده من</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {onBookmarkPress()}} style={{alignItems:'center',justifyContent:'center',position:'absolute',width:'48%',height:'100%',left:8}}>
                    <Text style={{fontSize:15,color:'white'}}>سوال های ذخیره شده من</Text>
                </TouchableHighlight>
                <View style={{height:5,width:'100%',position:'absolute',bottom:0,left:0,right:0,backgroundColor:'#292929'}}></View>
                <View style={{height:'100%',width:5,alignSelf:'center',position:'absolute',backgroundColor:'#292929'}}></View>
            </View>
            <View style={styles.listView}>
                {listView(data,text)}
            </View>
        </View>
    )
}

const signUserOut = async () => {
    try {
        await AsyncStorage.setItem('username', ' ')
        await AsyncStorage.setItem('email', ' ')
        await AsyncStorage.setItem('userID', ' ')
    } catch (e) {
        // saving error
        console.log(e)
    }
}

class ProfileView extends Component {
    
    constructor (){
        super()
        this.state = {
            isLoading: true,
            questions:[],
            bookmarks:[],
            // question for user question and bookmark for user bookmarks
            username:'',
            email:'',
            currentView:'question'
        }
        this.getUserInfo = this.getUserInfo.bind(this)
        this.onBookmarkPress = this.onBookmarkPress.bind(this)
        this.onQuestionPress = this.onQuestionPress.bind(this)
        this.onBackPress = this.onBackPress.bind(this)
        this.signOut = this.signOut.bind(this)
        this.reloadView = this.reloadView.bind(this)
    }
    
    componentWillMount(){
        //update if user has logged in
        this.getUserInfo()
        this.forceUpdate()
    }


    onBookmarkPress() {
        this.setState({
            currentView:'bookmark'
        })
    }

    onQuestionPress() {
        this.setState({
            currentView:'question'
        })
    }

    onBackPress(){
        this.props.hideProfileView()
    }

    signOut() {
        signUserOut()
        this.props.changeViewToLogin()
    }

    reloadView(){
        this.getUserInfo()
        this.forceUpdate()
    }
    
    getUserInfo = async () => {
        try {
            const username = await AsyncStorage.getItem('username')
            const email = await AsyncStorage.getItem('email')
            const id = await AsyncStorage.getItem('userID')

            
            if(username !== null && email !== null && id !== null && username !== '' && email !== '' && id !== '') {
                if (this.props.viewStatus != 'profile'){
                    changeViewToProfile()
                }
                this.setState({
                    username:username,
                    email:email,
                })
                // value previously stored
                axios.get(`${SERVER_API_ADDRESS}getAllUserQuestions`,{params:{_id:id.toString()}}).then((res) => {                    
                    this.setState({
                        questions:res.data
                    })
                    axios.get(`${SERVER_API_ADDRESS}getAllUserBookmarks`,{params:{_id:id.toString()}}).then((res) => {
                        this.setState({
                            bookmarks:res.data
                        })   
                    }).catch((err) => {
                        console.log(err)                    
                        //change to main game view with network error
                    })
                }).catch((err) => {
                    console.log(err)                    
                    //change to main game view with network error
                })      
            }else {
                //major erro if u are here
            }
        } catch(e) {
            // error reading value
            console.log(e)
        }
    } 

    render () {
        if(this.state.username == '' || this.state.username == null || this.state.username == ' '){
            this.getUserInfo()
        }

        switch (this.props.viewStatus) {
            case 'login':
                return(<LoginView reload={this.reloadView}/>)                
            case 'signup':
                return(<SignupView reload={this.reloadView}></SignupView>)        
            case 'profile':
                var data 
                var text
                if(this.state.currentView == 'bookmark'){
                    data = this.state.bookmarks
                    text = 'سوال های ذخیره شده من'
                }else if (this.state.currentView == 'question'){
                    data = this.state.questions
                    text = 'سوال های ساخته شده من'
                }
                return(profileView(this.state.currentView,data,this.state.username,this.state.email,this.onQuestionPress,this.onBookmarkPress,this.onBackPress,text,this.signOut))
            default:                
                return (
                    <View style={{backgroundColor:'#292929'}}></View>
                )
        }
    }
}

//=============================================================================================================
// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {
    // Redux Store --> Component
    return {
        viewStatus: state.profilePageReducer.viewStatus, 
        username: state.profilePageReducer.username, 
        email: state.profilePageReducer.email, 
        id: state.profilePageReducer.id,        
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
    export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);
    
    