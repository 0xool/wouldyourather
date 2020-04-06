import React from 'react'
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
    Button,
    } from 'react-native';

    const styles = StyleSheet.create({
        singupView: {
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
            color:'white',
            fontSize:20,
        }
    });

class SignupView extends Component {
    render () {
        return (
            <View class={styles.singupView}>
                
            </View>
        )
    }
}

export default SignupView