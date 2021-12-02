import axios from 'axios';

export const getMyFollowers = ({ userId }) => {
  return axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/relations/followers/${userId}`,
    {
      params: {
        enrich: true
      }
    });
};

export const getFollowingUsers = ({ userId }) => {
  return axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/relations/following/${userId}`,
    {
      params: {
        enrich: true
      }
    });
};

export const follow = (payload) => {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/relations/follow`,
    {userId: payload.userId, targetId: payload.targetId, token: payload.token}
  );
};

export const unfollow = (payload) => {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/relations/unfollow`,
    {userId: payload.userId, targetId: payload.targetId, token: payload.token}
  );
};