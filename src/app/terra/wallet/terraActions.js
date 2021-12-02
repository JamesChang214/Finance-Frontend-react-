import { createRoutine } from 'redux-saga-routines';

// creating routine
export const terraConnectRoutine = createRoutine('terra/CONNECT');
export const terraDisconnectRoutine = createRoutine('terra/DISCONNECT');
export const terraTransferRoutine = createRoutine('terra/TRANSFER');
export const terraWithdrawRoutine = createRoutine('terra/WITHDRAW');
export const terraPowerupRoutine = createRoutine('terra/POWERUP');
