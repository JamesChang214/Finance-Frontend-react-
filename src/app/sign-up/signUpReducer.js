import * as actions from './signUpActions';

const defaultState = {
  signUpStatus: 'initial',
  signUpMessage: '',
  userId: ''
};

export default function reducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case actions.signUp.TRIGGER: {
      return { ...state, signUpStatus: 'loading' };
    }
    case actions.signUp.SUCCESS: {
      const { user_id } = payload;
      return { ...state, userId: user_id, signUpStatus: 'activation_key', signUpMessage: payload.message };
    }
    case actions.signUp.FAILURE: {
      return { ...state, signUpStatus: 'initial', signUpMessage: payload.data.message };
    }
    case actions.activateUser.TRIGGER: {
      return { ...state, signUpStatus: 'loading' };
    }
    case actions.activateUser.SUCCESS: {
      return { ...state, signUpStatus: 'success' };
    }
    case actions.activateUser.FAILURE: {
      return { ...state, signUpStatus: 'activation_key' };
    }
    default:
      return state;
  }
}
