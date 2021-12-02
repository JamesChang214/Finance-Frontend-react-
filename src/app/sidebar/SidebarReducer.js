import * as actions from './SidebarActions';

const defaultState = {
  visible: false,
  mode: null
};

export default function reducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case actions.openSidebar.TRIGGER: {
      return {
        ...state,
        visible: true,
        mode: payload
      };
    }


    case actions.closeSidebar.TRIGGER: {
      return {
        ...state,
        visible: false,
        mode: null
      };
    }


    case actions.toggleSidebar.TRIGGER: {
      const modeChanged = state.mode !== payload;

      return {
        ...state,
        visible: modeChanged,
        mode: modeChanged ? payload : null
      };
    }

    default:
      return state;
  }
}
