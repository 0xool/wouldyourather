import React, { useState, useEffect,Component } from 'react'
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

import {
Colors,        
} from 'react-native/Libraries/NewAppScreen';

import Database from '../../Database/Database'
import axios from 'react-native-axios'
import AsyncStorage from '@react-native-community/async-storage';

import Drawer from 'react-native-drawer'
import SMC from './SideMenuComponent/SideMenuComponent'
import Tapsell, { BannerAd } from "react-native-tapsell";

import { ZONE_IDS,SERVER_API_ADDRESS, AD_LIMIT } from '../../Utilities/Constants';
import Flurry from 'react-native-flurry-sdk';
import PopUp from './PopUp/PopUp'
import {getAdStatus,saveAdStatus,saveOfflineVote,getOfflineVote} from '../../Manager/UserManager'

import AddQuestion from '../AddQuesetion/AddQuestion'
import { connect } from 'react-redux';
import {hideAddQuestion,showAddQuestion,registeredForAdRemove,showProfileView} from '../../Redux/Actions/MainPageAction'

import CafeBazaar from 'react-native-cafe-bazaar'
import ProfileView from '../ProfileView/ProfileView/ProfileView'

//=============================================================================================================
// Variables
//=============================================================================================================
const menuImage = require('../../Images/menu.png')
const userImage = require('../../Images/user.png')
const bookmarkOn = require('../../Images/bookmark-on.png')

const bookmarkOff = require('../../Images/bookmark-off.png')

const questionDataJSON = require('../../Database/questions.json');
const db = new Database();  
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
        height: 70,  
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionText: {
        alignSelf: 'center',
        marginRight:20,
        marginLeft:20,
        textAlign:'center',
        color:'white',
        fontSize:20,
    }
});

//load data from db and show

//=============================================================================================================
const saveBackendCheck = async (check = 'false') => {
    try {
        await AsyncStorage.setItem('backendChecked', check)
    } catch (e) {
        // saving error
        console.log(e)
    }
}
//=============================================================================================================
const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
    main: {paddingRight: -3},
}
//=============================================================================================================
const AddQuestionView = (hide) => {
    return (
        <AddQuestion hide={hide}/>
    )
}

const bookmarkImage = (bookmarked) => {
    if(bookmarked) {
        return (<Image style={{width:25,height:25}} source={bookmarkOn}></Image>)
    }else{
        return(<Image style={{width:25,height:25}} source={bookmarkOff}></Image>)
    }
}
//=============================================================================================================
class MainGamePage extends Component {
//=============================================================================================================
// MARK : Construcor
//=============================================================================================================
    constructor(props) {
        super(props)
        this.state = {

            currentQuestion: null,
            viewState: "vote",
            questions: [],            
            index: 0,
            updateIndex:-1,
            isLoading: true,
            preLoadingView: true,
            backendChecked: false,
            serverData:[],
            videAdId: '',
            bannerAdId: '',
            adCounter: 0,
            bookmarkSaved: false,
        }

        this._onPressFirstQuestionButton = this._onPressFirstQuestionButton.bind(this)
        this._onPressSecondQuestionButton = this._onPressSecondQuestionButton.bind(this)
        this.getCurrentFirstQuestionPrecentage = this.getCurrentFirstQuestionPrecentage.bind(this)
        
        this.getCurrentSecondQuestionPrecentage = this.getCurrentSecondQuestionPrecentage.bind(this)
        this.adCounterCheckup = this.adCounterCheckup.bind(this)
        this.getQuestions = this.getQuestions.bind(this)
        
        this.sendVote = this.sendVote.bind(this) 
        this.getTapsellAd = this.getTapsellAd.bind(this)
        this.setupTapsell = this.setupTapsell.bind(this)
        
        this.getUserInAppPurchasesForAd = this.getUserInAppPurchasesForAd.bind(this)        
        this.updateQuestionWithBackend = this.updateQuestionWithBackend.bind(this)        
        this.questionBtnPressFunctionality = this.questionBtnPressFunctionality.bind(this)        
        
        this.profileClicked = this.profileClicked.bind(this)
        this.getData = this.getData.bind(this)
        this.bookmarkClicked = this.bookmarkClicked.bind(this)

        this.checkForNextDataBatch = this.checkForNextDataBatch.bind(this)

        this.getUserInAppPurchasesForAd()
        this.setupTapsell()
        this.updateQuestionWithBackend()

    }
//=============================================================================================================
    componentDidMount () {
        
    }
//=============================================================================================================     
    async getData()  {
        try {
            const value = await AsyncStorage.getItem('backendChecked')
            if(value !== null) {
            // value previously stored
            if (value == 'false') {                
                this.setState({backendChecked:false})
            }else if (value == 'true'){        
                try {
                    var offlineVotes = await AsyncStorage.getItem('offlineVote')
                    var array = JSON.parse(offlineVotes)
                    
                    if (offlineVotes != null ){                        
                        for (vote in array) {
                            axios.post(`${SERVER_API_ADDRESS}vote`,{_id:vote.id,voteNumber:vote.voteNumber}).then(
                                ).catch(err => {
                                    console.log(err)
                                }) 
                        }
                    }
                } catch (error) {
                    
                }                
                this.setState({backendChecked:true})
                }                    
            }else {
                saveBackendCheck()
            }
        } catch(e) {
            // error reading value
            console.log(e)
        }
    } 
//=============================================================================================================     
    getUserInAppPurchasesForAd () {
        CafeBazaar.open()
        .then(() => {                        
            CafeBazaar.loadOwnedItems()
                    .then((details) => {
                        if(details.indexOf('removeAd') !== -1){
                            this.props.registeredForAdRemove()
                        }
                        CafeBazaar.close()
                    })
                    .catch(err => {
                    console.log(`CafeBazaar err: ${err}`)
                    CafeBazaar.close()
                })
        })
        .catch(err => {console.log(`CafeBazaar err: ${err}`) 
    })
    }  
//=============================================================================================================   
    setupTapsell () {
        Tapsell.setRewardListener((zoneId , adId , completed , rewarded) => {
            // onAdShowFinished            
            console.log("onAdShowFinished");
        });

        this.getTapsellAd(false)
    }
//=============================================================================================================   
    updateQuestionWithBackend () {
        this.getData()
        axios.get(`${SERVER_API_ADDRESS}getAllQuestion`)
                    .then(response => {
                        this.setState({serverData:response.data})
                        saveBackendCheck('true')
                        this.setState({backendChecked:true})
                        return response.data
                    }).catch((err) => {

                    })                        
        db.initDB(() => {
            db.countDbData().then((data) => {
                // console.log(`here  ${data.toString()}`)
            })
            this.getQuestions()
            setTimeout(() => {
                this.setState({preLoadingView:false})
                this.setState({isLoading:false})                    
                setTimeout(() => {                    
                    global.firstLoad = false
                },4000)
            },1500)
        }).then( () => {
            //load data from back end and update
        })
    }
//=============================================================================================================   
    updateDatabaseData () {
        
        var databaseQ = this.state.questions
        var updateQ = this.state.serverData

        for (i = 0; i < updateQ.length; i++){
            var id = updateQ[i]._id
            var firstNumber = updateQ[i].firstQuestionVoteNumber
            var secondNumber = updateQ[i].secondQuestionVoteNumber
            var firstQuestion = updateQ[i].firstQuestion
            var secondQuestion = updateQ[i].secondQuestion
            var addNewData = true
            for ( j = 0; j < databaseQ.length; j++ ){
                var checkID = databaseQ[j].questionId

                if (checkID == id){
                    //update
                    var voted = databaseQ[j].voted
                    this.updateQuestionNumbers(id,firstNumber,secondNumber,voted)
                    addNewData = false
                }
            }            
            if (addNewData){
                this.saveQuestion(id,firstQuestion,secondQuestion,firstNumber,secondNumber)                
            }            
        }        
    }
//=============================================================================================================
    updateQuestionNumbers (id,firstNumber,secondNumber) {
        let data = {
            questionId: id,
            firstQuestionVoteNumber: firstNumber,
            secondQuestionVoteNumber: secondNumber,
            }
            db.updateQuestionVoteNumberForServerUpdate(data.questionId, data).then((result) => {
                console.log(result); 
            }).catch((err) => {
                console.log(err);
        })
    }
//=============================================================================================================    
    saveQuestion(questionId,firstQuestion,secondQuestion,firstQuestionVoteNumber,secondQuestionVoteNumber) {
        let data = {
            questionId: questionId,
            firstQuestion: firstQuestion,
            secondQuestion: secondQuestion,
            firstQuestionVoteNumber: firstQuestionVoteNumber,
            secondQuestionVoteNumber: secondQuestionVoteNumber,
            voted:0,
        }
        db.addQuestion(data).then((result) => {
            console.log(result);

        }).catch((err) => {
            console.log(err);
        })
    }
//=============================================================================================================
    getQuestions() {
        let questions = [];
        db.listAllUnvotedQuestions(questionDataJSON).then((data) => {
            questions = data;
            this.setState({currentQuestion:questions[0],questions:questions})
            this.checkForNextDataBatch(0)
        }).catch((err) => {
            console.log(err);
        })
    }
//=============================================================================================================
    updateQuestionVoteNumber() {
        let data = {
            questionId: this.state.currentQuestion.questionId,
            firstQuestionVoteNumber: this.state.currentQuestion.firstQuestionVoteNumber,
            secondQuestionVoteNumber: this.state.currentQuestion.secondQuestionVoteNumber,
        }
        db.updateQuestionVoteNumber(data.questionId, data).then((result) => {
            console.log(result); 
        }).catch((err) => {
            console.log(err);
        })
    }
//=============================================================================================================
    questionBtnPressFunctionality(questionNumber) {
        switch (this.state.viewState) {
            case "vote": 
                   
                Flurry.logEvent('Vote Question Event');                     
                if (this.state.currentQuestion == null){
                    this.setState({viewState:'finished'})
                    break
                }
                var question = this.state.currentQuestion
                if(questionNumber == 1){
                    question.firstQuestionVoteNumber += 1
                }else if (questionNumber == 2){
                    question.secondQuestionVoteNumber += 1
                }

                this.setState({viewState:"voted",currentQuestion:question})
                this.updateQuestionVoteNumber()  
                this.sendVote(questionNumber)    
                
                break;
            case "voted":                
                this.setState({bookmarkSaved:false})
                if (!this.props.removeAdRegistered){                    
                    this.adCounterCheckup()
                }
                if (this.state.questions.length == index){

                    this.setState({index:0})
                    var question = this.state.questions[index + 1]
                    this.setState({currentQuestion:question})

                    break
                }else{
                    var index = this.state.index
                    var question = this.state.questions[index + 1]
                    this.setState({currentQuestion: question , index: index + 1})
                    
                    this.checkForNextDataBatch(index)

                }
                this.setState({viewState:'vote'})
                break;
            case 'finished' :
                break
            default:

                break;
        }
    }
//=============================================================================================================
    _onPressFirstQuestionButton() {           
        this.questionBtnPressFunctionality(1)
    }
//=============================================================================================================
    profileClicked(){
        this.props.showProfileView()
    }
//=============================================================================================================
    async bookmarkClicked(){
        
         try {
            const username = await AsyncStorage.getItem('username')
            const id = await AsyncStorage.getItem('userID')
            if((username !== null && id !== null) && (username !== '' && id !== '')) {
                
                var value = this.state.bookmarkSaved                
                if (value){
                    this.setState({
                        bookmarkSaved: false
                    })
                    axios.post(`${SERVER_API_ADDRESS}deleteUserBookmarkById`,{bookmarkId:[this.state.currentQuestion.questionId],_id:id}).then(() => {
                    }).catch((err) => {
                        console.log(err)
                    }) 
                }else {
                    this.setState({
                        bookmarkSaved: true
                    })
                    
                    axios.post(`${SERVER_API_ADDRESS}addBookmark`,{q_id:this.state.currentQuestion.questionId,_id:id}).then((res) => {
                        
                    }).catch((err) => {
                        console.log(` ${err}`)
                    })  
                }
               
            }else {
                //major erro if u are here
                Alert.alert('برای ذخیره باید وارد شوید')
            }
        } catch(e) {
            // error reading value
            console.log(e)
        }
    }
//=============================================================================================================
    checkForNextDataBatch (index) {

        const batchNumber = 50
        if (Math.floor((index + 1)/batchNumber) != this.state.updateIndex){               
            const newUpdateIndex = this.state.updateIndex + 1
            this.setState({
                updateIndex:newUpdateIndex,
            })
            //get next 50 batch data
            var q = this.state.questions
            var updateArray = q.slice(newUpdateIndex * batchNumber , newUpdateIndex * batchNumber + batchNumber)

            var reqArray = []
            for (arr of updateArray){
                reqArray.push({questionId:arr.questionId})
            }
        
            axios.post(`${SERVER_API_ADDRESS}getBatchQuestionUpdate`,{questionBatch:reqArray}).then((result) => {
                if (result.data.length == 0){

                    return
                }                                            
                    // Alert.alert('got batch')
                    var temp = this.state.questions
                    var limit = (batchNumber > result.data.length) ? result.data.length : batchNumber                     
                    for (var i = 0; i < limit;i++){
                        var index = newUpdateIndex * batchNumber + i
                        temp[index].firstQuestionVoteNumber = result.data[i].firstQuestionVoteNumber
                        temp[index].secondQuestionVoteNumber = result.data[i].secondQuestionVoteNumber
                    }

                    this.setState({
                        questions:temp,
                        currentQuestion:temp[newUpdateIndex * batchNumber],
                    })
                                        
            }).catch(err => {
                    console.log(`maybe ${err}`)
                }) 
        } 
    }
//=============================================================================================================
    sendVote (voteNumber) {
        if (this.state.backendChecked){
            axios.post(`${SERVER_API_ADDRESS}vote`,{_id:this.state.currentQuestion.questionId,voteNumber:voteNumber}).then(
                ).catch(err => {
                    console.log(`maybe ${err}`)
                }) 
        }else{
            saveOfflineVote({id:this.state.currentQuestion.questionId,voteNumber:voteNumber})
        }
    }
//=============================================================================================================
    adCounterCheckup () {        
        if (this.state.adCounter == AD_LIMIT - 1 ){
            this.setState({adCounter:0})
            //show add
            // var rand = Math.floor((Math.random() * 2) + 1);
            var rand = 2
            var id
            switch (rand) {
                case 1:
                    id = this.state.videAdId
                    this.getTapsellAd(false)
                    break;
                case 2:
                    id = this.state.bannerAdId
                    this.getTapsellAd(false)
                    break;
                default:
                    break;
            }

            Tapsell.showAd({
                ad_id: id,
                back_disabled:  true,
                immersive_mode: false,
                rotation_mode: Tapsell.ROTATION_UNLOCKED,
                show_exit_dialog: true
            })
        }else{
            var counter = this.state.adCounter + 1
            this.setState({adCounter:counter})
        }
    }
//=============================================================================================================
    getTapsellAd(videoType) {
        const adType = (videoType) ? ZONE_IDS.INTERSTITIAL_VIDEO : ZONE_IDS.INTERSTITIAL_BANNER
        
        Tapsell.requestAd(adType,true,(zoneId,adId) => {
            if (videoType){
                this.setState({videAdId:adId})
            }else{
                this.setState({bannerAdId:adId})
            }
            
        },() => {console.log('no ad');

        } , (zone,err) => {console.log('no network');

        } , (zoneId,err)=>{console.log('error:');

        } , () => {console.log('====================================');
        console.log('expired');
        console.log('====================================');})
    }
//=============================================================================================================
    _onPressSecondQuestionButton() {
        this.questionBtnPressFunctionality(2)
    }
//=============================================================================================================
    getCurrentFirstQuestion () {
        if (this.state.isLoading)
            return ''

        if (this.state.currentQuestion != null){
            return this.state.currentQuestion.firstQuestion
        }else {
            return 'سوال تمام شد :('
        }
    }
//=============================================================================================================
    getCurrentFirstQuestionPrecentage () {
        
        if (this.state.currentQuestion != null){
            console.log(this.state.currentQuestion.firstQuestionVoteNumber)
            if (this.state.viewState == 'voted'){
                var total = this.state.currentQuestion.firstQuestionVoteNumber + this.state.currentQuestion.secondQuestionVoteNumber
                var current = this.state.currentQuestion.firstQuestionVoteNumber
                var c = Math.floor( current / total * 100)                
                if (this.state.backendChecked){
                    return `${c} %`
                }
                return ''
            }
            return ''
        }
        return ''
    }
//=============================================================================================================
    getCurrentSecondQuestionPrecentage () {
        if (this.state.currentQuestion != null){
            if (this.state.viewState == 'voted'){
                var total = this.state.currentQuestion.firstQuestionVoteNumber + this.state.currentQuestion.secondQuestionVoteNumber
                var current = this.state.currentQuestion.secondQuestionVoteNumber
                var c = Math.floor( current / total * 100)
                if (this.state.backendChecked){
                    return `${c} %`
                }
                return ''
            }
            return ''
        }
        return ''
    }
//=============================================================================================================
    getCurrentSecondQuestion () {
        if (this.state.isLoading)
            return ''

        if (this.state.currentQuestion != null){
            return this.state.currentQuestion.secondQuestion
        }else {
            return 'سوال تمام شد؟ :('
        }
    }
//=============================================================================================================
// MARK : Render
//=============================================================================================================
    render () {

        const netwokrPopUp = () => {
            if (this.state.backendChecked)
                return (<View></View>)
            return (<PopUp/>)

        }

        const gameView = () => {
            return (
                <Drawer type="overlay"
                side={'right'}
                content={<SMC />}
                ref={(ref) => this._drawer = ref}
                tapToClose={true}
                openDrawerOffset={0.6} 
                panCloseMask={0.6}
                styles={drawerStyles}
                tweenHandler={(ratio) => ({
                    main: { opacity:(2-ratio)/2 }
                })}
                >
                    
                <View  style = { {backgroundColor:'#292929'}}>
                        <StatusBar style = { {backgroundColor:'#292929'}} barStyle="dark-content" />
                        <SafeAreaView>
                            <View style={styles.gameView}>

                                <View style={styles.headerView}>
                                    <TouchableOpacity onPress={() => {this.bookmarkClicked()}} style={{height:50,width:50,position:'absolute',top:0,right:50,alignContent:'center',justifyContent:'center'}}>
                                            {bookmarkImage(this.state.bookmarkSaved)}                                        
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {this._drawer.open()}} style={{height:50,width:50,position:'absolute',top:0,right:0,alignContent:'center',justifyContent:'center'}}>
                                        <Image style={{width:25,height:25}} source={menuImage}></Image>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {this.profileClicked()}} style={{height:50,width:50,position:'absolute',top:0,left:16,alignContent:'center',justifyContent:'center'}}>
                                        <Image style={{width:25,height:25}} source={userImage}></Image>
                                    </TouchableOpacity>
                                    <Text style={{fontSize:25,color:'white'}}> کدومش؟</Text>
                                </View>
                                
                                <TouchableHighlight style={styles.firstQuestionView} onPressIn={this._onPressFirstQuestionButton}  underlayColor="#aaadab4f" >
                                    <View ><Text style={styles.questionText}>{this.getCurrentFirstQuestion()}</Text><Text style={styles.questionText}>{this.getCurrentFirstQuestionPrecentage()}</Text></View>
                                </TouchableHighlight>
                                <View style={styles.midLineView}>
                                    <View style={styles.orView}>
                                        <Text style={{color:'white',fontSize:20}}>یا</Text>
                                    </View>
                                </View>

                                <TouchableHighlight style={styles.secondQuestionView} onPressIn={this._onPressSecondQuestionButton}  underlayColor="#aaadab4f" >
                                    <View>
                                        <Text style={styles.questionText}>{this.getCurrentSecondQuestion()}</Text><Text style={styles.questionText}>{this.getCurrentSecondQuestionPrecentage()}</Text>
                                    </View>
                                </TouchableHighlight>
                                {netwokrPopUp()}
                            </View>
                        </SafeAreaView>                    
                    </View>
                </Drawer>
                )
            }

            if (this.state.preLoadingView){
                return (
                    <View  style = { {backgroundColor:'#292929',height:'100%',width:'100%'}}></View>
                )
            }
            switch (this.props.isMainPageGameView) {
                case 'addQuestion':                    
                    return AddQuestionView()

                case 'profileView':
                    Flurry.logEvent('Profile Entered');
                    return(<ProfileView/>)

                case 'gameView':
                    return gameView()
            
                default:
                    return gameView()
            }            
        }
}
//=============================================================================================================
// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {
// Redux Store --> Component
return {
    isMainPageGameView: state.mainPageReducer.isMainPageGameView,
    removeAdRegistered: state.mainPageReducer.removeAdRegistered,
};
};
//=============================================================================================================
// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
// Action
    return {
    showAddQuestion: () => dispatch(showAddQuestion()),
    hideAddQuestion: () => dispatch(hideAddQuestion()),
    registeredForAdRemove: () => dispatch(registeredForAdRemove()),
    showProfileView: () => dispatch(showProfileView())
    };
};

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(MainGamePage);

