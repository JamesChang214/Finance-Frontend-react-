import { put, takeLatest, all } from 'redux-saga/effects';
import * as actions from './settingsActions';
import * as userActions from '../../user/userActions';
import * as api from './settingsApi';

export const settingsWatchers = [updateUserWatch, updateAvatarWatch, getRefIdWatch, setEosAccountWatch];

export function* updateUserWatch() {
  yield takeLatest(actions.updateUser.TRIGGER, updateUser);
}
export function* updateAvatarWatch() {
  yield takeLatest(actions.updateAvatar.TRIGGER, updateAvatar);
}
export function* getRefIdWatch() {
  yield takeLatest(actions.getRefId.TRIGGER, getRefId);
}
export function* setEosAccountWatch() {
  yield takeLatest(actions.setEosAccount.TRIGGER, setEosAccount);
}

function* getRefId({payload}) {
  const serverResponse = yield api.getRefId(payload);
  if (serverResponse.status === 200) {
    yield put(actions.getRefId.success(serverResponse.data));
  } else {
    yield put(actions.getRefId.failure(serverResponse));
  }
}

function* updateUser({ payload }) {
  const serverResponse = yield api.updateUser(payload);
  if (serverResponse.status === 200) {
    yield all([
      put(actions.updateUser.success(serverResponse.data)),
      put(userActions.getUserData.success(serverResponse.data))
    ]);
  } else {
    yield put(actions.updateUser.failure(serverResponse));
  }
}
function* updateAvatar({ payload }) {
  const serverResponse = yield api.updateAvatar(payload);
  if (serverResponse.status === 200) {
    yield put(actions.updateAvatar.success(serverResponse.data));
  } else {
    yield put(actions.updateUser.failure(serverResponse));
  }
}
function* setEosAccount({ payload }) {
  const serverResponse = yield api.setEosAccount(payload);
  if (serverResponse.status === 200) {
    yield put(actions.setEosAccount.success(serverResponse.data));
  } else {
    yield put(actions.setEosAccount.failure(serverResponse));
  }
}