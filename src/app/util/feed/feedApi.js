import axios from 'axios';
import catchAxiosError from '../catchAxiosError';

export function getPostsCall({ payload }) {
  const { token } = payload;
  const { page, queryParams } = payload.params;
  return axios
    .post(
      `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/post/feed`,
      {
        page, queryParams, token
      },
    )
    .catch(catchAxiosError);
}
export function getAuthorInfo(id) {
  return axios.get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/users/${id}`);
}
export function getComments(postId) {
  return axios.get(
    `https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/comments?post=${postId}`
  );
}
