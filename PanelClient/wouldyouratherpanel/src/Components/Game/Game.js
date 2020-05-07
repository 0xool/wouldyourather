import React, { Component,style } from 'react'
import Axios from 'axios'
import * as STATICS from '../../Const/Const';
import Header from '../Header/Header'
import { Link } from 'react-router-dom';

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const downloadView = (finished) => {
    if (!finished) {
        return(
            <div></div>
        )
    }
    return (
        <div className='Single-question-view-download'>
            <a style={{color:'white'}} target="_blank" href={STATICS.ANDROID_CAFE_BAZAAR_LINK}>دانلود اپلیکیشن کدومش</a>
        </div>
    )
}

const textView = (finished) => {
    if (!finished) {
        return(
            <div></div>
        )
    }
    return (
        <div className='Single-question-view-text'>
            <b style={{color:'white'}}>اگه حال کردی با کدومش اپلیکیشن دانلود کن و همه سوالا رو ببین</b>
        </div>
    )
}

const voteNumberView = (voted,voteNumber,first) => {
        
    var style={}
    if (first) {
        style={position:'absolute',left:26,top:16}
    }else{
        style=style={position:'absolute',right:26,top:16}
    }

    if (voted) {
        return(
        <div style={style}>{`${voteNumber}%`}</div>
        )
    }

    return(
        <div></div>
    )
}

const firstQuestionComponent = (firstQuestion,clickHandler,voted,voteNumber,thisVote) => {
    const c = (thisVote) ? 'Single-question-view-first-question-view box-hover-animation' : 'Single-question-view-first-question-view'
    return (
        <div onClick={clickHandler} className={c}>
            {firstQuestion}
            {voteNumberView(voted,voteNumber,true)}
        </div>
    )
}

const secondQuestionComponent = (secondQuestion,clickHandler,voted,voteNumber,thisVote) => {
    const c = (thisVote) ? 'Single-question-view-second-question-view box-hover-animation' : 'Single-question-view-second-question-view'
    
    return (
        <div onClick={clickHandler} className={c}>
            {secondQuestion}
            {voteNumberView(voted,voteNumber,false)}
        </div>
    )
}


class Game extends Component {


    constructor () {
        super()

        this.state = {
            questions:[],
            voted:false,
            errorView:false,
            index: 0,
            firstVoted: false,
            secondVoted: false,
        }

        this.firstQuestionVoted = this.firstQuestionVoted.bind(this)
        this.secondQuestionVoted = this.secondQuestionVoted.bind(this)
        this.goNextQuestionAfterVote = this.goNextQuestionAfterVote.bind(this)
        
    }

    componentDidMount() {
        const id = this.props.match.params.id
        
        
        Axios.get(`${STATICS.SERVER_API_ADDRESS}getAllQuestion`).then((res) => {
            const data = res.data
            shuffle(data)
            this.setState({
                questions:data
            })
            console.log(this.state.questions[this.state.index])
        }).catch((err) => {
            this.setState({
                errorView:true,
            })
            console.log(err)
        })
    }

    goNextQuestionAfterVote () {
        const nextIndex = this.state.index + 1

        this.setState({
            index:nextIndex,
            voted:false,
            firstVoted: false,
            secondVoted: false,
        })
    }

    firstQuestionVoted () {
        if (this.state.voted) {
            this.goNextQuestionAfterVote()
        }else{
            this.vote('1')
        }
    }

    secondQuestionVoted () {
        
        if (this.state.voted) {
            this.goNextQuestionAfterVote()
        }else{
            this.vote('2')
        }
    }

    vote (voteNumber) {
        const id = this.state.questions[this.state.index]._id
        Axios.post(`${STATICS.SERVER_API_ADDRESS}vote`,{_id:id,voteNumber:voteNumber}).then(() => {
            const first = (voteNumber == 1) ? true : false
            const second = (voteNumber == 2) ? true : false    
            this.setState({
                voted:true,
                firstVoted:first,
                secondVoted:second,
            })
        }).catch((err) => {
            
            console.log(err)
        })
    }

    render () {

        const gameView = () => {
            const disableAction = (this.state.index == 10) ? true : false
            const question = this.state.questions[this.state.index]
            const firstHandler = (disableAction) ? null : this.firstQuestionVoted
            const secondHandler = (disableAction) ? null : this.secondQuestionVoted
            if (question){
                const total = question.firstQuestionVoteNumber + question.secondQuestionVoteNumber
                var currentFirst = question.firstQuestionVoteNumber
                var currentSecond = question.secondQuestionVoteNumber
                var c1 = Math.ceil( currentFirst / total * 100)
                var c2 = Math.floor( currentSecond / total * 100)
                return(                    
                    <div className='Single-question-view-container'>
                        {firstQuestionComponent(question.firstQuestion,firstHandler,this.state.voted,c1,this.state.firstVoted)}                        
                        {secondQuestionComponent(question.secondQuestion,secondHandler,this.state.voted,c2,this.state.secondVoted)}
                        {downloadView(disableAction)}
                        {textView(disableAction)}
                    </div>
                )
            }

            return(
                <div className='Single-question-view-container'></div>
            )
        }


        if(this.state.errorView) {
            return(
                <div style={{height:'100%',width:'100%'}}>
                    <Header/>
                    <div className='Single-question-view-container'>
                        <div className='Single-question-view-end'>
                            خطا در ارتباط با سرور
                        </div>
                    </div>  
                </div>
            )
        }        
            
        return (
            <div style={{height:'100%',width:'100%'}}>
                <Header/>
                {gameView()}
            </div>
        )
    }
}

export default Game