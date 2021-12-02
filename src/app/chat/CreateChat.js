import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from './ChatActions';
import {} from 'semantic-ui-react';

class CreateChat extends React.Component {
  render() {
    return <div className="create-chat-form">Create Chat Component</div>;
  }
}

export default withRouter(
  connect(
    state => ({
      userInfo: state.user.userInfo,
      client: state.chat.client,
      channels: state.chat.channels,
      channelsLoaded: state.chat.channelsLoaded
    }),
    dispatch => ({
      connectToChat: (params) => {
        dispatch(actions.connectToChat(params));
      },
      getChannels: (params) => {
        dispatch(actions.getChannels(params));
      }
    })
  )(CreateChat)
);
