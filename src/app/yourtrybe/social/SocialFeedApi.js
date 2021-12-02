import axios from 'axios';
import { streamConnect, getTimeline, getGetstreamToken } from '../../util/helperFunctions';

export const getSocialFeed = ({ userId, latestId, more }) => {
  return getGetstreamToken(userId)
    .then((getstreamToken) => {
      const user = getTimeline( streamConnect(getstreamToken), userId);

      const query = {
        limit: 10,
        enrich: true,
        reactions: {
          recent: false,
          counts: true,
          own: true
        }
      };
      //gte - greater or equal - posts BEFORE given  (created later || more recent)
      //lt - less - posts AFTER (created earlier || created much time ago)

      if(latestId) {
        if(more) query.id_lt = latestId;
        else query.id_gte = latestId;
      }
      return user.get(query);
    });
};

export const createSocialPost = (payload) => {
  return axios.post(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/post/add`, payload);
};

export const like = (payload) => {
  return axios.post(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/reaction/like`, payload);
};

export const comment = (payload) => {
  return axios.post(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/reaction/comment`, payload);
};

export const deleteReaction = (payload) => {
  return axios.delete(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/reaction`, {
    params: payload
  });
};

export const getComments = ({ userId, activityId }) => {
  return getGetstreamToken(userId)
    .then((getstreamToken) => {
      const client = streamConnect(getstreamToken);
      return client.reactions.filter({
        activity_id: activityId,
        kind: 'comment'
      });
    });
};

export function getUserHelper() {
  return axios.get(
    `https://${process.env.REACT_APP_TRYBE_WP}/wp-json/trybe/v1/user/profile/note`
  );
}