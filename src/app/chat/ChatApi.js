import { streamChatConnect, getChatChannels, getChatByMembers } from '../util/helperFunctions';

export const connectToChat = ({ userId }) => {
  return streamChatConnect(userId);
};

export const getChannels = ({ client, userId, page }) => {
  return getChatChannels(client, userId, page);
};

export const getChannelByMembers = ({ userId, targetId, channels }) => {
  return getChatByMembers(userId, targetId, channels);
}
