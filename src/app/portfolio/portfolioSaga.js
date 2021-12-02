import { put, takeEvery } from 'redux-saga/effects';

import { portfolioGetBalance, portfolioGetTokenPrices } from './portfolioClientApi';
import * as portfolioActions from './portfolioActions';
import percentageHelper from './helpers/percentageHelper';

export const portfolioWatchers = [getBalance];

export function* getBalance() {
  yield takeEvery(portfolioActions.getBalanceRoutine.TRIGGER, getPortfolioBalance);
}

function* getPortfolioBalance({ payload }) {
  const balanceResponse = yield portfolioGetBalance(payload);
  const pricesResponse = yield portfolioGetTokenPrices();

  if(balanceResponse.data && balanceResponse.data.length > 0 && (
    pricesResponse && pricesResponse.data && pricesResponse.data.length > 0
  )) {
    yield put(portfolioActions.getBalanceRoutine.success(percentageHelper(pricesResponse.data, balanceResponse.data)));
  } else {
    yield put(portfolioActions.getBalanceRoutine.failure(balanceResponse));
  }
}
