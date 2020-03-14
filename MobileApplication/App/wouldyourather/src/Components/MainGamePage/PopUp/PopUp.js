import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Animated,
    Image,
    Easing
} from 'react-native'

import React , {Component} from 'react'


export default class PopUp extends Component {

    constructor(){
        super()
        this.topPosition = new Animated.Value(0)

        
    }


    componentDidMount() {
        this.animateIn()
    }
    animateIn () {

        Animated.sequence([Animated.timing(
            this.topPosition,
            {
                    toValue: 1,
                    duration: 2000,
                    delay:4000,
                    easing: Easing.linear,
            }) ,        
             Animated.timing(
                this.topPosition,
            {
                toValue: 0,
                duration: 2000,
                delay:3000,
                easing: Easing.linear,
            })
    ]).start(() => {})
        

    }


    render() {
        const top = this.topPosition.interpolate({
            inputRange: [0, 1],
            outputRange: [-100, 10]
          })
        return (
            <Animated.View style={{backgroundColor:'#0D2149',borderRadius:15,height:60,width:'70%',borderColor:'white',position:'absolute',top,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:13,color:'white'}}>با وصل شدن به اینترنت میتونی درصد جوابا رو ببینی</Text>
            </Animated.View>
        )
    }
}
