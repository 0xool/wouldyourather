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
        loginBackground: {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#292929',
            width: '100%',
            height: '100%',
        },
        loginMenu: {
            backgroundColor: '#d42222',
            flexGrow:1 ,        
            justifyContent: 'center',
            alignItems: 'center',
            width:'60%',
            height:'30%'
        },
        usernameView: {
            backgroundColor: '#292929',
            height:50,
            width: 50,
            borderRadius: 25,
            zIndex:5,
            justifyContent: 'center',
            alignItems: 'center',
        },
        passwordView: {
            backgroundColor: '#2467e2',
            flexGrow:1 ,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonView: {
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

class LoginView extends Component {
    render () {
        return (
            <View style={styles.loginBackground}>
                <View style={styles.loginMenu}>
                    <View style={styles.usernameView}>

                    </View>
                    <View style={styles.passwordView}>

                    </View>
                    <View style={styles.buttonView}>

                    </View>
                </View>
            </View>
        )
    }
}

export default LoginView