import { createRoutine } from 'redux-saga-routines';

export const getFriends = createRoutine('friends/GET_FRIENDS');
export const getRequests = createRoutine('friends/GET_REQUESTS');
export const requestFriendship = createRoutine('friends/REQUEST_FRIENDSHIP');
export const rejectFriendshipRequest = createRoutine(
  'friends/REJECT_FRIENDSHIP_REQUEST'
);
export const cancelFriendshipRequest = createRoutine(
  'friends/CANCEL_FRIENDSHIP_REQUEST'
);
export const acceptFriendshipRequest = createRoutine(
  'friends/ACCEPT_FRIENDSHIP_REQUEST'
);
export const removeFriend = createRoutine('friends/REMOVE_FRIEND');

export const checkFriendshipStatus = createRoutine('friends/CHECK_FRIENDSHIP_STATUS');
