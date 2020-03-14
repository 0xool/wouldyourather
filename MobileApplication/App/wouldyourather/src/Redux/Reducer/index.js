// Imports: Dependencies
import { combineReducers } from 'redux';

// Imports: Reducers

import mainPageReducer from './MainPageReducer';

// Redux: Root Reducer
const rootReducer = combineReducers({
  mainPageReducer: mainPageReducer,
});

// Exports
export default rootReducer;