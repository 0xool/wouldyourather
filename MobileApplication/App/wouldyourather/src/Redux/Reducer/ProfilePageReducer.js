// Initial State
// View status's are [profile , login , singup]
const initialState = {
    viewStatus: 'login',
    username:'',
    email:'',
    id:'',
  };
  
// Reducers (Modifies The State And Returns A New State)
const profilePageReducer = (state = initialState, action) => {
  switch (action.type) {
    // Increase Counter
    case 'change-to-login': {
      return {
        // State
        ...state,
        // Redux Store
        viewStatus: 'login',
      }
    }

    // Decrease Counter
    case 'change-to-singup': {
      return {
        // State
        ...state,
        // Redux Store
        viewStatus: 'signup',
      }
    }

    case 'change-to-profile': {
    return {
      // State
      ...state,
      // Redux Store
      viewStatus: 'profile',
    }
  }

  case 'setup-user-info': {
    return {
      // State
      ...state,
      // Redux Store
      username: action.username,
      id: action.id,
      email: action.email,
    }
  }

    // Default
    default: {
      return state;
    }
  }
};

// Exports
export default profilePageReducer;