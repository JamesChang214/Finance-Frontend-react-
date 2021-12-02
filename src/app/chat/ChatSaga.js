import { put, takeLatest, takeEvery } from 'redux-saga/effects';
import * as actions from './ChatActions';
import * as api from './ChatApi';

export const chatWatchers = [
  connectToChatWatch,
  getChannelsWatch,
  loadTargetChannelWatch
];

export function* connectToChatWatch() {
  yield takeLatest(actions.connectToChat.TRIGGER, connectToChat);
}
export function* getChannelsWatch() {
  yield takeEvery(actions.getChannels.TRIGGER, getChannels );
}
export function* loadTargetChannelWatch() {
  yield takeEvery(actions.loadTargetChannel.TRIGGER, loadTargetChannel);
}


function* connectToChat({ payload }) {
  const serverResponse = yield api.connectToChat(payload);
  if( serverResponse.UUID ) {
    yield put( actions.connectToChat.success(serverResponse) );
  } else {
    yield put( actions.connectToChat.failure(serverResponse) );
  }
}

function* getChannels({ payload }) {
  const serverResponse = yield api.getChannels(payload);
  if( serverResponse instanceof Array ) {
    yield put(
      actions.getChannels.success({
        channels: serverResponse,
        more: payload.more? true : false
      })
    );
  } else {
    yield put( actions.getChannels.failure(serverResponse) );
  }
}

function* loadTargetChannel({ payload }) {
  const response = yield api.getChannelByMembers(payload);
  if(response) {
    yield put( actions.loadTargetChannel.success(response) );
  } else {
    yield put( actions.loadTargetChannel.failure(new Error('Channel not found')) );
  }
}