// Initial State
// isMainPageGameView : gameView for main game view - addQuestion for addquestion view - profileView for profile view
const initialState = {
    isMainPageGameView: 'gameView',
    removeAdRegistered: false,
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
        isMainPageGameView: 'addQuestion',
      }
    }

    // Decrease Counter
    case 'hide-add-question': {
      return {
        // State
        ...state,
        // Redux Store
        isMainPageGameView: 'gameView',
      }
    }

    case 'set-ad-registered': {
    return {
      // State
      ...state,
      // Redux Store
      removeAdRegistered: true,
    }
  }
   
  case 'hide-profile-view': {
    return {
      // State
      ...state,
      // Redux Store
      isMainPageGameView: 'gameView',
    }
  }

  case 'show-profile-view': {
    return {
      // State
      ...state,
      // Redux Store
      isMainPageGameView: 'profileView',
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