// Initial State
const initialState = {
    isMainPageGameView: true,
  };
  
// Reducers (Modifies The State And Returns A New State)
const mainPageReducer = (state = initialState, action) => {
  switch (action.type) {
    // Increase Counter
    case 'show-add-question': {
      return {
        // State
        ...state,
        // Redux Store
        isMainPageGameView: false,
      }
    }

    // Decrease Counter
    case 'hide-add-question': {
        console.log('FUUCK')
      return {
        // State
        ...state,
        // Redux Store
        isMainPageGameView: true,
      }
    }

    // Default
    default: {
      return state;
    }
  }
};

// Exports
export default mainPageReducer;