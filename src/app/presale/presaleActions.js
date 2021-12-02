import { createRoutine, bindRoutineToReduxForm } from 'redux-saga-routines';

// creating routine
export const getLeaderBoardRoutine = createRoutine('presale/GET_LEADER_BOARD_DATA');
export const getPresaleProgressRoutine = createRoutine('presale/GET_PRESALE_PROGRESS_DATA');
export const getEosBalancesRoutine = createRoutine('presale/GET_EOS_BALANCES');
export const clearEosBalancesRoutine = createRoutine('presale/CLEAR_EOS_BALANCES');
export const getMyPresaleBalancesRoutine = createRoutine('presale/GET_MY_PRESALE_BALANCES');
export const getTrybeExchangeRateRoutine = createRoutine('presale/GET_TRYBE_EXCHANGE_RATE');
export const clearMyPresaleBalancesRoutine = createRoutine('presale/CLEAR_MY_PRESALE_BALANCES');

export const purchaseTrybeRoutine = createRoutine('presale/PURCHASE_TRYBE');
export const purchaseTrybeHandler = bindRoutineToReduxForm(purchaseTrybeRoutine);