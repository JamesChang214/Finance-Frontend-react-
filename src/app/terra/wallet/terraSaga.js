import {put, takeLatest} from 'redux-saga/effects';
import * as terraActions from './terraActions';
import * as terraClientApi from './terraClientApi';
import {showProcessAlert, showSuccessAlert, showErrorAlert} from '../alerts/showAlert';

export const terraWatches = [
  terraConnectWatch,
];

export function* terraConnectWatch() {
  yield takeLatest(terraActions.terraConnectRoutine.TRIGGER, terraConnectWallet);
}


function* terraConnectWallet(payload) {
  //const terraConnected = yield terraClientApi.connectToScatter(payload);
  console.log("MADE IT HERE!!!!!")
  yield put(terraActions.terraConnectRoutine.success({data: 'test'}));
}

