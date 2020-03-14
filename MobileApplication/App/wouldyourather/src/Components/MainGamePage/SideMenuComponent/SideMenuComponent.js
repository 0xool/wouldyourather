import React, { Component } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    StatusBar,
    TouchableHighlight,
    TouchableOpacity,
    } from 'react-native';

    const menuBtnStyle = {
        backgroundColor: 'white',
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    }
    import { connect } from 'react-redux';
    import {hideAddQuestion,showAddQuestion} from '../../../Redux/Actions/MainPageAction'

class SideMenuComponent extends Component {

    constructor(props){
        super(props)
        this.addQuestionMenuBtnClicked = this.addQuestionMenuBtnClicked.bind(this)
    }

    addQuestionMenuBtnClicked ()
    {
           this.props.showAddQuestionRedux()          
    }

    removeAdBtnClicked () {

    }

    rateUsBtnClicked () {

    }

    aboutUsBtnClicked () {

    }


    render () {
        return (
            <View style={{backgroundColor:'white',height:'100%',width:'100%',paddingTop:60}}>
                <TouchableOpacity onPress={this.addQuestionMenuBtnClicked}> 
                    <View style={menuBtnStyle}><Text>اضافه کردن سوال</Text></View>
                </TouchableOpacity>
                    <View style={{height:1,width:'100%',backgroundColor:'black',paddingLeft:100,marginRight:100}}></View>
                <TouchableOpacity onPress={this.removeAdBtnClicked}> 
                    <View style={menuBtnStyle}><Text>حذف تبلیغات</Text></View>
                </TouchableOpacity>
                <View style={{height:1,width:'100%',backgroundColor:'black'}}></View>
                <TouchableOpacity onPress={this.rateUsBtnClicked}> 
                    <View style={menuBtnStyle}><Text>رتبه دادن به ما</Text></View>
                </TouchableOpacity>
                <View style={{height:1,width:'100%',backgroundColor:'black'}}></View>
                <TouchableOpacity onPress={this.aboutUsBtnClicked}> 
                    <View style={menuBtnStyle}><Text>درباره ما</Text></View>
                </TouchableOpacity>

            </View>
        )
    }
}

  // Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
  const mapDispatchToProps = (dispatch) => {
    // Action
      return {
        showAddQuestionRedux: () => dispatch(showAddQuestion()),
        
     };
  };
  
  // Exports
  export default connect(null,mapDispatchToProps)(SideMenuComponent);
