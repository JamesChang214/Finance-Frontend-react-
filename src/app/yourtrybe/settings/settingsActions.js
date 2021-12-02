import { createRoutine } from 'redux-saga-routines';

export const updateUser = createRoutine('settings/UPDATE_USER');
export const updateAvatar = createRoutine('settings/UPDATE_AVATAR');
export const getRefId = createRoutine('settings/GET_REF_ID');
//export const follow = createRoutine('following/FOLLOW');
//export const unfollow = createRoutine('following/UNFOLLOW');
export const setEosAccount = createRoutine('settings/SET_EOS_ACCOUNT');
export const cleanSetEosAccountMessage = createRoutine('settings/CLEAN_MESSAGES');