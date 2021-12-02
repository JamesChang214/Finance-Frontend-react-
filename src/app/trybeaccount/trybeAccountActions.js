import { createRoutine } from 'redux-saga-routines';

// creating routine
export const getTrybeAccountBalancesRoutine = createRoutine('trybeAccounts/GET_TRYBE_BALANCES');
export const migrateTrybeRoutine = createRoutine('trybeAccounts/MIGRATE_TRYBE');