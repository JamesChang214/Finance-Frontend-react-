import axios from 'axios';
import catchAxiosError from '../../util/catchAxiosError';

export async function getAcfInfo() {
  const result = await axios
    .get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/pages/1031244`)
    .catch(catchAxiosError);
  return result.data.acf;
}

export async function getCategoryId(payload) {
  const result = await axios
    .get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/categories?slug=${payload}`)
    .catch(catchAxiosError);
  return result.data[0]?.id;
}
