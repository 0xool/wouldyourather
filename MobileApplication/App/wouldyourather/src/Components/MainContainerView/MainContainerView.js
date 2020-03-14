import React, { Component } from 'react'
import MGP from '../MainGamePage/MainGamePage'
import {
    View,
    StyleSheet,
    } from 'react-native';
import Tapsell, { BannerAd } from "react-native-tapsell";
import { ZONE_IDS } from '../../Utilities/Constants';



class MainContainerView extends Component {
    
    render () {

        const containerStyles = StyleSheet.create({
            containerView : {
                
            },
            footerView: {
                backgroundColor: '#292929',
                height: 70,  
                justifyContent: 'center',
                alignItems: 'center',
            }
        })

        return (
            <View style = {{height:'100%',width:'100%'}}>
                <MGP/>
                <View style={containerStyles.footerView}>
                    <BannerAd
                        zoneId={ZONE_IDS.STANDARD_BANNER}
                        bannerType={Tapsell.BANNER_320x50}
                    />
                </View>
            </View>
        )
    }
}

export default MainContainerView