import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Feed } from 'semantic-ui-react';

const ChannelCustom = (props) => {
  const { data, state, onClick, active } = props;
  const lastMessageId = _.keys(state.messages).length - 1;
  return (
    <Feed.Event
      className={`channel-wrapper ${active ? 'active' : ''}`}
      onClick={onClick}
      as={Link}
      to="/chat"
    >
      <Feed.Label>
        <div className="chat-image" style={{ backgroundImage: `url(${data.channelImage})` }} />
      </Feed.Label>
      <Feed.Content>
        <Feed.Summary>
          {data.name}
        </Feed.Summary>
        <Feed.Extra text>
          {lastMessageId !== -1 ? state.messages[lastMessageId].text : ''}
        </Feed.Extra>
      </Feed.Content>
    </Feed.Event>
  );
};

export default ChannelCustom;