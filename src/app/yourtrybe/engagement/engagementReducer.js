import * as payoutActions from './engagementActions';

const defaultState = {
  payoutStats: [],
  payoutHistory: []
};

export default function reducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case payoutActions.getPayoutData.TRIGGER: {
      return {...state};
    }

    case payoutActions.getPayoutData.SUCCESS: {
      return {...state, payoutStats: {...payload}};
    }

    case payoutActions.getPayoutHistoryRoutine.TRIGGER: {
      return {...state};
    }

    case payoutActions.getPayoutHistoryRoutine.SUCCESS: {
      return {...state, payoutHistory: {...payload}};
    }

    default: {
      return state;
    }
  }
}
