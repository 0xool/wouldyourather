import MCV from './src/Components/MainContainerView/MainContainerView'
// Imports: Dependencies
import React from 'react';
import { PersistGate } from 'redux-persist/es/integration/react'
import { Provider } from 'react-redux';

import LoginView from './src/Components/ProfileView/LoginView'

// Imports: Screens


// Imports: Redux Persist Persister
import { store, persistor } from './src/Redux/Store/store';

// React Native: App
export default App = () => {
  return (
    // Redux: Global Store
    <Provider store={store}>
      <PersistGate 
        loading={null}
        persistor={persistor}
      >
        <LoginView />
      </PersistGate>
    </Provider>
  );
};