import { put, takeLatest } from 'redux-saga/effects';
import * as payoutActions from './engagementActions';
import { getPayoutStats, getPayoutHistory } from './engagementApi';

export const payoutStatsWatches = [getPayoutDataWatch, getPayoutHistoryWatch];

export function* getPayoutDataWatch() {
  yield takeLatest(payoutActions.getPayoutData.TRIGGER, getPayoutData);
}

export function* getPayoutHistoryWatch() {
  yield takeLatest(payoutActions.getPayoutHistoryRoutine.TRIGGER, getPayoutHistoryData);
}

function* getPayoutData({ payload }) {
  const serverResponse = yield getPayoutStats({payload});
  if (serverResponse) {
    yield put(payoutActions.getPayoutData.success(serverResponse.data));
  } else {
    yield put(payoutActions.getPayoutData.failure(serverResponse));
  }
}

function* getPayoutHistoryData({ payload }) {
  const serverResponse = yield getPayoutHistory({payload});
  if (serverResponse) {
    yield put(payoutActions.getPayoutHistoryRoutine.success(serverResponse.data));
  } else {
    yield put(payoutActions.getPayoutHistoryRoutine.failure(serverResponse));
  }
}
