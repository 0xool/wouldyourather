// const sessionStorage = require('async-storage')
// const sessionStorage = require('session-storage')

// return the user data from the session storage
export const getUser = () => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    else return null;
  }
   
  // return the token from the session storage
  export const getSession = () => {
    return sessionStorage.getItem('isLoggedIn') || false;
  }
   
  // remove the token and user from the session storage
  export const removeSession = () => {
    sessionStorage.removeItem('session');
    // sessionStorage.removeItem('user');
  }
   
  // set the token and user from the session storage
  export const setSession = (token) => {
    sessionStorage.setItem('session', token);
    sessionStorage.setItem('isLoggedIn', true);

    // sessionStorage.setItem('user', JSON.stringify(user));
  }