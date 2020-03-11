import AsyncStorage from "@react-native-community/async-storage"

export const getAdStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('adStatus')
      if(value !== null) {
        // value previously stored
        if (value == 'false') {
            return false
        }else if (value == 'true'){
            return true
        }
      }else {
        saveAdStatus()
      }
    } catch(e) {
      // error reading value
      console.log(e)
    }

    return false
  } 

export const saveAdStatus = async (check = 'false') => {
    try {
      await AsyncStorage.setItem('adStatus', check)
    } catch (e) {
      // saving error
      console.log(e)
    }
  }

export const getOfflineVote = async () => {
try {
    const value = await AsyncStorage.getItem('offlineVote')
    console.log(`look here ${value}`)
    return value
    if(value !== null) {
    }
} catch(e) {
    // error reading value
    console.log(e)
}

} 

export const saveOfflineVote = async (newVote) => {
    try {
        var newData = []
        const value = await AsyncStorage.getItem('offlineVote')
        console.log(value)

        if (value != null){

            var oldData = JSON.parse(value)
            newData = oldData
        }
        
        newData.push( newVote )
        await AsyncStorage.setItem('offlineVote', JSON.stringify(newData))
    

    } catch (e) {
      // saving error
      console.log(e)
    }
  }