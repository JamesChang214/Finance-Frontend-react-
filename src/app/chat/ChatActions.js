import { createRoutine } from 'redux-saga-routines';

export const connectToChat = createRoutine('chat/CONNECT');
export const getChannels = createRoutine('chat/GET_CHANNELS');
export const disconnect = createRoutine('chat/DISCONNECT');
export const clearChannels = createRoutine('chat/CLEAR_CHANNELS');
export const changeChannel = createRoutine('chat/CHANGE_CHANNEL');
export const loadTargetChannel = createRoutine('chat/LOAD_TARGET_CHANNEL');