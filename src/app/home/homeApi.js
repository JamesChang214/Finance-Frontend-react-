import axios from 'axios';
import catchAxiosError from '../util/catchAxiosError';

export async function getAcfInfo() {
  const result = await axios
    .get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/pages/880696`)
    .catch(catchAxiosError);
  return result.data.acf;
}

export async function getAuthors() {
  const result = await axios
    .get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/pages/1038451`)
    .catch(catchAxiosError);
  return result.data.acf;
}