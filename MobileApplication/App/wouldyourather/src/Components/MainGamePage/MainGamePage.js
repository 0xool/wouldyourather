import React, { Component } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    View,
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
        backgroundColor: 'red',
        flexGrow:1 ,        
        justifyContent: 'center',
        alignItems: 'center',
    },
    orView: {
        backgroundColor: 'grey',
        height:50,
        width: 50,
        borderRadius: 25,
        zIndex:5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondQuestionView: {
        backgroundColor: 'blue',
        flexGrow:1 ,
        justifyContent: 'center',
        alignItems: 'center',
    },
    midLineView: {
        backgroundColor: 'grey',
        height: 10,  
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:5,
    },
    headerView: {
        backgroundColor: 'grey',
        height: 50,  
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerView: {
        backgroundColor: 'grey',
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

class MainGamePage extends Component {

    constructor() {
        super()
        this.state = {
            currentQuestion: null,
            viewState: "vote",
            questions: [],
            index: 0,
            isLoading: true,
        }
    
        this._onPressFirstQuestionButton = this._onPressFirstQuestionButton.bind(this)
        this._onPressSecondQuestionButton = this._onPressSecondQuestionButton.bind(this)
        this.getCurrentFirstQuestionPrecentage = this.getCurrentFirstQuestionPrecentage.bind(this)
        this.getCurrentSecondQuestionPrecentage = this.getCurrentSecondQuestionPrecentage.bind(this)
        this.getQuestions = this.getQuestions.bind(this)
        this.databaseIsReady = this.databaseIsReady.bind(this)
        //load data from db and show 
        db.initDB()
        
    }

    componentDidMount () {
        // this.saveQuestion()
        // db.importTest()
        setTimeout(() => {
            this.getQuestions()    
            this.setState({isLoading:false})
        }, 600);
        
        
    }

    databaseIsReady()
     {

     }    
    
saveQuestion(questionId,firstQuestion,secondQuestion,firstQuestionVoteNumber,secondQuestionVoteNumber) {
    let data = {
        questionId: questionId,
        firstQuestion: firstQuestion,
        secondQuestion: secondQuestion,
        firstQuestionVoteNumber: firstQuestionVoteNumber,
        secondQuestionVoteNumber: secondQuestionVoteNumber
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
    db.listQuestions(questionDataJSON).then((data) => {
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
                axios.post('http://localhost:3001/api/vote',{_id:this.state.currentQuestion.questionId,voteNumber:1}).then(
                    ).catch(err => {
                        console.log(err)
                    })              
                break;
            case "voted":
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
                return `${c} %`
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
                return `${c} %`
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
        return (
            <View  style = { {backgroundColor:'grey'}}>
                <StatusBar style = { {backgroundColor:'grey'}} barStyle="dark-content" />
                <SafeAreaView>
                    <View style={styles.gameView}>
                        
                        <View style={styles.headerView}><Text style={{fontSize:25,color:'white'}}>کدوم ترجیح میدی؟</Text></View>
                        
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
                        <View style={styles.footerView}></View>
                        
                    </View>
                </SafeAreaView>
            </View>
        )
    }
}

export default MainGamePage