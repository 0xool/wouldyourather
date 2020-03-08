

import {AppRegistry} from 'react-native';
import MGV from './src/Components/MainGamePage/MainGamePage'
import APP from './App'
import {name as appName} from './app.json';
// import {Navigation} from 'react-native-navigation';
// import {registerScreens} from './src/Screens/screens';

// registerScreens();

// Navigation.events().registerAppLaunchedListener(() => {
//   Navigation.setRoot({
//     root: {
//       component: {
//         name: 'Home'
//       }
//     },
//   });
// });

AppRegistry.registerComponent(appName, () => MGV);
