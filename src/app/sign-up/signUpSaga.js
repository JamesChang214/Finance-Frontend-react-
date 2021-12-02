import { put, takeLatest } from 'redux-saga/effects';
import * as actions from './signUpActions';
import * as api from './signUpApi';

export const signUpWatchers = [signUpWatch, activateUserWatch];

export function* signUpWatch() {
  yield takeLatest(actions.signUp.TRIGGER, signUp);
}

export function* activateUserWatch() {
  yield takeLatest(actions.activateUser.TRIGGER, activateUser);
}

function* activateUser({ payload }) {
  const serverResponse = yield api.activateUser(payload);
  if (serverResponse.status === 200) {
    yield put(actions.activateUser.success(serverResponse.data));
  } else {
    yield put(actions.activateUser.failure(serverResponse));
  }
}

function* signUp({ payload }) {
  const serverResponse = yield api.signUp(payload);
  if (serverResponse.status === 200) {
    yield put(actions.signUp.success(serverResponse.data));
  } else {
    yield put(actions.signUp.failure(serverResponse));
  }
}
