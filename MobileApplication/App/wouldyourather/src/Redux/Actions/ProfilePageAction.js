export const changeViewToLogin = () => ({
    type: 'change-to-login',
});

export const changeViewToSignup = () => ({
    type: 'change-to-singup',
});


export const changeViewToProfile = () => ({
    type: 'change-to-profile',
});

export const setupUserInfoState = (username,email,id) => ({
    type: 'setup-user-info',
    username: username,
    email:email,
    id:id,
})
