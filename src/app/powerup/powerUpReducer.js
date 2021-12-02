import * as powerUpActions from './powerUpActions';

const defaultState = {
  isLoadingInfo: false,
  isLoadingDisplayData: false,
  userInfo: null,
  userDetails: [],
  powerupOptions: []
};

export default function reducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case powerUpActions.getPowerUpData.TRIGGER: {
      return {...state, isLoadingInfo: true};
    }

    case powerUpActions.getPowerUpData.SUCCESS: {
      return {...state, isLoadingInfo: false, userInfo: {...payload}};
    }

    case powerUpActions.getPowerUpDisplayData.TRIGGER: {
      return {...state, isLoadingDisplayData: true};
    }

    case powerUpActions.getPowerUpHelperData.TRIGGER: {
      return {...state, isLoadingInfo: true};
    }

    case powerUpActions.getPowerUpHelperData.SUCCESS: {
      return {...state, isLoadingInfo: false, powerupOptions: {...payload}};
    }

    case powerUpActions.getPowerUpDisplayData.SUCCESS: {
      return {...state, isLoadingDisplayData: false, userDetails: [...payload]};
    }

    default: {
      return state;
    }
  }
}
