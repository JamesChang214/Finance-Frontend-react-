import axios from 'axios';

export function uploadImage({ payload }) {
  const formData = new FormData();
  formData.append('file', payload.file);
  return axios.post(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/media`, formData, {
    headers: {
      Authorization: 'Bearer ' + payload.token,
      'Content-Type': 'multipart/form-data'
    }
  });
}
