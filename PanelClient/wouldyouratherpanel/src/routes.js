import React from "react"
import {Switch,Route} from 'react-router-dom'
import Main from './Components/MainView/Main'
import VQ from "./Components/ValidateQuestionView/ValidateQuestion";
import AQ from './Components/AddQuestionView/AddQuestion'
import QL from './Components/QuestionListView/QuestionListView'
import UL from './Components/UserListView/UserListView'


const Routes = () => {
    return(
            <Switch>                
                <Route path="/userList" exact component={UL}/>
                <Route path="/questionList" exact component={QL}/>
                <Route path="/validateQuestion" exact component={VQ}/>
                <Route path="/addQuestion" component={AQ}/>
                <Route path="/" component={Main}/> 
            </Switch>
    )
}

export default Routes