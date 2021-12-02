import stream from 'getstream';
import { StreamChat } from 'stream-chat';
import axios from 'axios';
import ReactGA from 'react-ga';

const KEY = 'nbdfauwm6ek3';
const APPID = '43935';
const CHAT_NAME_PREFIX = 'private';

export const streamConnect = (userToken) => {
  const client = stream.connect(KEY, userToken, APPID);
  return client;
};
export const streamConnectById = (userId) => {
  return getGetstreamToken(userId).then((getstreamToken) => {
    return streamConnect(getstreamToken);
  });
};

export const getTimeline = (client, userId) => {
  return client.feed('timeline', userId);
};
export const getUserFeed = (client, userId) => {
  return client.feed('user', userId);
};
export const getNotificationFeed = (client, userId) => {
  return client.feed('notification', userId);
};
export const getGetstreamToken = (userId) => {
  return axios
    .get(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/token/${userId}`)
    .then(response => response.data.getstreamToken);
};
export const getUserById = (userId) => {
  return axios
    .get(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/user/${userId}`)
    .then(response => response.data);
};

export const streamChatConnect = (userId) => {
  const client = new StreamChat(KEY);

  return Promise.all([getGetstreamToken(userId), getUserById(userId)]).then(
    ([getstreamToken, userData]) => {
      client.setUser(
        {
          id: userId.toString(),
          name: userData.name,
          image: userData.avatarUrl
        },
        getstreamToken
      );

      return client;
    }
  );
};

export const getChatChannels = async (client, userId, page) => {
  const filters = {
    members: { $in: [userId.toString()] },
    trybePrivateMessagingChat: true
  };
  const sort = { last_message_at: -1 };
  const result = await client.queryChannels(filters, sort, {
    limit: 10,
    offset: page*10
  });
  return result.map( channel => setChannelAvatar(userId, channel) );
};

export const amIFollowing = (id, following) => {
  for (let i = 0; i < following.length; i++) {
    if (following[i].person.id == id) return true;
  }
  return false;
};

/**
 * Finds the chat id between current user and target user
 * @param {String} targetId
 * @param {String} userId
 */
export const getChatFromState = (chat1, chat2, channels) => {
  for( let i = 0; i < channels.length; i++) {
    if( channels[i].id === chat1 || channels[i].id === chat2 ) {
      return channels[i];
    }
  }
  return null;
};

/**
 *
 * @param {String} userId - current user
 * @param {*} channel - object of the chat
 */
const setChannelAvatar = (userId, channel) => {
  const creatorId = channel.id.split('-')[1];
  channel.data.channelImage = (userId == creatorId ) ? channel.state.members.undefined.user.image : channel.data.created_by.image;
  return channel;
};

export const getChannelById = async (id, chatClient) => {
  const filter = { id };
  const sort = { last_message_at: -1 };

  const channels = await chatClient.queryChannels(filter, sort, {
    state: true
  });
  if(channels.length > 1) throw new Error('Warning! Found two channels!');
  return channels.length !== 0 ? channels[0] : null;
};

export const getChatByMembers = async (userId, targetId, channels) => {
  const chat1 = `${CHAT_NAME_PREFIX}-${userId}-${targetId}`;
  const chat2 = `${CHAT_NAME_PREFIX}-${targetId}-${userId}`;
  let con = getChatFromState(chat1, chat2, channels);
  let fromState = true;
  if( !con) {
    const chatClient = await streamChatConnect(userId);
    con = await getChannelById(chat1, chatClient);
    if( !con) con = await getChannelById(chat2, chatClient);
    if(con) fromState = false;
  }
  return {
    channel: con,
    fromState
  };
};

export const setPageForGoogleAnalytics = (pageName) => {
  ReactGA.pageview(`/${pageName}`);
};