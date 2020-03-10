import { Navigation } from 'react-native-navigation'
  export const goHome = () => Navigation.setRoot({
    root: {
        component: {
            id:'Home',
            name: 'Home'
        }
      }
  })


  export const goAddQuestion = () => Navigation.setRoot({
    root: {
        component: {
            id:'AddQuestion',
            name: 'AddQuestion'
        }
      }
  })