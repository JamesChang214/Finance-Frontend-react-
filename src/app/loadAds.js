import axios from 'axios';
import catchAxiosError from './util/catchAxiosError';

export async function getAcfInfo() {
  const result = await axios
    .get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/trybe/v1/ads/frontend`)
    .catch(catchAxiosError);
  return result.data;
}
