import {put, takeLatest} from 'redux-saga/effects';
import * as presaleActions from './presaleActions';
import {
  clientGetLeaderBoard,
  clientGetPresaleProgress,
  clientGetEosBalances,
  clientGetMyPresaleBalances,
  clientGetTrybeExchangeRate
} from './presaleClientApi';
import * as scatterClientApi from '../scatter/scatterClientApi';

export const presaleWatches = [
  getLeaderBoardWatch,
  getPresaleProgressWatch,
  getEosBalancesWatch,
  getMyPresaleBalancesWatch,
  getTrybeExchangeRateWatch,
  purchaseTrybeWatch
];

export function* getLeaderBoardWatch() {
  yield takeLatest(presaleActions.getLeaderBoardRoutine.TRIGGER, getLeaderBoard);
}

export function* getPresaleProgressWatch() {
  yield takeLatest(presaleActions.getPresaleProgressRoutine.TRIGGER, getPresaleProgress);
}

export function* purchaseTrybeWatch() {
  yield takeLatest(presaleActions.purchaseTrybeRoutine.TRIGGER, purchaseTrybe);
}

export function* getEosBalancesWatch() {
  yield takeLatest(presaleActions.getEosBalancesRoutine.TRIGGER, getEosBalances);
}

export function* getTrybeExchangeRateWatch() {
  yield takeLatest(presaleActions.getTrybeExchangeRateRoutine.TRIGGER, getTrybeExchangeRate);
}

export function* getMyPresaleBalancesWatch() {
  yield takeLatest(presaleActions.getMyPresaleBalancesRoutine.TRIGGER, getMyPresaleBalances);
}

function* getLeaderBoard() {
  const serverResponse = yield clientGetLeaderBoard();
  if(serverResponse.data) {
    yield put(presaleActions.getLeaderBoardRoutine.success(serverResponse.data));
  } else {
    yield put(presaleActions.getLeaderBoardRoutine.failure(serverResponse));
  }
}

function* getPresaleProgress() {
  const serverResponse = yield clientGetPresaleProgress();
  if(serverResponse.data) {
    yield put(presaleActions.getPresaleProgressRoutine.success(serverResponse.data));
  } else {
    yield put(presaleActions.getPresaleProgressRoutine.failure(serverResponse));
  }
}

function* getEosBalances({payload}) {
  const serverResponse = yield clientGetEosBalances(payload);
  if(serverResponse.data) {
    yield put(presaleActions.getEosBalancesRoutine.success(serverResponse.data));
  } else {
    yield put(presaleActions.getEosBalancesRoutine.failure(serverResponse));
  }
}

function* getMyPresaleBalances({payload}) {
  const serverResponse = yield clientGetMyPresaleBalances(payload);
  const {data} = serverResponse;
  if(data && data.rows && data.rows[0]) {
    yield put(presaleActions.getMyPresaleBalancesRoutine.success(data.rows[0]));
  } else {
    yield put(presaleActions.getMyPresaleBalancesRoutine.failure(serverResponse));
  }
}

function* getTrybeExchangeRate() {
  const serverResponse = yield clientGetTrybeExchangeRate();
  const {data} = serverResponse;
  if(data && data.rows && data.rows[0]) {
    yield put(presaleActions.getTrybeExchangeRateRoutine.success(data.rows[0]));
  } else {
    yield put(presaleActions.getTrybeExchangeRateRoutine.failure(serverResponse));
  }
}

function* purchaseTrybe({payload}) {
  const {account} = payload.props;
  const {eos} = payload.values;
  yield scatterClientApi.createTransfer({
    account: account.toJS(),
    to: 'trybepresale',
    amount: `${parseFloat(eos).toFixed(4)} EOS`,
    memo: 'TRYBE PRESALE',
  });
}