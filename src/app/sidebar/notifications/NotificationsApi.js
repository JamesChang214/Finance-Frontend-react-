import axios from 'axios';
import { streamConnect, getNotificationFeed, getGetstreamToken } from '../../util/helperFunctions';

export const getNotifications = ({ userId, markSeen }) => {
  return getGetstreamToken(userId)
    .then((getstreamToken) => {
      return getNotificationFeed( streamConnect(getstreamToken), userId).get({
        limit: 15,
        enrich: true,
        mark_seen: markSeen
      });
    });
};

export const getReadonlyToken = ({ userId }) => {
  return axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/token/readonly/${userId}`)
    .then((result) => {
      return result.data.getstreamReadonlyToken;
    });
};