import { createRoutine} from 'redux-saga-routines';

export const getAllCategories = createRoutine('articles/GET_ALL_CATEGORIES');
export const changeCategory = createRoutine('articles/CHANGE_CATEGORY');
export const addFavoriteCategory = createRoutine(
  'articles/ADD_FAVORITE_CATEGORY'
);
export const deleteFavoriteCategory = createRoutine(
  'articles/DELETE_FAVORITE_CATEGORY'
);
export const getAllPromos = createRoutine('articles/GET_ALL_PROMOS');