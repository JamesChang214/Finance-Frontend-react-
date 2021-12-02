import {put, takeLatest} from 'redux-saga/effects';
import * as scatterActions from './scatterActions';
import * as scatterClientApi from './scatterClientApi';
import * as trybeAccountActions from '../trybeaccount/trybeAccountActions';
import {showProcessAlert, showSuccessAlert, showErrorAlert} from '../alerts/showAlert';

export const scatterWatches = [
  connectToScatterWatch,
  signInToScatterWatch,
  signOutOfScatterWatch,
  stakeTrybeWatch,
  unstakeTrybeWatch,
  withdrawTrybeWatch,
  claimwdTrybeWatch,
  powerupTrybeWatch,
  refundTrybeWatch,
  claimPresaleWatch
];

export function* connectToScatterWatch() {
  yield takeLatest(scatterActions.connectToScatterRoutine.TRIGGER, connectToScatter);
}

export function* signInToScatterWatch() {
  yield takeLatest(scatterActions.signInToScatterRoutine.TRIGGER, signInToScatter);
}

export function* signOutOfScatterWatch() {
  yield takeLatest(scatterActions.signOutOfScatterRoutine.TRIGGER, signOutOfScatter);
}

export function* stakeTrybeWatch() {
  yield takeLatest(scatterActions.stakeTrybeRoutine.TRIGGER, stakeTrybe);
}

export function* unstakeTrybeWatch() {
  yield takeLatest(scatterActions.unstakeTrybeRoutine.TRIGGER, unstakeTrybe);
}

export function* withdrawTrybeWatch() {
  yield takeLatest(scatterActions.withdrawTrybeRoutine.TRIGGER, withdrawTrybe);
}

export function* claimwdTrybeWatch() {
  yield takeLatest(scatterActions.claimwdTrybeRoutine.TRIGGER, claimwdTrybe);
}

export function* powerupTrybeWatch() {
  yield takeLatest(scatterActions.powerupTrybeRoutine.TRIGGER, powerupTrybe);
}

export function* refundTrybeWatch() {
  yield takeLatest(scatterActions.refundTrybeRoutine.TRIGGER, refundTrybe);
}

export function* claimPresaleWatch() {
  yield takeLatest(scatterActions.claimPresaleRoutine.TRIGGER, claimPresale);
}


function* connectToScatter(payload) {
  const scatterConnected = yield scatterClientApi.connectToScatter(payload);
  if(scatterConnected) {
    const scatter = yield scatterClientApi.getScatter();
    yield put(scatterActions.connectToScatterRoutine.success(scatter));
    //const identity = yield scatterClientApi.getScatterIdentity(payload);
    if(scatter) {
      yield put(scatterActions.connectToScatterRoutine.success());
    }
  } else {
    yield put(scatterActions.connectToScatterRoutine.failure());
  }
}

function* signInToScatter({payload}) {
  yield connectToScatter(payload.data);
  const identity = yield scatterClientApi.getScatterIdentity();
  //const linkResult = yield scatterClientApi.linkScatter();
  if(!identity.isError) {
    yield put(scatterActions.signInToScatterRoutine.success(identity));
  } else {
    yield put(scatterActions.signInToScatterRoutine.failure());
  }
}

function* signOutOfScatter() {
  const result = yield scatterClientApi.forgetIdentity();
  if(result===true) {
    yield put(scatterActions.signOutOfScatterRoutine.success(null));
    window.location.reload();
  } else {
    yield put(scatterActions.signOutOfScatterRoutine.failure());
  }
}

function* stakeTrybe({payload}) {
  showProcessAlert('Waiting for Wallet'); // Message
  payload.values.total_trybe = parseFloat(payload.values.total_trybe).toFixed(4) + ' TRYBE';
  const account_name = payload.values.from;
  const serverResponse = yield scatterClientApi.broadcastTransaction({
    contract: 'trybenetwork',
    method: 'stake2',
    data: payload.values,
  });
  if(serverResponse.processed) {
    showSuccessAlert('Transaction was Successful.', serverResponse.transaction_id);
    yield put(scatterActions.stakeTrybeRoutine.success(serverResponse.processed));
    yield put(trybeAccountActions.getTrybeAccountBalancesRoutine.trigger({account_name}));
  } else {
    (serverResponse.message ? showErrorAlert(serverResponse.message) : showErrorAlert(serverResponse));
    yield put(scatterActions.stakeTrybeRoutine.failure(serverResponse));
  }
}

function* unstakeTrybe({payload}) {
  showProcessAlert('Waiting for Wallet'); // Message
  const serverResponse = yield scatterClientApi.broadcastTransaction({
    contract: 'trybenetwork',
    method: 'unstake2',
    data: payload,
  });
  if(serverResponse.processed) {
    showSuccessAlert('Transaction was Successful.', serverResponse.transaction_id);
    yield put(scatterActions.unstakeTrybeRoutine.success(serverResponse.processed));
    yield put(trybeAccountActions.getTrybeAccountBalancesRoutine.trigger({account_name: payload.account_name}));
  } else {
    (serverResponse.message ? showErrorAlert(serverResponse.message) : showErrorAlert(serverResponse));
    yield put(scatterActions.stakeTrybeRoutine.failure(serverResponse));
  }
}

function* withdrawTrybe({payload}) {
  console.log(payload);
  showProcessAlert('Waiting for Wallet'); // Message
  const withdraw_status = yield scatterClientApi.fetchWithdrawStatus();
  console.log(withdraw_status)
  console.log(withdraw_status != (false || undefined));
  if (withdraw_status != (false || undefined)) {
    if (payload.data.total > 10000) {
      showErrorAlert('You can withdraw a maximum of 10000 per day, you are trying to withdraw ' + payload.data.total);
    } else if (payload.data.total < 500) {
      showErrorAlert('You can withdraw a minimum of 500 per day, you are trying to withdraw ' + payload.data.total);
    } else {
      payload.data.total = parseFloat(payload.data.total).toFixed(4) + ' TRYBE';
      const account_name = payload.data.account;
      const serverResponse = yield scatterClientApi.broadcastTransaction({
        contract: 'trybenetwork',
        method: 'sitewithdraw',
        data: payload.data,
      });
      if(serverResponse.processed) {
        showSuccessAlert('Transaction was Successful.', serverResponse.transaction_id);
        yield put(scatterActions.withdrawTrybeRoutine.success(serverResponse.processed));
        yield scatterClientApi.newWithdraw({
          token: payload.token,
          transaction_id: serverResponse.transaction_id,
          amount: parseFloat(payload.data.total),
          eos_account: payload.data.account
        });
        yield put(trybeAccountActions.getTrybeAccountBalancesRoutine.trigger({account_name}));
      } else {
        (serverResponse.message ? showErrorAlert(serverResponse.message) : showErrorAlert(serverResponse));
        yield put(scatterActions.withdrawTrybeRoutine.failure(serverResponse));
      }
    }
  } else {
    showErrorAlert('Withdraws are currently disabled');
  }
}

function* claimwdTrybe({payload}) {
  console.log(payload);
  showProcessAlert('Waiting for Wallet'); // Message
  const serverResponse = yield scatterClientApi.broadcastTransaction({
    contract: 'trybenetwork',
    method: 'sendwithdraw',
    data: payload,
  });
  if(serverResponse.processed) {
    showSuccessAlert('Transaction was Successful.', serverResponse.transaction_id);
    yield put(scatterActions.claimwdTrybeRoutine.success(serverResponse.processed));
    yield put(trybeAccountActions.getTrybeAccountBalancesRoutine.trigger({account: payload.account}));
  } else {
    (serverResponse.message ? showErrorAlert(serverResponse.message) : showErrorAlert(serverResponse));
    yield put(scatterActions.claimwdTrybeRoutine.failure(serverResponse));
  }
}

function* powerupTrybe({ payload }) {
  console.log('Powerup Function');
  console.log(payload.data);
  showProcessAlert('Waiting for Wallet'); // Message
  const serverResponse = yield scatterClientApi.broadcastTransaction({
    contract: 'trybenetwork',
    method: 'transfer',
    data: payload.data,
  });
  if(serverResponse.processed) {
    showSuccessAlert('Transaction was Successful, After your transaction is verfied you will receive your Powerup.', serverResponse.transaction_id);
    console.log(serverResponse);
    yield put(scatterActions.powerupTrybeRoutine.success(serverResponse.processed));
    yield scatterClientApi.newPowerup({
      token: payload.token,
      transaction_id: serverResponse.transaction_id,
      amount: parseFloat(payload.data.quantity),
      eos_account: payload.data.from
    });
  } else {
    (serverResponse.message ? showErrorAlert(serverResponse.message) : showErrorAlert(serverResponse));
    yield put(scatterActions.powerupTrybeRoutine.failure(serverResponse));
  }
}


function* refundTrybe({ payload }) {
  console.log('Refund Function');
  showProcessAlert('Waiting for Wallet'); // Message
  const serverResponse = yield scatterClientApi.broadcastTransaction({
    contract: 'trybenetwork',
    method: 'refundtrybe',
    data: payload,
  });
  if(serverResponse.processed) {
    showSuccessAlert('Refund Successful', serverResponse.transaction_id);
    console.log(serverResponse);
    yield put(scatterActions.refundTrybeRoutine.success(serverResponse.processed));
  } else {
    (serverResponse.message ? showErrorAlert(serverResponse.message) : showErrorAlert(serverResponse));
    console.log(serverResponse)
    //showErrorAlert(serverResponse.message);
    yield put(scatterActions.refundTrybeRoutine.failure(serverResponse));
  }
}


function* claimPresale({ payload }) {
  showProcessAlert('Waiting for Wallet'); // Message
  console.log(payload)
  const serverResponse = yield scatterClientApi.broadcastTransaction({
    contract: 'trybenetwork',
    method: 'claimpresale',
    data: payload,
  });
  if(serverResponse.processed) {
    showSuccessAlert('Presale Claim Successful', serverResponse.transaction_id);
    console.log(serverResponse);
    yield put(scatterActions.claimPresaleRoutine.success(serverResponse.processed));
    yield put(trybeAccountActions.getTrybeAccountBalancesRoutine.trigger({account: payload.account}));
  } else {
    (serverResponse.message ? showErrorAlert(serverResponse.message) : showErrorAlert(serverResponse));
    console.log(serverResponse)
    //showErrorAlert(serverResponse.message);
    yield put(scatterActions.claimPresaleRoutine.failure(serverResponse));
  }
}