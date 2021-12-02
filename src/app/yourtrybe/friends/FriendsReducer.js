import * as actions from './FriendsActions';

const defaultState = {
  userStatus: undefined,
  loadingList: false,
  friends: [],
  requests: [],
  requestFriendshipStatus: undefined,
  friendshipsStatus: {},
  friendsCount: null,
  requestsCount: null
};

export default function reducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case actions.getRequests.TRIGGER:
    case actions.getFriends.TRIGGER: {
      return {
        ...state,
        loadingList: true
      };
    }
    case actions.getFriends.SUCCESS: {
      return {
        ...state,
        loadingList: false,
        friends: payload.friend_lists,
        friendsCount: payload.total_friends_count
      };
    }
    case actions.getRequests.SUCCESS: {
      return {
        ...state,
        loadingList: false,
        requests: payload.friendships_requests_list,
        requestsCount: payload.total_friendships_requests_count
      };
    }
    case actions.getFriends.FAILURE:
    case actions.getRequests.FAILURE: {
      return {
        ...state,
        loadingList: false
      };
    }


    case actions.requestFriendship.TRIGGER: {
      const { targetId } = payload;
      const newFriendshipsStatus = { ...state.friendshipsStatus };
      newFriendshipsStatus[targetId] = 'loading';

      return {
        ...state,
        friendshipsStatus: newFriendshipsStatus
      };
    }
    case actions.requestFriendship.SUCCESS: {
      const { targetId } = payload;
      const newFriendshipsStatus = { ...state.friendshipsStatus };
      newFriendshipsStatus[targetId] = 'Cancel Request';
      return {
        ...state,
        friendshipsStatus: newFriendshipsStatus
      };
    }
    case actions.requestFriendship.FAILURE: {
      return {
        ...state,
        requestFriendshipStatus: undefined
      };
    }


    case actions.rejectFriendshipRequest.TRIGGER: {
      const { targetId } = payload;
      const newRequests = [...state.requests];
      const userIndex = newRequests.findIndex(({ id }) => id == targetId);
      newRequests[userIndex].friendButtonLoading = true;
      return {
        ...state,
        requests: newRequests
      };
    }
    case actions.rejectFriendshipRequest.SUCCESS: {
      const { targetId } = payload;
      const newRequests = [...state.requests];
      const userIndex = newRequests.findIndex(({ id }) => id == targetId);
      newRequests.splice(userIndex, 1);
      return {
        ...state,
        requests: newRequests,
        userStatus: undefined
      };
    }
    case actions.rejectFriendshipRequest.FAILURE: {
      return {
        ...state,
        userStatus: undefined
      };
    }


    case actions.cancelFriendshipRequest.TRIGGER: {
      const { targetId } = payload;
      const newFriendshipsStatus = { ...state.friendshipsStatus };
      newFriendshipsStatus[targetId] = 'loading';

      return {
        ...state,
        friendshipsStatus: newFriendshipsStatus
      };
    }
    case actions.cancelFriendshipRequest.SUCCESS: {
      const { targetId } = payload;
      const newFriendshipsStatus = { ...state.friendshipsStatus };
      newFriendshipsStatus[targetId] = 'Add Friend';

      return {
        ...state,
        friendshipsStatus: newFriendshipsStatus
      };
    }
    case actions.cancelFriendshipRequest.FAILURE: {
      return {
        ...state,
        userStatus: undefined
      };
    }


    case actions.acceptFriendshipRequest.TRIGGER: {
      const { targetId } = payload;
      const newFriendshipsStatus = { ...state.friendshipsStatus };
      console.log('new friendship status:', newFriendshipsStatus);
      newFriendshipsStatus[targetId] = 'loading';
      const newRequests = [...state.requests];
      if( newRequests.length !== 0) {
        const userIndex = newRequests.findIndex(({ id }) => id == targetId);
        newRequests[userIndex].acceptFriendshipButtonLoading = true;
      }

      return {
        ...state,
        friendshipsStatus: newFriendshipsStatus,
        requests: newRequests
      };
    }
    case actions.acceptFriendshipRequest.SUCCESS: {
      const { targetId } = payload;
      const newFriendshipsStatus = { ...state.friendshipsStatus };
      newFriendshipsStatus[targetId] = 'Unfriendddd';
      const newRequests = [...state.requests];
      if( newRequests.length !== 0) {
        const userIndex = newRequests.findIndex(({ id }) => id == targetId);
        newRequests.splice(userIndex, 1);
      }
      return {
        ...state,
        friendshipsStatus: newFriendshipsStatus,
        requests: newRequests
      };
    }
    case actions.acceptFriendshipRequest.FAILURE: {
      return {
        ...state,
        userStatus: undefined
      };
    }


    case actions.removeFriend.TRIGGER: {
      const { targetId } = payload;
      const newFriends = [...state.friends];
      const userIndex = newFriends.findIndex(({ id }) => id == targetId);
      if (userIndex >= 0) {
        newFriends[userIndex].friendButtonLoading = true;
      }
      const newFriendshipsStatus = { ...state.friendshipsStatus };
      newFriendshipsStatus[targetId] = 'loading';
      return {
        ...state,
        friends: newFriends,
        friendshipsStatus: newFriendshipsStatus
      };
    }
    case actions.removeFriend.SUCCESS: {
      const { targetId } = payload;
      const newFriends = [...state.friends];
      const userIndex = newFriends.findIndex(({ id }) => id == targetId);
      newFriends.splice(userIndex, 1);

      const newFriendshipsStatus = { ...state.friendshipsStatus };
      newFriendshipsStatus[targetId] = 'Add Friend';
      return {
        ...state,
        friends: newFriends,
        friendshipsStatus: newFriendshipsStatus
      };
    }
    case actions.removeFriend.FAILURE: {
      return {
        ...state,
        userStatus: undefined
      };
    }


    case actions.checkFriendshipStatus.TRIGGER: {
      const { targetId } = payload;
      const newFriendshipsStatus = { ...state.friendshipsStatus };
      newFriendshipsStatus[targetId] = 'loading';
      return { ...state, friendshipsStatus: newFriendshipsStatus };
    }
    case actions.checkFriendshipStatus.SUCCESS: {
      const { targetId } = payload;
      const newFriendshipsStatus = { ...state.friendshipsStatus };
      newFriendshipsStatus[targetId] = payload['friendship status'];
      return { ...state, friendshipsStatus: newFriendshipsStatus };
    }

    default:
      return state;
  }
}
