import { put, takeLatest, takeEvery } from 'redux-saga/effects';
import * as actions from './FollowingActions';
import * as api from './FollowingApi';

export const followingWatchers = [
  getFollowersWatch,
  getFollowingWatch,
  followWatcher,
  unfollowWatcher
];

export function* getFollowersWatch() {
  yield takeLatest(actions.getFollowers.TRIGGER, getFollowers);
}
export function* getFollowingWatch() {
  yield takeLatest(actions.getFollowing.TRIGGER, getFollowing);
}
export function* followWatcher() {
  yield takeEvery(actions.follow.TRIGGER, follow);
}

function* getFollowers({ payload }) {
  const serverResponse = yield api.getMyFollowers( payload );

  if(serverResponse.status == 200) {
    const proccessed = serverResponse.data.map((el) => {
      return {
        person: el,
        disabled: false
      }
    });

    yield put( actions.getFollowers.success(proccessed) );
  } else {
    console.log('something went wrong ', serverResponse);
  }
}

function* getFollowing({ payload }) {
  const serverResponse = yield api.getFollowingUsers( payload );
  if(serverResponse.status == 200) {
    const proccessed = serverResponse.data.map(el => ({
      person: el,
      isLoading: false
    }) );
    yield put( actions.getFollowing.success(proccessed) );
  } else {
    console.log('something went wrong ', serverResponse);
  }
}

function* follow({ payload }) {
  const serverResponse = yield api.follow( payload );
  if(serverResponse.status == 200) {
    yield put( actions.follow.success({ getstreamResponse: serverResponse.data, index: payload.index }) );
  } else {
    console.log('unable to follow the user ', serverResponse);
    yield put( actions.follow.failure({ getstreamResponce: serverResponse, index: payload.index }) );
  }
}

export function* unfollowWatcher() {
  yield takeEvery(actions.unfollow.TRIGGER, unfollow);
}
function* unfollow({ payload }) {
  const serverResponse = yield api.unfollow( payload );
  if(serverResponse.status == 200) {
    yield put( actions.unfollow.success({ getstreamResponse: serverResponse.data, index: payload.index }) );
  } else {
    console.log('unable to unfollow the user ', serverResponse);
    yield put( actions.unfollow.failure({ getstreamResponse: serverResponse, index: payload.index }) );
  }
}