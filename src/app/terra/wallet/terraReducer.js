import {fromJS} from 'immutable';
import * as terraActions from './terraActions';


const defaultState = fromJS({
  connected: false,
  identity: null,
  connection: null,
  account: null
});

export default function reducer(state = defaultState, action) {
  const {payload} = action;

  switch (action.type) {
    case terraActions.terraConnectRoutine.TRIGGER: {
      return state;
    }

    case terraActions.terraConnectRoutine.SUCCESS: {
      const newState = state.set('connection', fromJS(payload));
      return newState;
    }

    case terraActions.terraConnectRoutine.FAILURE: {
      console.error('Failed to connect to scatter');
      return state;
    }

    default:
      return state;
  }
}