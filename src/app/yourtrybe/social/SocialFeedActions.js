import { createRoutine } from 'redux-saga-routines';

export const getSocialFeed = createRoutine('socialFeed/GET_SOCIAL_FEED');
export const createSocialPost = createRoutine('socialFeed/CREATE_SOCIAL_POST');
export const cleanSocialFeed = createRoutine('socialFeed/CLEAN');
export const like = createRoutine('socialFeed/LIKE');
export const createSocialComment = createRoutine('socialFeed/CREATE_SOCIAL_COMMENT');
export const deleteReaction = createRoutine('socialFeed/DELETE_REACTION');
export const expandPost = createRoutine('socialFeed/EXPAND_POST');
export const rollPostBack = createRoutine('socialFeed/ROLL_POST_BACK');
export const getMentionSuggestions = createRoutine('socialFeed/GET_MENTION_SUGGESTIONS');
export const getUserHelperData = createRoutine('socialFeed/GET_USER_HELPER');