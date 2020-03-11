

import {AppRegistry} from 'react-native';
import MGV from './src/Components/MainGamePage/MainGamePage'
import APP from './App'
import {name as appName} from './app.json';
import {Navigation} from 'react-native-navigation';
import {registerScreens} from './src/Screens/screens';
import Tapsell, { AdVideo, BannerAd } from "react-native-tapsell";
import './src/Utilities/Constants'
import { TAPSELL_KEY } from './src/Utilities/Constants';
import {runFlurry} from './src/Manager/FlurryManager'

runFlurry()
Tapsell.initialize(TAPSELL_KEY);
registerScreens();
global.firstLoad = true
Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'Home'
      }
    },
  });
});

// AppRegistry.registerComponent(appName, () => MGV);
