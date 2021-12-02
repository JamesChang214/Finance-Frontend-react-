import {put, takeLatest} from 'redux-saga/effects';
import * as airdropActions from './airdropActions';
import {
  clientGetAirdropLeaderBoard,
} from './airdropClientApi';
import {broadcastTransaction} from '../scatter/scatterClientApi';
//import * as scatterClientApi from '../scatter/scatterClientApi';

export const airdropWatches = [
  getAirdropLeaderBoardWatch,
  claimAirdropWatch
];

export function* getAirdropLeaderBoardWatch() {
  yield takeLatest(airdropActions.getAirdropLeaderBoardRoutine.TRIGGER, getAirdropLeaderBoard);
}

export function* claimAirdropWatch() {
  yield takeLatest(airdropActions.claimAirdropRoutine.TRIGGER, claimAirdrop);
}

function* getAirdropLeaderBoard() {
  const serverResponse = yield clientGetAirdropLeaderBoard();
  if(serverResponse.data) {
    yield put(airdropActions.getAirdropLeaderBoardRoutine.success(serverResponse.data));
  } else {
    yield put(airdropActions.getAirdropLeaderBoardRoutine.failure(serverResponse));
  }
}

function* claimAirdrop({payload}) {
  console.log('payload', payload);
  const account = payload;
  const serverResponse = yield broadcastTransaction({
    //account: account.toJS(),
    contract: 'trybenetwork',
    method: 'claimdrop',
    data: {
      account
    },
  });

  if(serverResponse.processed) {
    yield put(airdropActions.claimAirdropRoutine.success(serverResponse.data));
  } else {
    yield put(airdropActions.claimAirdropRoutine.failure(JSON.parse(serverResponse).error.details[0].message));
  }
}