import { createRoutine } from 'redux-saga-routines';

// creating routine
export const getPostInfo = createRoutine('post/GET_POST_INFO');
export const getAuthorPost = createRoutine('post/GET_AUTHOR_POST');
export const setPostInfo = createRoutine('post/SET_POST_INFO');
export const clearPostInfo = createRoutine('post/CLEAR_POST_INFO');
export const getPostComments = createRoutine('post/GET_POST_COMMENTS');
export const sendPostComment = createRoutine('post/SEND_POST_COMMENT');
export const sendPostRating = createRoutine('post/SEND_POST_RATING');
export const ratePost = createRoutine('post/RATE_POST');
export const getPostRating = createRoutine('post/GET_POST_RATING');
export const replyToPostComment = createRoutine('post/SEND_COMMENT_REPLY');
export const getPrerenderRoutine = createRoutine('post/GET_PRERENDER');
export const sendPrerenderRoutine = createRoutine('post/SEND_PRERENDER');
