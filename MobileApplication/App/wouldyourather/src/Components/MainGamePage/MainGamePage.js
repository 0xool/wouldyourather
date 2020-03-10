import React, { Component } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    View,
    Image,
    Text,
    StatusBar,
    TouchableHighlight,
    } from 'react-native';

import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Database from '../../Database/Database'
import axios from 'react-native-axios'
import AsyncStorage from '@react-native-community/async-storage';
import Drawer from 'react-native-drawer'
import SMC from './SideMenuComponent/SideMenuComponent'
import Tapsell, { BannerAd } from "react-native-tapsell";
import { ZONE_IDS } from '../../Utilities/Constants';
const menuImage = require('../../Images/menu.png')



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
        height: 60,  
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionText: {
        alignSelf: 'center',
        color:'white',
        fontSize:20,
    }
  });

  saveBackendCheck = async (check = 'false') => {
    try {
      await AsyncStorage.setItem('backendChecked', check)
    } catch (e) {
      // saving error
      console.log(e)
    }
  }

  const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
    main: {paddingRight: -3},
  }



class MainGamePage extends Component {

    constructor() {
        super()
        this.state = {

            currentQuestion: null,
            viewState: "vote",
            questions: [],
            index: 0,
            isLoading: true,
            preLoadingView: true,
            backendChecked: false,
            serverData:[],
            adId: '',
            adCounter: 0,
        }
    
        this._onPressFirstQuestionButton = this._onPressFirstQuestionButton.bind(this)
        this._onPressSecondQuestionButton = this._onPressSecondQuestionButton.bind(this)
        this.getCurrentFirstQuestionPrecentage = this.getCurrentFirstQuestionPrecentage.bind(this)
        this.getCurrentSecondQuestionPrecentage = this.getCurrentSecondQuestionPrecentage.bind(this)
        this.adCounterCheckup = this.adCounterCheckup.bind(this)
        this.getQuestions = this.getQuestions.bind(this)
        this.databaseIsReady = this.databaseIsReady.bind(this)

        Tapsell.setRewardListener((zoneId , adId , completed , rewarded) => {
            // onAdShowFinished
            console.log(adId);
            
            console.log("onAdShowFinished");
        });

        Tapsell.requestAd(ZONE_IDS.INTERSTITIAL_VIDEO,true,(zoneId,adId) => {
            this.setState({adId:adId})
            console.log('ffff')            
        },() => {console.log('no ad');
        } , () => {console.log('no network');
        } , (zoneId,err)=>{console.log('error:');
        console.log(err)
        } , () => {console.log('====================================');
        console.log('expired');
        console.log('====================================');})

        //load data from db and show
        getData = async () => {
            try {
              const value = await AsyncStorage.getItem('backendChecked')
              if(value !== null) {
                // value previously stored
                if (value == 'false') {
                    console.log('gfg2')
                    this.setState({backendChecked:false})
                }else if (value == 'true'){
                    console.log('gfg3')
                    this.setState({backendChecked:true})
                    console.log(thi.state.backendChecked)
                }
                
        
              }else {
                    saveBackendCheck()
              }
            } catch(e) {
              // error reading value
              console.log(e)
            }
          }         
        getData()
        
        axios.get(`http://localhost:3001/api/getAllQuestion`)
                    .then(response => {
                        this.setState({serverData:response.data})
                        console.log(response.data)
                        saveBackendCheck('true')
                        this.setState({backendChecked:true})
                        return response.data
                    }).catch((err) => {

                    })


        db.initDB().then( () => {
            //load data from back end and update
        })

    }

    componentDidMount () {
        // this.saveQuestion()
        // db.importTest()

        setTimeout(() => {
            this.getQuestions()
            setTimeout(() => {
                this.updateDatabaseData()
            },2000)
        }, 600);
        
         
    }

    

    databaseIsReady()
     {

     }   
     
     updateDatabaseData () {
            this.setState({isLoading:false})
            console.log('mfgo')
            console.log(this.state.questions)
            
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

                    console.log(`biacth ${id} + ${checkID}`)
                    if (checkID == id){
                        //update
                        var voted = databaseQ[j].voted
                        this.updateQuestionNumbers(id,firstNumber,secondNumber,voted)
                        addNewData = false

                    }
                }
                if (addNewData){
                    console.log(`this id should be one ${id}`)
                    this.saveQuestion(id,firstQuestion,secondQuestion,firstNumber,secondNumber)
                    var newData = {questionId:updateQ[i]._id,firstQuestionVoteNumber:updateQ[i].firstQuestionVoteNumber,secondQuestionVoteNumber:updateQ[i].secondQuestionVoteNumber,firstQuestion:updateQ[i].firstQuestion,secondQuestion:updateQ[i].secondQuestion,voted:0}
                    databaseQ.push(newData)
                    console.log(databaseQ)
                }
            }

            this.setState({questions:databaseQ,preLoadingView:false})
        
     }

     updateQuestionNumbers (id,firstNumber,secondNumber) {
         console.log(id,firstNumber,secondNumber)
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
        console.log('result')
        console.log(result);

    }).catch((err) => {
        console.log('error')
        console.log(err);
    })
    }

getQuestions() {
    let questions = [];
    db.listUnvotedQuestions(questionDataJSON).then((data) => {
        questions = data;
        this.setState({currentQuestion:questions[0],questions:questions})
        
    }).catch((err) => {
        console.log(err);
    })
    }

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

    _onPressFirstQuestionButton() {       
        switch (this.state.viewState) {
            case "vote":          
                if (this.state.currentQuestion == null){
                    this.setState({viewState:'finished'})
                    break
                }
                var question = this.state.currentQuestion
                question.firstQuestionVoteNumber += 1
                this.setState({viewState:"voted",currentQuestion:question})
                this.updateQuestionVoteNumber()  
                console.log('GTFO')
                console.log(this.state.currentQuestion)
                axios.post('http://localhost:3001/api/vote',{_id:this.state.currentQuestion.questionId,voteNumber:1}).then(
                    ).catch(err => {
                        console.log(err)
                    })              
                break;
            case "voted":
                this.adCounterCheckup()
                if (this.state.questions.length == 0){
                    this.setState({currentQuestion:null})
                    this.setState({viewState:'finished'})
                    break
                }else{
                    var index = this.state.index
                    var question = this.state.questions[index + 1]
                    this.setState({currentQuestion: question , index: index + 1})
                }
                this.setState({viewState:'vote'})
                break;
            case 'finished' :
                break
            default:

                break;
        }
    }

    adCounterCheckup () {
        if (this.state.adCounter == 5){
            this.setState({adCounter:0})
            //show add
            Tapsell.showAd({
                ad_id: this.state.adId,
                back_disabled:  false,
                immersive_mode: false,
                rotation_mode: Tapsell.ROTATION_UNLOCKED,
                show_exit_dialog: true
            })
        }else{
            var counter = this.state.adCounter + 1
            this.setState({adCounter:counter})
        }
    }

    _onPressSecondQuestionButton() {
        switch (this.state.viewState) {
            case "vote":   
                if (this.state.currentQuestion == null){
                    this.setState({viewState:'finished'})
                    return
                }
                
                var question = this.state.currentQuestion
                question.secondQuestionVoteNumber += 1                
                this.setState({viewState:"voted",currentQuestion:question})
                this.updateQuestionVoteNumber()
                axios.post('http://localhost:3001/api/vote',{_id:this.state.currentQuestion.questionId,voteNumber:2}).then(
                ).catch(err => {
                    console.log(err)
                })             
                break;
            case "voted":
                this.adCounterCheckup()
                if (this.state.questions.length == 0){
                    this.setState({currentQuestion:null})
                    this.setState({viewState:'finished'})
                    break
                }else{
                    var index = this.state.index
                    var question = this.state.questions[index + 1]
                    this.setState({currentQuestion: question , index: index + 1})
                }
                this.setState({viewState:'vote'})
                break;
            case 'finished' :
                break
            default:

                break;
        }
    }

    getCurrentFirstQuestion () {
        if (this.state.isLoading)
            return ''

        if (this.state.currentQuestion != null){
            return this.state.currentQuestion.firstQuestion
        }else {
            return 'سوال تمام شد :('
        }
    }

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

    getCurrentSecondQuestionPrecentage () {
        if (this.state.currentQuestion != null){
            if (this.state.viewState == 'voted'){
                var total = this.state.currentQuestion.firstQuestionVoteNumber + this.state.currentQuestion.secondQuestionVoteNumber
                var current = this.state.currentQuestion.secondQuestionVoteNumber
                var c = Math.floor( current / total * 100)
                console.log(this.state.backendChecked)
                console.log('indic')
                if (this.state.backendChecked){
                    
                    return `${c} %`
                }
                return ''
            }
            return ''
        }
        return ''
    }

    getCurrentSecondQuestion () {
        if (this.state.isLoading)
            return ''

        if (this.state.currentQuestion != null){
            return this.state.currentQuestion.secondQuestion
        }else {
            return 'سوال تمام شد؟ :('
        }
    }



    render () {


        if (this.state.preLoadingView){
            return (
                <View  style = { {backgroundColor:'#292929',height:'100%',width:'100%'}}></View>
            )
        }

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
                                <TouchableHighlight onPress={() => {this._drawer.open()}} style={{height:50,width:50,position:'absolute',top:0,right:0,alignContent:'center',justifyContent:'center'}}>
                                    <Image style={{width:25,height:25}} source={menuImage}></Image>
                                </TouchableHighlight>
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
                                <View><Text style={styles.questionText}>{this.getCurrentSecondQuestion()}</Text><Text style={styles.questionText}>{this.getCurrentSecondQuestionPrecentage()}</Text></View>
                            </TouchableHighlight>
                            <View style={styles.footerView}>
                                <BannerAd
                                    zoneId={ZONE_IDS.STANDARD_BANNER}
                                    bannerType={Tapsell.BANNER_320x50}
                                />
                            </View>
                            
                        </View>
                    </SafeAreaView>
                
                </View>

            </Drawer>
        )
    }
}

export default MainGamePage