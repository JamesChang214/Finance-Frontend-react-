import { createRoutine } from 'redux-saga-routines';

// creating routine
export const getPageDescriptionsRoutine = createRoutine('pageActions/GET_PAGE_DESCRIPTIONS');
export const weeklyPayoutRoutine = createRoutine('pageActions/WEEKLY_DESCRIPTIONS');

export const getWithdrawStatusRoutine = createRoutine('pageActions/GET_WITHDRAW_STATUS');
export const getPowerupStatusRoutine = createRoutine('pageActions/GET_POWERUP_STATUS');
export const getWitdrawsRoutine = createRoutine('pageActions/GET_WITHDRAWS');

export const getLinkedAccountsRoutine = createRoutine('pageActions/GET_LINKED');
export const getTotalWithdrawsRoutine = createRoutine('pageActions/GET_TOTAL_WITHDRAWS');
//Withdraw Routines
export const subBalanceRoutine = createRoutine('pageActions/SUB_WITHDRAW');
export const getWithdrawApproveRoutine = createRoutine('pageActions/APPROVE_WITHDRAW');
export const getWithdrawDenyRoutine = createRoutine('pageActions/DENY_WITHDRAW');