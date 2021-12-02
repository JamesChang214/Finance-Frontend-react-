import { createRoutine } from 'redux-saga-routines';

export const createArticleRoutine = createRoutine('EDITOR/CREATE_ARTICLE');
export const uploadFeaturedImageRoutine = createRoutine(
  'EDITOR/UPLOAD_FEATURED_IMAGE'
);
export const articleIsCreatedRoutine = createRoutine(
  'EDITOR/ARTICLE_IS_CREATED'
);
export const updateArticleRoutine = createRoutine('EDITOR/UPDATE_ARTICLE');
export const deleteArticleRoutine = createRoutine('EDITOR/DELETE_ARTICLE');
export const getMentionSuggestions = createRoutine(
  'EDITOR/GET_MENTION_SUGGESTIONS'
);
