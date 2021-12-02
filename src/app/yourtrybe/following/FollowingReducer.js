import * as actions from './FollowingActions';

const defaultState = {
  loadingSubscribe: false,
  subscriptionSuccessfull: false,
  loadingList: false,
  followers: [],
  following: [],
  loadingIndexes: {}
};

export default function reducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case actions.getFollowing.TRIGGER:
    case actions.getFollowers.TRIGGER: {
      return {
        ...state,
        loadingList: true
      };
    }
    case actions.getFollowing.SUCCESS: {
      localStorage.setItem('trybe_following', JSON.stringify(payload));
      return {
        ...state,
        loadingList: false,
        following: payload
      };
    }
    case actions.getFollowers.SUCCESS: {
      return {
        ...state,
        loadingList: false,
        followers: payload
      };
    }
    case actions.getFollowing.FAILURE:
    case actions.getFollowers.FAILURE: {
      return {
        ...state,
        loadingList: false
      };
    }

    case actions.follow.TRIGGER: {
      const { index } = payload;
      const { loadingIndexes } = state;
      if (index !== undefined) loadingIndexes[index] = true;

      return {
        ...state,
        loadingSubscribe: true,
        subscriptionSuccessfull: false,
        loadingIndexes
      };
    }
    case actions.follow.SUCCESS: {
      const { loadingIndexes } = state;
      const { index } = payload;
      if (index !== undefined) loadingIndexes[index] = null;
      return {
        ...state,
        loadingSubscribe: false,
        subscriptionSuccessfull: true
      };
    }
    case actions.follow.FAILURE: {
      const { index } = payload;
      const { loadingIndexes } = state;
      if (index !== undefined) loadingIndexes[index] = null;

      return {
        ...state,
        loadingSubscribe: false,
        subscriptionSuccessfull: false,
        loadingIndexes
      };
    }

    case actions.unfollow.TRIGGER: {
      const { index } = payload;
      const { loadingIndexes } = state;
      if (index !== undefined) loadingIndexes[index] = true;

      return {
        ...state,
        loadingSubscribe: true,
        subscriptionSuccessfull: false,
        loadingIndexes
      };
    }
    case actions.unfollow.SUCCESS: {
      const { loadingIndexes } = state;
      const { index } = payload;
      if (index !== undefined) loadingIndexes[index] = null;
      return {
        ...state,
        loadingSubscribe: false,
        subscriptionSuccessfull: true
      };
    }
    case actions.unfollow.FAILURE: {
      const { index } = payload;
      const { loadingIndexes } = state;
      if (index !== undefined) loadingIndexes[index] = null;

      return {
        ...state,
        loadingSubscribe: false,
        subscriptionSuccessfull: false,
        loadingIndexes
      };
    }

    default:
      return state;
  }
}
