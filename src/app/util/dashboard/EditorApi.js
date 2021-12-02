import axios from 'axios';

export function createArticle({ payload }) {
  return axios.post(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/posts`, payload.data, {
    headers: {
      Authorization: 'Bearer ' + payload.token,
      'Content-Type': 'application/json'
    }
  });
}

export function deleteArticle({ payload }) {
  return axios.delete(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/posts/${payload.id}?force=true`, {
    headers: {
      Authorization: 'Bearer ' + payload.token,
      'Content-Type': 'application/json'
    }
  });
}

export function uploadFeaturedImage({ payload }) {
  const { token, file } = payload;
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/media`, formData, {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'multipart/form-data'
    }
  });
}
export function updateArticleCall({ payload }) {
  const { token, data, id } = payload;
  return axios.post(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/posts/${id} `, data, {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  });
}

export const getMentionSuggestions = (userId) => {
  return axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/user/for-mentions/${userId}`);
};
