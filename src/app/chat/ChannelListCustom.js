import React, { Component } from 'react';
import { Feed, Dimmer, Loader } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ChannelCustom from './ChannelCustom';
import * as actions from './ChatActions';

class ChannelListCustom extends Component {
  onScroll = ({ target }) => {
    const { loadingChannels, getChannels, client, userInfo } = this.props;
    if (
      window.innerHeight + target.scrollTop >= target.scrollHeight
      && !loadingChannels
    ) {
      getChannels({ client, userId: userInfo.id, more: true });
    }
  }

  render() {
    const { channels, changeChannel, currentChannel, loadingChannels } = this.props;
    return (
      <Feed
        className="channel-list-wrapper"
        onScroll={this.onScroll}
      >
        {channels.map((channel) => {
          return (
            <ChannelCustom
              {...channel}
              key={channel.id}
              onClick={() => changeChannel(channel)}
              active={( currentChannel && channel.id === currentChannel.id)}
            />
          );
        })}
        { loadingChannels && (
          <Dimmer active>
            <Loader />
          </Dimmer>
        )}
      </Feed>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      channels: state.chat.channels,
      userInfo: state.user.userInfo,
      client: state.chat.client,
      currentChannel: state.chat.currentChannel,
      loadingChannels: state.chat.loadingChannels
    }),
    dispatch => ({
      changeChannel: (params) => {
        dispatch( actions.changeChannel(params) );
      },
      getChannels: (params) => {
        dispatch( actions.getChannels(params) );
      }
    })
  )(ChannelListCustom)
);