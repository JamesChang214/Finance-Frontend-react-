import { createRoutine } from 'redux-saga-routines';

export const postLogin = createRoutine('USER/LOGIN');

export const getUserData = createRoutine('USER/GET_USER_DATA');
export const forceUserLogin = createRoutine('USER/FORCE_LOGIN');
export const setScroll = createRoutine('SETSCROLL');
export const userSignOut = createRoutine('USER/SIGN_OUT');
export const forgotPasswordClick = createRoutine('USER/FORGOT_PASSWORD_CLICK');
export const returnToLoginMode = createRoutine('USER/RETURN_TO_LOGIN_MODE');
export const forgotPasswordRequest = createRoutine('USER/FORGOT_PASSWORD_REQUEST');
export const sendNewPassword = createRoutine('SEND_NEW_PASSWORD');