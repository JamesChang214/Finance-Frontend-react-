import { fromJS } from 'immutable';

import * as portfolioActions from './portfolioActions';

const defaultState = fromJS({
  balance: null
});

export default function reducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case portfolioActions.getBalanceRoutine.TRIGGER: {
      return state;
    }
    case portfolioActions.getBalanceRoutine.SUCCESS: {
      return state.set('balance', payload);
    }
    case portfolioActions.getBalanceRoutine.FAILURE: {
      return state;
    }
    default:
      return state;
  }
}
