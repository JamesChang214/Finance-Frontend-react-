import axios from 'axios';
import catchAxiosError from '../../util/catchAxiosError';

export function createFriendshipRequest({ initiatorId, targetId, token }) {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/relations/add-friend`,
    { initiatorId, targetId, token },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

export function acceptFriendshipRequest({ initiatorId, targetId, token }) {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/relations/accept-friendship-request`,
    { initiatorId, targetId, token },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

export function cancelFriendshipRequest({ initiatorId, targetId, token }) {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/relations/cancel-friendship-request`,
    { initiatorId, targetId, token },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

export function rejectFriendshipRequest({ initiatorId, targetId, token }) {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/relations/reject-friendship-request`,
    { initiatorId, targetId, token },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

export function removeFriend({ initiatorId, targetId, token }) {
  // let formData = new FormData();
  // formData.append('initiator_userid', initiatorId);
  // formData.append('friend_userid', targetId);
  return axios.post(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/relations/remove-friend`, {
    initiatorId,
    targetId,
    token
  });
}

export function listFriends({ targetId, token }) {
  return axios
    .post(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/relations/list-friends`, {
      targetId,
      token
    })
    .catch(catchAxiosError);
}
export function listFriendshipRequests({ targetId, token }) {
  return axios
    .post(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/relations/list-friendship-requests`, {
      targetId,
      token
    })
    .catch(catchAxiosError);
}

export function checkFriendshipStatus({ targetId, token }) {
  return axios
    .post(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/relations/check-friendship-status`, {
      targetId,
      token
    })
    .catch(catchAxiosError);
}
