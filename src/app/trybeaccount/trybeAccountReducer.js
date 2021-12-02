import {fromJS} from 'immutable';
import * as trybeAccountActions from './trybeAccountActions';

const defaultState = fromJS({

});

export default function reducer(state = defaultState, action) {
  const {payload} = action;

  switch (action.type) {
    case trybeAccountActions.getTrybeAccountBalancesRoutine.TRIGGER: {
      return state;
    }

    case trybeAccountActions.getTrybeAccountBalancesRoutine.SUCCESS: {
      const newState = state.set('trybeBalances', fromJS(payload));
      return newState;
    }

    case trybeAccountActions.getTrybeAccountBalancesRoutine.FAILURE:
      return state;

    default:
      return state;
  }
}