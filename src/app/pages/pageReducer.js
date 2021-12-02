import { fromJS } from 'immutable';
import * as pageActions from './pageActions';

const defaultState = fromJS({

});

export default function reducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case pageActions.getPageDescriptionsRoutine.TRIGGER: {
      return state;
    }

    case pageActions.getPageDescriptionsRoutine.SUCCESS: {
      const newState = state.set('descriptions', fromJS(payload));
      return newState;
    }

    case pageActions.getPageDescriptionsRoutine.FAILURE:
      return state;

    // Weekly Payout Description
    case pageActions.weeklyPayoutRoutine.TRIGGER: {
      return state;
    }

    case pageActions.weeklyPayoutRoutine.SUCCESS: {
      const newState = state.set('weekly_payout_descriptions', fromJS(payload));
      return newState;
    }

    case pageActions.weeklyPayoutRoutine.FAILURE:
      return state;

    // Withdraw Status
    case pageActions.getWithdrawStatusRoutine.TRIGGER: {
      return state;
    }

    case pageActions.getWithdrawStatusRoutine.SUCCESS: {
      const newState = state.set('withdraw_status', fromJS(payload));
      return newState;
    }

    case pageActions.getWithdrawStatusRoutine.FAILURE:
      return state;

    // Powerup Status
    case pageActions.getPowerupStatusRoutine.TRIGGER: {
      return state;
    }

    case pageActions.getPowerupStatusRoutine.SUCCESS: {
      const newState = state.set('powerup_status', fromJS(payload));
      return newState;
    }

    case pageActions.getPowerupStatusRoutine.FAILURE:
      return state;

    case pageActions.getWitdrawsRoutine.TRIGGER: {
      return state;
    }

    case pageActions.getWitdrawsRoutine.SUCCESS: {
      const newState = state.set('withdraws', fromJS(payload));
      return newState;
    }

    case pageActions.getWitdrawsRoutine.FAILURE:
      return state;

    //Total Withdraws
    case pageActions.getTotalWithdrawsRoutine.TRIGGER: {
      return state;
    }

    case pageActions.getTotalWithdrawsRoutine.SUCCESS: {
      const newState = state.set('totalWithdraws', fromJS(payload));
      return newState;
    }

    case pageActions.getTotalWithdrawsRoutine.FAILURE:
      return state;


    case pageActions.getLinkedAccountsRoutine.TRIGGER: {
      return state;
    }

    case pageActions.getLinkedAccountsRoutine.SUCCESS: {
      const newState = state.set('linked_accounts', fromJS(payload));
      return newState;
    }

    case pageActions.getLinkedAccountsRoutine.FAILURE:
      return state;

    default:
      return state;
  }
}