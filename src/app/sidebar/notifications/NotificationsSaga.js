import { put, call, takeLatest, takeEvery } from 'redux-saga/effects';
import * as actions from './NotificationsActions';
import * as api from './NotificationsApi';

export const notificationsWatchers = [
  getNotificationsWatch,
  removeRealtimeNotificationWatch,
  newNotificationWatch
];
const delay = time => new Promise(resolve => setTimeout(resolve, time));


export function* getNotificationsWatch() {
  yield takeLatest(actions.getNotifications.TRIGGER, getNotifications);
}
export function* newNotificationWatch() {
  yield takeEvery(actions.newNotification.TRIGGER, newNotification);
}
export function* removeRealtimeNotificationWatch() {
  yield takeEvery(actions.removeRealtimeNotification.TRIGGER, removeRealtimeNotification);
}

function* getNotifications({ payload }) {
  const serverResponse = yield api.getNotifications(payload);
  if (serverResponse.results) {
    yield put( actions.getNotifications.success({
      notifications: serverResponse.results,
      markSeen: payload.markSeen
    }) );
  } else {
    yield put( actions.getNotifications.failure(serverResponse) );
  }
}

function* newNotification({ payload }) {
  yield put( actions.newNotification.success() );
  yield call(delay, 5000);
  yield put( actions.removeRealtimeNotification.trigger(payload[0].id) );
}

function* removeRealtimeNotification() {
  yield put( actions.removeRealtimeNotification.success() );
}


/*function* subscribeOnRealtimeNotificationsWatcher() {
  yield takeLatest(actions.subscribeOnRealtimeNotifications.TRIGGER, subscribeOnNotifications);
}
function* subscribeOnNotifications({ payload }) {
  const [ token, client ] = yield all([
    yield api.getReadonlyToken(payload),
    yield streamConnectById(payload.userId)
  ]);
  const notificationFeed = client.feed('notification', payload.userId.toString(), token);

  function* callback(data) {
    //console.log(data);
    //alert('A new activity: ' + JSON.stringify(data));
    yield put( actions.newNotificationRoutine.trigger(data) );
    yield put( actions.newNotificationRoutine.success() );
  }

  function successCallback() {
    console.log('Now listening to changes in realtime. Add an activity to see how realtime works.');
  }

  function failCallback(data) {
    console.log('fail callback', data);
  }

  notificationFeed.subscribe(callback).then(successCallback, failCallback);

  yield put(actions.subscribeOnRealtimeNotifications.success());
}*/