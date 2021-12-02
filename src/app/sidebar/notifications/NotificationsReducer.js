import * as actions from './NotificationsActions';

const defaultState = {
  notifications: [],
  loading: false,
  subscribed: false,
  newNotification: false,
  realtimeDeleted: false,
  realtime: [],
  unseen: []
};

export default function reducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case actions.getNotifications.TRIGGER: {
      return {
        ...state,
        loading: true
      };
    }
    case actions.getNotifications.SUCCESS: {
      let unseen;
      if (payload.markSeen === false) {
        unseen = payload.notifications.filter(not => not.is_seen === false);
        unseen = unseen.map(not => not.group.reference);
      } else {
        unseen = [];
      }

      return {
        ...state,
        notifications: payload.notifications,
        unseen,
        loading: false
      };
    }
    case actions.getNotifications.FAILURE: {
      return {
        ...state,
        loading: false
      };
    }

    case actions.subscribeOnRealtimeNotifications.TRIGGER:
    case actions.subscribeOnRealtimeNotifications.FAILURE: {
      return {
        subscribed: false
      };
    }
    case actions.subscribeOnRealtimeNotifications.SUCCESS: {
      return {
        subscribed: true
      };
    }

    case actions.newNotification.TRIGGER: {
      return {
        ...state,
        realtime: [...state.realtime, payload[0]],
        unseen: [...state.unseen, payload[0].group],
        newNotification: true
      };
    }
    case actions.newNotification.SUCCESS:
    case actions.newNotification.FAILURE: {
      return {
        ...state,
        newNotification: false
      };
    }

    case actions.removeRealtimeNotification.TRIGGER: {
      return {
        ...state,
        realtime: state.realtime.filter(not => not.id !== payload),
        realtimeDeleted: true
      };
    }
    case actions.removeRealtimeNotification.SUCCESS:
    case actions.removeRealtimeNotification.FAILURE: {
      return {
        ...state,
        realtimeDeleted: false
      };
    }

    case actions.clearUnseen.TRIGGER: {
      return {
        ...state,
        unseen: []
      };
    }

    default:
      return state;
  }
}
