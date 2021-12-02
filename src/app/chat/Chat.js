import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import React from 'react';
import { Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread
} from 'stream-chat-react';

import 'stream-chat-react/dist/css/index.css';
import { Dimmer, Loader, Container, Responsive } from 'semantic-ui-react';
import * as actions from './ChatActions';
import { closeSidebar } from '../sidebar/SidebarActions';
import ChannelListCustom from './ChannelListCustom';

class ChatComponent extends React.Component {
  componentDidMount = () => {
    const { getChannels, client, closeSidebarAction, userInfo } = this.props;
    if( client ) {
      getChannels({ client, userId: userInfo.id });
    }
    closeSidebarAction();
  }

  componentDidUpdate = (prevProps) => {
    const { client, getChannels, userInfo } = this.props;
    if( !prevProps.client && client) {
      getChannels({ client, userId: userInfo.id });
    }
  }

  render() {
    const { channels, channelsLoaded, client, currentChannel, loadingChannels } = this.props;
    return (
      <div className="chat-wrapper">
        { channels.length !== 0 && (
          <Chat client={client} theme="messaging light">
            <Responsive
              minWidth={Responsive.onlyTablet.maxWidth}
              as={ChannelListCustom}
              channels={channels}
            />
            { channels.length !== 0 && currentChannel && (
              <Channel channel={currentChannel}>
                <Window>
                  <ChannelHeader online={currentChannel.state.online || 1} />
                  <MessageList />
                  <MessageInput />
                </Window>
                <Thread />
              </Channel>
            )}
          </Chat>
        )}
        { channelsLoaded === false && (
          <Dimmer active>
            <Loader />
          </Dimmer>
        )}
        { (channels.length === 0 && channelsLoaded === true ) && (

          <Container textAlign="center">
            You have no chats for now. Make some friends!
            {/*<Link to="/create-chat">Create new conversation</Link>*/}
          </Container>
        )}
        { (!client && channelsLoaded === false && loadingChannels === false ) && (
          <Container textAlign="center">
            Unable to get your channels. Please try to refresh the page
          </Container>
        )}
      </div>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      userInfo: state.user.userInfo,
      client: state.chat.client,
      channels: state.chat.channels,
      channelsLoaded: state.chat.channelsLoaded,
      currentChannel: state.chat.currentChannel,
      loadingChannels: state.chat.loadingChannels
    }),
    dispatch => ({
      connectToChat: (params) => {
        dispatch( actions.connectToChat(params) );
      },
      getChannels: (params) => {
        dispatch( actions.getChannels(params) );
      },
      closeSidebarAction: () => {
        dispatch( closeSidebar());
      }
    })
  )(ChatComponent)
);