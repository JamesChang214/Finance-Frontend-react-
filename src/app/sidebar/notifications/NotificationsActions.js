import { createRoutine } from 'redux-saga-routines';

export const getNotifications = createRoutine('notifications/GET');
export const subscribeOnRealtimeNotifications = createRoutine('notification/SUBSCRIBE');
export const newNotification = createRoutine('notification/NEW');
export const removeRealtimeNotification = createRoutine('notification/REMOVE_REALTIME');
export const clearUnseen = createRoutine('notification/CLEAR_UNSEEN');