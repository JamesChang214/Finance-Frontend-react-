import { put, takeLatest, all, call } from 'redux-saga/effects';

import * as actions from './userActions';
import * as api from './userApi';

export const userWatchers = [
  loginWatch,
  getUserDataWatch,
  forgotPasswordRequestWatch,
  sendNewPasswordWatch
];

export function* loginWatch() {
  yield takeLatest(actions.postLogin.TRIGGER, postLogin);
}
export function* getUserDataWatch() {
  yield takeLatest(actions.getUserData.TRIGGER, getUserData);
}
export function* forgotPasswordRequestWatch() {
  yield takeLatest(actions.forgotPasswordRequest.TRIGGER, forgotPasswordRequest);
}
export function* sendNewPasswordWatch() {
  yield takeLatest(actions.sendNewPassword.TRIGGER, sendNewPassword);
}


function* postLogin(data) {
  const serverResponse = yield api.postLogin(data);
  if (serverResponse.status === 200) {
    console.log(serverResponse);
    yield put(actions.postLogin.success(serverResponse.data));
  } else {
    yield put(actions.postLogin.failure(serverResponse.data));
  }
}
function* getUserData({ payload }) {
  function fetchUserData() {
    return api.getUserData(payload);
  }
  function fetchEosAccount() {
    return api.getEosAccountName(payload);
  }
  const [resUserData, resEosAccount] = yield all([
    call(fetchUserData),
    call(fetchEosAccount)
  ]);

  if (resUserData.data && resUserData.data.capabilities.bbp_blocked != true) {
    api.updateUser({
      name: resUserData.data.name,
      slug: resUserData.data.slug,
      avatarUrl: resUserData.data.avatar_urls[96],
      userId: resUserData.data.id.toString()
    });
    yield put(
      actions.getUserData.success({
        ...resUserData.data,
        eosAccount: resEosAccount.eos_account
      })
    );
  } else {
    yield put(actions.getUserData.failure(resUserData));
  }
}
function* forgotPasswordRequest({ payload }) {
  const serverResponse = yield api.forgotPasswordRequest(payload);
  if (serverResponse.status === 200) {
    yield put(actions.forgotPasswordRequest.success(serverResponse.data));
  } else {
    yield put(actions.forgotPasswordRequest.failure(serverResponse.data));
  }
}
function* sendNewPassword({ payload }) {
  const serverResponse = yield api.sendNewPassword(payload);
  if (serverResponse.status === 200) {
    yield put(actions.sendNewPassword.success(serverResponse.data));
  } else {
    yield put(actions.sendNewPassword.failure(serverResponse.data));
  }
}
