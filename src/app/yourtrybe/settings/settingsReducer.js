import * as actions from './settingsActions';

const defaultState = {
  settingsUpdating: false,
  ref: '',
  setEosAccountResponse: {}
};

export default function reducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case actions.updateUser.TRIGGER:
    case actions.updateAvatar.TRIGGER:
    case actions.setEosAccount.TRIGGER: {
      return {
        ...state,
        settingsUpdating: true
      };
    }


    case actions.updateUser.SUCCESS: {
      return {
        ...state,
        settingsUpdating: false
      };
    }


    case actions.getRefId.SUCCESS: {
      const { referral_link } = payload;
      // localStorage.getItem('trybe_user_ref')
      localStorage.setItem('trybe_user_ref', referral_link);
      return { ...state, ref: referral_link };
    }


    case actions.setEosAccount.SUCCESS:
    case actions.setEosAccount.FAILURE: {
      return {
        ...state,
        settingsUpdating: false,
        setEosAccountResponse: payload
      };
    }


    case actions.cleanSetEosAccountMessage.TRIGGER: {
      return {
        ...state,
        setEosAccountResponse: {}
      };
    }


    default:
      return state;
  }
}
