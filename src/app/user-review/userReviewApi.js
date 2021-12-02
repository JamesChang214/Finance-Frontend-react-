import axios from 'axios';

export function getUserData({ id, token }) {
  return token
    ? axios.get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/users/${id}?_embed`, {
      headers: {
        Authorization: 'Bearer' + token,
        'Content-Type': 'application/json'
      }
    })
    : axios.get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/users/${id}?_embed`);
}

export function updateUserViews({ id }) {
  return axios.post(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/users/views/?id=${id}`);
}

export function getUsersData(ids) {
  if (ids.length === 1) return getUserData(ids[0]);
  return axios.get(
    `https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/users?include=${ids.join(',')}&_embed`
  );
}

export const amIFollowing = (userId, targetId) => {
  return axios
    .get(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/relations/is/${userId}/following/${targetId}`)
    .then(response => response.data);
};
