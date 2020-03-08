import {Navigation} from 'react-native-navigation';
import MGP from '../Components/MainGamePage/MainGamePage'

export function registerScreens() {
  Navigation.registerComponent('Home', () => MGP);
  
}