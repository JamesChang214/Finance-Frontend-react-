import { put, takeLatest } from 'redux-saga/effects';
import { uploadImageRoutine } from './ImageAddActions';
import { uploadImage } from './ImageAddApi';

export const uploadImageWatchers = [uploadImageWatch];

export function* uploadImageWatch() {
  yield takeLatest(uploadImageRoutine.TRIGGER, uploadNewImage);
}

function* uploadNewImage(data) {
  const serverResponse = yield uploadImage(data);
  if (serverResponse.data) {
    yield put(uploadImageRoutine.success(serverResponse.data));
  } else {
    yield put(uploadImageRoutine.failure(serverResponse));
  }
}
