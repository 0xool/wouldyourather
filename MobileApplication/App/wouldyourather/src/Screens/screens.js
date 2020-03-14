import {Navigation} from 'react-native-navigation';
import MGP from '../Components/MainGamePage/MainGamePage'
import AddQuestion from '../Components/AddQuesetion/AddQuestion'
import App from '../../App';

export function registerScreens() {
  Navigation.registerComponent('Home', () => App);
  Navigation.registerComponent('AddQuestion', () => AddQuestion);
  
}