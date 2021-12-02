import { put, takeLatest } from 'redux-saga/effects';
import * as powerUpActions from './powerUpActions';
import { getPowerupInfo, getPowerOfDisplayDetails, getPowerHelper } from './powerUpApi';

export const powerUpWatches = [getPowerUpDataWatch, getPowerUpDisplayDataWatch, getPowerUpHelperDataWatch];

export function* getPowerUpDataWatch() {
  yield takeLatest(powerUpActions.getPowerUpData.TRIGGER, getPowerUpData);
}

export function* getPowerUpDisplayDataWatch() {
  yield takeLatest(powerUpActions.getPowerUpDisplayData.TRIGGER, getPowerUpDisplayData);
}

export function* savePowerUpDataWatch() {
  yield takeLatest(powerUpActions.savePowerUpData.TRIGGER, savePowerUpData);
}

export function* getPowerUpHelperDataWatch() {
  yield takeLatest(powerUpActions.getPowerUpHelperData.TRIGGER, getPowerUpHelperData);
}

function* getPowerUpData({ payload }) {
  const serverResponse = yield getPowerupInfo({payload});
  if (serverResponse.data) {
    yield put(powerUpActions.getPowerUpData.success(serverResponse.data));
  } else {
    yield put(powerUpActions.getPowerUpData.failure(serverResponse));
  }
}

function* getPowerUpDisplayData({ payload }) {
  const serverResponse = yield getPowerOfDisplayDetails({payload});
  if (serverResponse.data) {
    yield put(powerUpActions.getPowerUpDisplayData.success(serverResponse.data));
  } else {
    yield put(powerUpActions.getPowerUpDisplayData.failure(serverResponse));
  }
}

function* savePowerUpData({ payload }) {
  const serverResponse = yield getPowerOfDisplayDetails({payload});
  if (serverResponse.data) {
    yield put(powerUpActions.getPowerUpDisplayData.success(serverResponse.data));
  } else {
    yield put(powerUpActions.getPowerUpDisplayData.failure(serverResponse));
  }
}

function* getPowerUpHelperData({ payload }) {
  const serverResponse = yield getPowerHelper({payload});
  if (serverResponse.data) {
    yield put(powerUpActions.getPowerUpHelperData.success(serverResponse.data));
  } else {
    yield put(powerUpActions.getPowerUpHelperData.failure(serverResponse));
  }
}
