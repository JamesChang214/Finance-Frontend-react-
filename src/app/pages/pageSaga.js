import { put, takeLatest } from 'redux-saga/effects';
import * as scatterClientApi from '../scatter/scatterClientApi';
import {showProcessAlert, showSuccessAlert, showErrorAlert} from '../alerts/showAlert';
import * as pageActions from './pageActions';
import {
  clientGetPageDescriptions,
  weeklyPayoutDescriptions,
  clientGetWithdraws,
  clientLinkedAccounts,
  getTotalWithdraw,
  addWithdraw,
  subBalance,
  fetchWithdrawStatus,
  fetchPowerupStatus
} from './pageApi';

export const pageWatches = [
  getPageDescriptionsWatch,
  getWeeklyPayoutDesc,
  getWitdrawsWatch,
  getLinkedAccountsWatch,
  subBalanceWatch,
  approveWithdrawWatch,
  denyWithdrawWatch,
  getTotalWithdrawsWatch,
  getWithdrawStatusWatch,
  getPowerupStatusWatch
];

export function* getWithdrawStatusWatch() {
  yield takeLatest(pageActions.getWithdrawStatusRoutine.TRIGGER, getWithdrawStatus);
}

export function* getPowerupStatusWatch() {
  yield takeLatest(pageActions.getPowerupStatusRoutine.TRIGGER, getPowerupStatus);
}

export function* getPageDescriptionsWatch() {
  yield takeLatest(pageActions.getPageDescriptionsRoutine.TRIGGER, getPageDesc);
}

export function* getWeeklyPayoutDescWatch() {
  yield takeLatest(pageActions.weeklyPayoutRoutine.TRIGGER, getWeeklyPayoutDesc);
}

export function* getWitdrawsWatch() {
  yield takeLatest(pageActions.getWitdrawsRoutine.TRIGGER, getWithdrawsData);
}

export function* getLinkedAccountsWatch() {
  yield takeLatest(pageActions.getLinkedAccountsRoutine.TRIGGER, getLinkedAccounts);
}

export function* getTotalWithdrawsWatch() {
  yield takeLatest(pageActions.getTotalWithdrawsRoutine.TRIGGER, getTotalWithdraws);
}

export function* subBalanceWatch() {
  yield takeLatest(pageActions.subBalanceRoutine.TRIGGER, sendSubBalance);
}

export function* approveWithdrawWatch() {
  yield takeLatest(pageActions.getWithdrawApproveRoutine.TRIGGER, approveWithdraw);
}

export function* denyWithdrawWatch() {
  yield takeLatest(pageActions.getWithdrawDenyRoutine.TRIGGER, denyWithdraw);
}

function* getWithdrawStatus() {
  const serverResponse = yield fetchWithdrawStatus();
  if (serverResponse.data) {
    yield put(pageActions.getWithdrawStatusRoutine.success(serverResponse.data));
  } else {
    yield put(pageActions.getWithdrawStatusRoutine.failure(serverResponse));
  }
}

function* getPowerupStatus() {
  const serverResponse = yield fetchPowerupStatus();
  if (serverResponse.data) {
    yield put(pageActions.getPowerupStatusRoutine.success(serverResponse.data));
  } else {
    yield put(pageActions.getPowerupStatusRoutine.failure(serverResponse));
  }
}

function* getPageDesc() {
  const serverResponse = yield clientGetPageDescriptions();
  if (serverResponse.data) {
    yield put(pageActions.getPageDescriptionsRoutine.success(serverResponse.data));
  } else {
    yield put(pageActions.getPageDescriptionsRoutine.failure(serverResponse));
  }
}


function* getWeeklyPayoutDesc() {
  const serverResponse = yield weeklyPayoutDescriptions();
  if (serverResponse.data) {
    yield put(pageActions.weeklyPayoutRoutine.success(serverResponse.data));
  } else {
    yield put(pageActions.weeklyPayoutRoutine.failure(serverResponse));
  }
}


function* getWithdrawsData() {
  const serverResponse = yield clientGetWithdraws();
  if (serverResponse.data) {
    yield put(pageActions.getWitdrawsRoutine.success(serverResponse.data));
    yield getTotalWithdraws();
  } else {
    yield put(pageActions.getWitdrawsRoutine.failure(serverResponse));
  }
}

function* getTotalWithdraws() {
  const serverResponse = yield getTotalWithdraw();
  if (serverResponse.data) {
    yield put(pageActions.getTotalWithdrawsRoutine.success(serverResponse.data));
  } else {
    yield put(pageActions.getTotalWithdrawsRoutine.failure(serverResponse));
  }
}

function* getLinkedAccounts() {
  const serverResponse = yield clientLinkedAccounts();
  if (serverResponse.data) {
    yield put(pageActions.getLinkedAccountsRoutine.success(serverResponse.data));
  } else {
    yield put(pageActions.getLinkedAccountsRoutine.failure(serverResponse));
  }
}

function* approveWithdraw({ payload }) {
  showProcessAlert('Waiting for Wallet'); // Message
  const serverResponse = yield scatterClientApi.broadcastTransaction({
    contract: 'trybenetwork',
    method: 'apprwithdraw',
    data: payload.actions,
  });
  if (serverResponse.processed) {
    showSuccessAlert('Transaction was Successful.', serverResponse.transaction_id);
    yield put(pageActions.getWithdrawApproveRoutine.success(serverResponse.processed));
    yield getWithdrawsData();
    yield getLinkedAccounts();
    yield getTotalWithdraws();
    yield addWithdraw(payload.endpoint.token, payload.endpoint.id);
  } else {
    (serverResponse.message ? showErrorAlert(serverResponse.message) : showErrorAlert(serverResponse));
    yield put(pageActions.getWithdrawApproveRoutine.failure(serverResponse));
  }
}

function* denyWithdraw({ payload }) {
  showProcessAlert('Waiting for Wallet'); // Message
  const serverResponse = yield scatterClientApi.broadcastTransaction({
    contract: 'trybenetwork',
    method: 'clrwithdraw',
    data: payload,
  });
  if (serverResponse.processed) {
    showSuccessAlert('Transaction was Successful.', serverResponse.transaction_id);
    yield put(pageActions.getWithdrawDenyRoutine.success(serverResponse.processed));
    yield getWithdrawsData();
    yield getLinkedAccounts();
    yield getTotalWithdraws();
  } else {
    (serverResponse.message ? showErrorAlert(serverResponse.message) : showErrorAlert(serverResponse));
    yield put(pageActions.getWithdrawDenyRoutine.failure(serverResponse));
  }
}

function* sendSubBalance({payload}) {
  const serverResponse = yield subBalance(payload.sub.token, payload.sub.id, payload.sub.amount);
  if (serverResponse.data.status == "success") {
    yield put(pageActions.subBalanceRoutine.success(serverResponse.data));
    showSuccessAlert('Balance Deducted, You can now send the funds.', 'Do not run this again');
  } else {
    yield put(pageActions.subBalanceRoutine.failure(serverResponse));
    showSuccessAlert('Balance Deduction Failed, Do not send funds.', 'Try Again Later');
  }
}