import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './ChatActions';
import ChannelListCustom from './ChannelListCustom';

class SidebarChat extends Component {
  render() {
    const { client, channels, loadingChannels } = this.props;

    if( !client ) return (
      <div>Connection to chat ...</div>
    );

    if( channels.length === 0 && loadingChannels) return (
      <div>Loading channels</div>
    );

    if( client && channels.length === 0 && !loadingChannels) return (
      <div>There are no any chats. Make some friends!</div>
    );

    return (
      <ChannelListCustom channels={channels} />
    );
  }
}

export default withRouter(
  connect(
    state => ({
      channels: state.chat.channels,
      channelsLoaded: state.chat.channelsLoaded,
      loadingChannels: state.chat.loadingChannels,
      userInfo: state.user.userInfo,
      client: state.chat.client,
    }),
    dispatch => ({
      connectToChat: (params) => {
        dispatch(actions.connectToChat(params));
      }
    })
  )(SidebarChat)
);