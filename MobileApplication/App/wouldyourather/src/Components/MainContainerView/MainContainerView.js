import React, { Component } from 'react'
import MGP from '../MainGamePage/MainGamePage'
import {
    View,
    StyleSheet,
    Alert,
    } from 'react-native';
import Tapsell, { BannerAd } from "react-native-tapsell";
import { ZONE_IDS } from '../../Utilities/Constants';
import { connect } from 'react-redux';


const bannerComponent = (showAd) => {
    if(!showAd){
        return(<View></View>)
    }else{            
        return(    
            
            <BannerAd
            zoneId={ZONE_IDS.STANDARD_BANNER}
            bannerType={Tapsell.BANNER_320x50}
            />
        )
    }
}

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
                        {bannerComponent(!this.props.removeAdRegistered)}
                </View>
            </View>
        )
    }
}

//=============================================================================================================
// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {
    // Redux Store --> Component
    return {
        removeAdRegistered: state.mainPageReducer.removeAdRegistered,
        };
    };
    // Exports
    export default connect(mapStateToProps, null)(MainContainerView);
    