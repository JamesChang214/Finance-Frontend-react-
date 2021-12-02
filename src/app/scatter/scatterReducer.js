import {fromJS} from 'immutable';
import * as scatterActions from './scatterActions';


const defaultState = fromJS({
  connected: false,
  identity: null,
  connection: null,
  account: null
});

export default function reducer(state = defaultState, action) {
  const {payload} = action;

  switch (action.type) {
    case scatterActions.connectToScatterRoutine.TRIGGER: {
      return state;
    }

    case scatterActions.connectToScatterRoutine.SUCCESS: {
      const newState = state.set('connection', fromJS(payload));
      return newState;
    }

    case scatterActions.connectToScatterRoutine.FAILURE: {
      console.error('Failed to connect to scatter');
      return state;
    }

    case scatterActions.signInToScatterRoutine.TRIGGER: {
      return state;
    }

    case scatterActions.signInToScatterRoutine.SUCCESS: {
      const tempState = state.set('identity', fromJS(payload));
      const account = payload.account_name;
      console.log('account', account);
      const newState = tempState.set('account', fromJS(account));
      console.log('newstate', newState);
      return newState;
    }

    case scatterActions.signInToScatterRoutine.FAILURE: {
      return state;
    }

    case scatterActions.signOutOfScatterRoutine.TRIGGER: {
      return state;
    }

    case scatterActions.signOutOfScatterRoutine.SUCCESS: {
      const newState = fromJS({
        connected: false,
        identity: null,
        connection: null,
        account: null
      });
      return newState;
    }

    case scatterActions.signOutOfScatterRoutine.FAILURE: {
      return state;
    }

    default:
      return state;
  }
}