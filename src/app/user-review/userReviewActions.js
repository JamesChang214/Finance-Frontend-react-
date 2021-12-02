import { createRoutine } from 'redux-saga-routines';

export const getUserData = createRoutine('user-review/GET_USER_DATA');
export const setUserData = createRoutine('user-review/SET_USER_INFO');
export const clearUserData = createRoutine('user-review/CLEAR_USER_DATA');
export const requestFriendship = createRoutine(
  'user-review/REQUEST_FRIENDSHIP'
);
export const amIFollowing = createRoutine('user-review/GET_FOLLOW_STATUS');