import { createRoutine, bindRoutineToReduxForm } from 'redux-saga-routines';

// creating routine
export const connectToScatterRoutine = createRoutine('scatter/CONNECT');
export const signInToScatterRoutine = createRoutine('scatter/SIGN_IN');
export const signOutOfScatterRoutine = createRoutine('scatter/SIGN_OUT');
export const unstakeTrybeRoutine = createRoutine('scatter/UNSTAKE_TRYBE');
export const claimwdTrybeRoutine = createRoutine('scatter/CLAIMWD_TRYBE');
export const powerupTrybeRoutine = createRoutine('scatter/POWERUP_TRYBE');
export const refundTrybeRoutine = createRoutine('scatter/REFUND_TRYBE');

// claim presale funds
export const claimPresaleRoutine = createRoutine('scatter/CLAIM_PRESALE');

export const stakeTrybeRoutine = createRoutine('scatter/STAKE_TRYBE');
export const stakeTrybeFormHandler = bindRoutineToReduxForm(stakeTrybeRoutine);

export const withdrawTrybeRoutine = createRoutine('scatter/WITHDRAW_TRYBE');
export const withdrawTrybeFormHandler = bindRoutineToReduxForm(withdrawTrybeRoutine);
