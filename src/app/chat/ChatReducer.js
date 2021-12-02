import _ from 'lodash';
import * as actions from './ChatActions';

const defaultState = {
  client: null,
  channels: [],
  connection: false,
  channelsLoaded: false,
  loadingChannels: false,
  currentChannel: null,
  page: 0
};

export default function reducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case actions.connectToChat.TRIGGER: {
      return {
        ...state,
        connection: true
      };
    }
    case actions.connectToChat.SUCCESS: {
      return {
        ...state,
        connection: false,
        client: payload
      };
    }
    case actions.connectToChat.FAILURE: {
      return {
        ...state,
        connection: false
      };
    }


    case actions.getChannels.TRIGGER: {
      let { page } = state;
      if( payload.more ) page++;
      else page = 0;
      payload.page = page;
      return {
        ...state,
        channelsLoaded: false,
        loadingChannels: true,
        page
      };
    }
    case actions.getChannels.SUCCESS: {
      let { channels } = state;
      const newChannels = payload.channels;
      channels = payload.more? _.uniq([...channels, ...newChannels]) : newChannels;
      return {
        ...state,
        channels,
        channelsLoaded: true,
        loadingChannels: false
      };
    }
    case actions.getChannels.FAILURE: {
      return {
        ...state,
        channelsLoaded: false,
        loadingChannels: false
      };
    }


    case actions.disconnect.TRIGGER: {
      return {
        ...state,
        client: null,
        channels: [],
        page: 0
      };
    }


    case actions.clearChannels.TRIGGER: {
      return {
        ...state,
        channels: [],
        channelsLoaded: false,
        page: 0
      };
    }


    case actions.changeChannel.TRIGGER: {
      return {
        ...state,
        currentChannel: payload
      };
    }


    case actions.loadTargetChannel.SUCCESS: {
      const { channels } = state;
      const { channel } = payload;
      const newChannelList = payload.fromState? channels : [channel, ...channels];
      return {
        ...state,
        currentChannel: channel,
        channels: newChannelList
      };
    }

    default:
      return state;
  }
}