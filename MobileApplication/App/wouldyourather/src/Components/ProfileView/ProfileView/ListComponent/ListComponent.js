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
    Animated,
    FlatList
    } from 'react-native';

    function Item({firstQuestion,secondQuestion,firstPrecentage,secondPrecentage})  {
        return(
            <View style={{backgroundColor:'#d42222' , width:'100%' , flexDirection:'row', height:120, alignContent:'center',justifyContent:'center',marginTop:10}}>                
                <View style={{position:'absolute',backgroundColor:'#2467e2',width:'50%',height:'100%',alignContent:'center',justifyContent:'center',left:0,top:0}}>
                    <Text style={{fontSize:12,color:'white',alignSelf:'center'}}>{firstQuestion}</Text>
                </View>
                <View style={{position:'absolute',backgroundColor:'#d42222',width:'50%',height:'100%',alignContent:'center',justifyContent:'center',right:0,top:0}}>
                    <Text style={{fontSize:12,color:'white',alignSelf:'center'}}>{secondQuestion}</Text>
                </View>
                <Text style={{position:'absolute',top:8,left:8,color:'white',fontSize:15}}>{firstPrecentage}</Text>
                
                <Text style={{position:'absolute',top:8,right:8,color:'white',fontSize:15}}>{secondPrecentage}</Text>                
            </View>
        )
    }

class ListView extends Component {
    
    constructor () {
        super()

        
    }
    
    render () {
        
        const list = []
        for (const d of this.props.data) {
            var total = d.firstQuestionVoteNumber + d.secondQuestionVoteNumber
            var currentFirst = d.firstQuestionVoteNumber
            var currentSecond = d.secondQuestionVoteNumber
            var c1 = (total == 0) ? 0 : Math.floor( currentFirst / total * 100)
            var c2 = (total == 0)? 0 : Math.floor( currentSecond / total * 100)            
            const newData = {key:d._id,firstQuestion:d.firstQuestion,secondQuestion:d.secondQuestion,firstQuestionPrecentage:c1,secondQuestionPrecentage:c2}
            list.push(newData)
        }
        console.log(list)
        return (
            <View style={{width:'100%',height:'100%'}}>
                <Text style={{paddingTop:4,fontSize:15,color:'white',alignSelf:'center'}}>{this.props.text}</Text>
                <FlatList
                    data={list}
                    renderItem={({ item }) => <Item firstQuestion={item.firstQuestion} secondQuestion={item.secondQuestion} firstPrecentage={`${item.firstQuestionPrecentage}%`} secondPrecentage={`${item.secondQuestionPrecentage}%`} />}
                />
            </View>
        )
    }
}

export default ListView