import { put, all, takeLatest } from 'redux-saga/effects';
import * as actions from './articlesActions';
import * as api from './articlesApi';

export const articlesWatchers = [
  getAllCategoriesWatcher,
  addFavoriteCategoryWatcher,
  deleteFavoriteCategoryWatcher,
  getAllPromosWatcher
];

export function* getAllCategoriesWatcher() {
  yield takeLatest(actions.getAllCategories.TRIGGER, getAllCategories);
}

export function* getAllPromosWatcher() {
  yield takeLatest(actions.getAllPromos.TRIGGER, getAllPromos);
}

export function* addFavoriteCategoryWatcher() {
  yield takeLatest(actions.addFavoriteCategory.TRIGGER, addFavoriteCategory);
}
export function* deleteFavoriteCategoryWatcher() {
  yield takeLatest(
    actions.deleteFavoriteCategory.TRIGGER,
    deleteFavoriteCategory
  );
}

export function* addFavoriteCategory({ payload }) {
  const serverResponse = yield api.addFavoriteCategory(payload);

  if (serverResponse.status == 200) {
    yield put(actions.addFavoriteCategory.success(serverResponse.data));
  } else {
    yield put(actions.addFavoriteCategory.failure());
  }
}

export function* deleteFavoriteCategory({ payload }) {
  const serverResponse = yield api.deleteFavoriteCategory(payload);

  if (serverResponse.status == 200) {
    yield put(actions.deleteFavoriteCategory.success(serverResponse.data));
  } else {
    yield put(actions.deleteFavoriteCategory.failure());
  }
}

export function* getAllCategories() {
  //localStorage.setItem('trybe_categories', JSON.stringify(payload));
  const cache = localStorage.getItem('trybe_categories');
  if (cache) {
    yield put(actions.getAllCategories.success(JSON.parse(cache)));
  } else {
    const serverResponse = yield all([
      yield api.getAllCategories(1),
      yield api.getAllCategories(2)
    ]);

    let responseData = [];
    serverResponse.forEach(({ data }) => {
      responseData = [...responseData, ...data];
    });

    if (responseData) {
      yield put(actions.getAllCategories.success(responseData));
    } else {
      yield put(actions.getAllCategories.failure(serverResponse[0]));
    }
  }
}

export function* getAllPromos() {
  const serverResponse = yield api.getAllPromosData();
  if (serverResponse.data) {
    yield put(actions.getAllPromos.success(serverResponse.data));
  } else {
    yield put(actions.getAllPromos.failure(serverResponse));
  }
}
