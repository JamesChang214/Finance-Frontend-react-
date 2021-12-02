import { put, takeLatest } from 'redux-saga/effects';
import * as feedActions from './feedActions';
import { getPostsCall } from './feedApi';

export const feedWatchers = [getPostsWatch];

export function* getPostsWatch() {
  yield takeLatest(feedActions.getPostsRoutine.TRIGGER, getPosts);
}

function* getPosts(payload) {
  const serverResponse = yield getPostsCall(payload);
  if (serverResponse && serverResponse.status === 200) {
    yield put(feedActions.getPostsRoutine.success(serverResponse.data));
  } else {
    yield put(feedActions.getPostsRoutine.failure(serverResponse));
  }
}
