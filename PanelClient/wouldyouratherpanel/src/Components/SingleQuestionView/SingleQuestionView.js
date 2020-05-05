import React, { Component,style } from 'react'
import Axios from 'axios'
import * as STATICS from '../../Const/Const';
import Header from '../Header/Header'
import { Link } from 'react-router-dom';

const downloadView = (voted) => {
    if (!voted) {
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

const firstQuestionComponent = (firstQuestion,clickHandler,voted,voteNumber) => {
        
    return (
        <div onClick={clickHandler} className='Single-question-view-first-question-view'>
            {firstQuestion}
            {voteNumberView(voted,voteNumber,true)}
        </div>
    )
}

const secondQuestionComponent = (secondQuestion,clickHandler,voted,voteNumber) => {


    
    return (
        <div onClick={clickHandler} className='Single-question-view-second-question-view'>
            {secondQuestion}
            {voteNumberView(voted,voteNumber,false)}
        </div>
    )
}


class SingleQuestionView extends Component {


    constructor () {
        super()

        this.state = {
            firstQuestion:'',
            secondQuestion:'',
            firstQuestionVoteNumber:0,
            secondQuestionVoteNumber:0,
            voted:false,
            errorView:false
        }

        this.firstQuestionVoted = this.firstQuestionVoted.bind(this)
        this.secondQuestionVoted = this.secondQuestionVoted.bind(this)
    }

    componentDidMount() {
        const id = this.props.match.params.id
        Axios.get(`${STATICS.SERVER_API_ADDRESS}getQuestionById`,{params: {id:id}}).then((res) => {
            const data = res.data
            this.setState({
                firstQuestion:data.firstQuestion,
                secondQuestion:data.secondQuestion,
                firstQuestionVoteNumber:data.firstQuestionVoteNumber,
                secondQuestionVoteNumber:data.secondQuestionVoteNumber,
                id:id,
            })
            console.log(res)
        }).catch((err) => {
            this.setState({
                errorView:true,
            })
            console.log(err)
        })
    }

    firstQuestionVoted () {
        this.vote('1')
    }

    secondQuestionVoted () {
        this.vote('2')
    }

    vote (voteNumber) {
        Axios.post(`${STATICS.SERVER_API_ADDRESS}vote`,{_id:this.state.id,voteNumber:voteNumber}).then(() => {
            this.setState({
                voted:true,
            })
        }).catch((err) => {
            
            console.log(err)
        })
    }

    render () {

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
        
        const finishedView = () => {
            if (!this.state.voted) {
                return(
                    <div></div>
                )
            }
            return (
                <div className='Single-question-view-end'>
                    رای شما وارد شد  
                </div>
            )
        }

        return (
            <div style={{height:'100%',width:'100%'}}>
                  <Header/>
                  <div className='Single-question-view-container'>
                        {firstQuestionComponent(this.state.firstQuestion,this.firstQuestionVoted,this.state.voted,this.state.firstQuestionVoteNumber)}
                        {finishedView()}
                        {downloadView(this.state.voted)}
                        {secondQuestionComponent(this.state.secondQuestion,this.secondQuestionVoted,this.state.voted,this.state.secondQuestionVoteNumber)}
                  </div>
            </div>
        )
    }
}

export default SingleQuestionView