import axios from 'axios';
import catchAxiosError from '../../util/catchAxiosError';

export function getAllCategories(payload) {
  return axios.get(
    `https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/categories?exclude=205&per_page=100&page=${payload}`
  );
}

export function getAllPromosData() {
  return axios.get(
    `https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/pages/1040380`
  );
}

export function addFavoriteCategory(payload) {
  const { category, token } = payload;
  return axios.post(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/category/add-category`, {
    category,
    token
  });
}

export function deleteFavoriteCategory(payload) {
  const { category, token } = payload;
  return axios.post(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/category/delete-category`, {
    category,
    token
  });
}

export async function getAcfInfo() {
  const result = await axios
    .get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/pages/1038451`)
    .catch(catchAxiosError);
  return result.data.acf;
}

