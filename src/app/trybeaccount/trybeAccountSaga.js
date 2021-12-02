import {put, takeLatest} from 'redux-saga/effects';
import * as trybeAccountActions from './trybeAccountActions';
import * as scatterClientApi from '../scatter/scatterClientApi';
import {showProcessAlert, showSuccessAlert, showErrorAlert} from '../alerts/showAlert';
import {
  clientGetTrybeAccountBalances
} from './trybeAccountClientApi';

export const trybeAccountWatches = [
  getTrybeAccountBalancesWatch,
  migrateTrybeWatch
];

export function* getTrybeAccountBalancesWatch() {
  yield takeLatest(trybeAccountActions.getTrybeAccountBalancesRoutine.TRIGGER, getEosBalances);
}
export function* migrateTrybeWatch() {
  yield takeLatest(trybeAccountActions.migrateTrybeRoutine.TRIGGER, migrateAction);
}

function* getEosBalances({payload}) {
  const serverResponse = yield clientGetTrybeAccountBalances(payload);
  console.log('response', serverResponse);
  if(serverResponse) {
    yield put(trybeAccountActions.getTrybeAccountBalancesRoutine.success(serverResponse));
  } else {
    yield put(trybeAccountActions.getTrybeAccountBalancesRoutine.failure(serverResponse));
  }
}

function* migrateAction({payload}) {
  console.log(payload);
  showProcessAlert('Waiting for Wallet'); // Message
  const serverResponse = yield scatterClientApi.broadcastTransaction({
    contract: 'trybenetwork',
    method: 'transfer',
    data: payload.data,
  });
  if(serverResponse.processed) {
    showSuccessAlert('Transaction was Successful.', serverResponse.transaction_id);
    yield put(trybeAccountActions.migrateTrybeRoutine.success(serverResponse.processed));
    yield put(trybeAccountActions.getTrybeAccountBalancesRoutine.trigger({account: payload.data.from}));
  } else {
    (serverResponse.message ? showErrorAlert(serverResponse.message) : showErrorAlert(serverResponse));
    yield put(trybeAccountActions.migrateTrybeRoutine.failure(serverResponse));
  }
}