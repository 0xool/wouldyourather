import {Navigation} from 'react-native-navigation';
import MGP from '../Components/MainGamePage/MainGamePage'
import AddQuestion from '../Components/AddQuesetion/AddQuestion'

export function registerScreens() {
  Navigation.registerComponent('Home', () => MGP);
  Navigation.registerComponent('AddQuestion', () => AddQuestion);
  
}