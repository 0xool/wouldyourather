// Imports: Dependencies
import { combineReducers } from 'redux';

// Imports: Reducers

import mainPageReducer from './MainPageReducer';
import profilePageReducer from './ProfilePageReducer';

// Redux: Root Reducer
const rootReducer = combineReducers({
  mainPageReducer: mainPageReducer,
  profilePageReducer: profilePageReducer,
});

// Exports
export default rootReducer;