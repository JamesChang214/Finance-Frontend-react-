import {fromJS} from 'immutable';
import * as presaleActions from './presaleActions';

const defaultState = fromJS({
  leaderboard: {
    topTenCurrentMonth: [],
    topTwentyAllTime: [],
    lastMonthsWinners: []
  },
  presaleProgress: {
    totalSold: null
  }
});

export default function reducer(state = defaultState, action) {
  const {payload} = action;

  switch (action.type) {
    case presaleActions.getLeaderBoardRoutine.TRIGGER: {
      return state;
    }

    case presaleActions.getLeaderBoardRoutine.SUCCESS: {
      const newState = state.set('leaderBoard', payload);
      return newState;
    }
    case presaleActions.getLeaderBoardRoutine.FAILURE:
      return state;

    case presaleActions.getPresaleProgressRoutine.TRIGGER: {
      return state;
    }

    case presaleActions.getPresaleProgressRoutine.SUCCESS: {
      const newState = state.set('presaleProgress', payload);
      return newState;
    }

    case presaleActions.getPresaleProgressRoutine.FAILURE:
      return state;

    case presaleActions.getEosBalancesRoutine.TRIGGER: {
      return state;
    }

    case presaleActions.getEosBalancesRoutine.SUCCESS: {
      const newState = state.set('eosBalances', payload);
      return newState;
    }

    case presaleActions.clearEosBalancesRoutine.TRIGGER: {
      const newState = state.set('eosBalances', null);
      return newState;
    }

    case presaleActions.getEosBalancesRoutine.FAILURE:
      return state;

    case presaleActions.getMyPresaleBalancesRoutine.TRIGGER: {
      return state;
    }

    case presaleActions.getMyPresaleBalancesRoutine.SUCCESS: {
      const newState = state.set('myPresaleBalances', fromJS(payload));
      return newState;
    }

    case presaleActions.getMyPresaleBalancesRoutine.FAILURE: {
      return state;
    }

    case presaleActions.clearMyPresaleBalancesRoutine.TRIGGER: {
      const newState = state.set('myPresaleBalances', null);
      return newState;
    }

    case presaleActions.getTrybeExchangeRateRoutine.SUCCESS: {
      const newState = state.set('trybeExchangeRate', fromJS(payload));
      return newState;
    }

    default:
      return state;
  }
}