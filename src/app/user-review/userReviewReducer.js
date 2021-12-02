import * as actions from './userReviewActions';

const defaultState = {
  loading: false,
  userInfo: {},
  amIFollowing: false
};

export default function reducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case actions.getUserData.TRIGGER: {
      return { ...state, loading: true };
    }
    case actions.getUserData.SUCCESS: {
      localStorage.setItem('trybe_user_review', JSON.stringify(payload));
      return { ...state, userInfo: payload, loading: false };
    }
    case actions.getUserData.FAILURE: {
      return { ...state, loading: false };
    }

    case actions.setUserData.TRIGGER: {
      return { ...state, userInfo: payload };
    }
    case actions.clearUserData.TRIGGER: {
      return { ...state, userInfo: {} };
    }

    case actions.amIFollowing.TRIGGER: {
      return { ...state, amIFollowing: false };
    }
    case actions.amIFollowing.SUCCESS: {
      return { ...state, amIFollowing: payload };
    }
    default:
      return state;
  }
}
