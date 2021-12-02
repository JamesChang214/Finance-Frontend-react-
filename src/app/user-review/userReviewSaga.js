import { put, all, takeLatest } from 'redux-saga/effects';
import * as actions from './userReviewActions';
import * as api from './userReviewApi';

export const userReviewWatchers = [getUserDataWatch, amIFollowingWatch];

export function* getUserDataWatch() {
  yield takeLatest(actions.getUserData.TRIGGER, getUserData);
}

export function* amIFollowingWatch() {
  yield takeLatest(actions.amIFollowing.TRIGGER, amIFollowing);
}

function* getUserData({ payload }) {
  const results = payload.userId
    ? yield all([
      yield api.getUserData(payload),
      yield api.amIFollowing(payload.userId, payload.id),
      yield api.updateUserViews(payload)
    ])
    : yield all([
      yield api.getUserData(payload),
      yield api.updateUserViews(payload)
    ]);

  if (results[0].status == 200) {
    results[0].data.amIFollowing = results[1] || false;
    yield put(actions.getUserData.success(results[0].data));
  } else {
    yield put(actions.getUserData.failure(results[0]));
  }
}

function* amIFollowing({ payload }) {
  const serverResponse = yield api.amIFollowing(payload.userId, payload.id)
  yield put(actions.amIFollowing.success(serverResponse));
}
