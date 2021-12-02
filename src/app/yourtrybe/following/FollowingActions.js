import { createRoutine } from 'redux-saga-routines';

export const getFollowing = createRoutine('following/GET_FOLLOWING');
export const getFollowers = createRoutine('following/GET_FOLLOWERS');
export const follow = createRoutine('following/FOLLOW');
export const unfollow = createRoutine('following/UNFOLLOW');
