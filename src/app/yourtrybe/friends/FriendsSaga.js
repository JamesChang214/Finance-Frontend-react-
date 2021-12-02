import { put, takeLatest, takeEvery } from 'redux-saga/effects';
import * as actions from './FriendsActions';
import * as api from './FriendsApi';

// import {
//   listoffriends,
//   friendshipsrequestlist
// } from '../../util/mockedFriendshipRequests';

export const friendsWatchers = [
  getFriendsWatch,
  getRequestsWatch,
  requestFriendshipWatch,
  acceptFriendshipRequestWatch,
  cancelFriendshipRequestWatch,
  rejectFriendshipRequestWatch,
  removeFriendWatch,
  checkFriendshipWatch
];

export function* checkFriendshipWatch() {
  yield takeLatest(
    actions.checkFriendshipStatus.TRIGGER,
    checkFriendshipStatus
  );
}
export function* getFriendsWatch() {
  yield takeLatest(actions.getFriends.TRIGGER, getFriends);
}
export function* getRequestsWatch() {
  yield takeLatest(actions.getRequests.TRIGGER, getRequests);
}
export function* removeFriendWatch() {
  yield takeEvery(actions.removeFriend.TRIGGER, removeFriend);
}
export function* requestFriendshipWatch() {
  yield takeEvery(actions.requestFriendship.TRIGGER, requestFriendship);
}
export function* acceptFriendshipRequestWatch() {
  yield takeEvery(
    actions.acceptFriendshipRequest.TRIGGER,
    acceptFriendshipRequest
  );
}
export function* rejectFriendshipRequestWatch() {
  yield takeEvery(
    actions.rejectFriendshipRequest.TRIGGER,
    rejectFriendshipRequest
  );
}
export function* cancelFriendshipRequestWatch() {
  yield takeEvery(
    actions.cancelFriendshipRequest.TRIGGER,
    cancelFriendshipRequest
  );
}

function* cancelFriendshipRequest({ payload }) {
  const serverResponse = yield api.cancelFriendshipRequest(payload);
  if (serverResponse.status == 200) {
    yield put(actions.cancelFriendshipRequest.success(serverResponse.data));
  } else {
    console.log('something went wrong ', serverResponse);
    yield put(actions.cancelFriendshipRequest.failure());
  }
}

function* checkFriendshipStatus({ payload }) {
  const serverResponse = yield api.checkFriendshipStatus(payload);
  if (serverResponse.status == 200) {
    yield put(actions.checkFriendshipStatus.success(serverResponse.data));
  } else {
    console.log('something went wrong ', serverResponse);
    yield put(actions.checkFriendshipStatus.failure());
  }
}

function* rejectFriendshipRequest({ payload }) {
  const serverResponse = yield api.rejectFriendshipRequest(payload);
  if (serverResponse.status == 200) {
    yield put(actions.rejectFriendshipRequest.success(serverResponse.data));
  } else {
    console.log('something went wrong ', serverResponse);
    yield put(actions.rejectFriendshipRequest.failure());
  }
}

function* acceptFriendshipRequest({ payload }) {
  const serverResponse = yield api.acceptFriendshipRequest(payload);
  if (serverResponse.status == 200) {
    yield put(actions.acceptFriendshipRequest.success(serverResponse.data));
  } else {
    console.log('something went wrong ', serverResponse);
    yield put(actions.acceptFriendshipRequest.failure());
  }
}

function* requestFriendship({ payload }) {
  const serverResponse = yield api.createFriendshipRequest(payload);
  if (serverResponse.status == 200) {
    yield put(actions.requestFriendship.success(serverResponse.data));
  } else {
    console.log('something went wrong ', serverResponse);
    yield put(actions.requestFriendship.failure());
  }
}

function* getFriends({ payload }) {
  const serverResponse = yield api.listFriends(payload);
  if (serverResponse.status == 200) {
    yield put(actions.getFriends.success(serverResponse.data));
  } else {
    console.log('something went wrong ', serverResponse);
    yield put(actions.getFriends.failure());
  }

  //mocked
  //yield put(actions.getFriends.success(listoffriends));
}

function* getRequests({ payload }) {
  const serverResponse = yield api.listFriendshipRequests(payload);
  if (serverResponse.status == 200) {
    yield put(actions.getRequests.success(serverResponse.data));
  } else {
    console.log('something went wrong ', serverResponse);
    yield put(actions.getRequests.failure());
  }

  //mocked
  // yield put(actions.getRequests.success(friendshipsrequestlist));
}

function* removeFriend({ payload }) {
  const serverResponse = yield api.removeFriend(payload);
  if (serverResponse.status == 200) {
    yield put(actions.removeFriend.success(serverResponse.data));
  } else {
    console.log('something went wrong ', serverResponse);
    yield put(actions.removeFriend.failure());
  }
}
