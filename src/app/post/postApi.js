import axios from 'axios';
import catchAxiosError from '../util/catchAxiosError';

export function getPrerender(url) {
  return axios.post(`https://api.prerender.io/search`, {
    prerenderToken: 'tC6wrR9xZAGGXIKzSDFU',
    query: url,
    start: 0
  });
}

export function sendPrerender(url) {
  return axios.post(`https://api.prerender.io/recache`, {
    prerenderToken: 'tC6wrR9xZAGGXIKzSDFU',
    url: url
  });
}

export function getPostInfo(payload) {
  const { token, id } = payload;
  return token
    ? axios
      .get(
        `https://${
          process.env.REACT_APP_TRYBE_WP
        }/wp-json/wp/v2/posts/${id}?_embed`,
        { headers: { Authorization: 'Bearer ' + token } }
      )
      .catch(catchAxiosError)
    : axios
      .get(
        `https://${
          process.env.REACT_APP_TRYBE_WP
        }/wp-json/wp/v2/posts/${id}?_embed`
      )
      .catch(catchAxiosError);
}
export function getAuthorPost(payload) {
  const { token, author_id, post } = payload;
  return token
    ? axios
      .get(
        `https://${
          process.env.REACT_APP_TRYBE_WP
        }/wp-json/wp/v2/posts/?author=${author_id}&page=1&per_page=2&exclude=${post}&_embed`,
        { headers: { Authorization: 'Bearer ' + token } }
      )
      .catch(catchAxiosError)
    : axios
      .get(
        `https://${
          process.env.REACT_APP_TRYBE_WP
        }/wp-json/wp/v2/posts/?author=${author_id}&page=1&per_page=2&exclude=${post}&_embed`
      )
      .catch(catchAxiosError);
}
export function getPostComments(payload) {
  return axios
    .get(
      `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/post/comments?post=${payload.post}&page=${payload.page}`
    )
    .catch(catchAxiosError);
}
export function getPostInfoBySlug(payload) {
  const { id } = payload;
  return axios
    .post(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/post/get/slug`,{id})
    .catch(catchAxiosError);
}
export function getPostRating(payload) {
  const { userId, id } = payload;
  return userId
    ? axios
      .get(
        `${
          process.env.REACT_APP_BACKEND_DOMAIN
        }/api/v2/post/get-post-rating/${id}?userId=${userId}`
      )
      .catch(catchAxiosError)
    : axios
      .get(
        `${
          process.env.REACT_APP_BACKEND_DOMAIN
        }/api/v2/post/get-post-rating/${id}`
      )
      .catch(catchAxiosError);
}
export function sendPostRating(payload) {
  const { token, id, rating, authorId, userId, target } = payload;
  return axios
    .post(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/post/rate-post`, {
      token,
      id,
      rating,
      authorId,
      userId,
      target
    })
    .catch(catchAxiosError);
}
export function sendComment({ id, text, token, authorId, userId, target }) {
  return axios
    .post(
      `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/post/new-comment`,
      {
        token,
        post: id,
        content: text,
        authorId,
        userId,
        target
      },
    )
    .catch(catchAxiosError);
}
export function sendReplyToPostComment({ token, id, parent, text, authorId, userId, target, replyId }) {
  return axios
    .post(
      `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/post/new-comment-reply`,
      {
        token,
        post: id,
        content: text,
        parent,
        authorId,
        userId,
        replyId,
        target
      }
    )
    .catch(catchAxiosError);
}
