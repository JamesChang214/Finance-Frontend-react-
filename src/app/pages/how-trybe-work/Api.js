import axios from 'axios';
import catchAxiosError from '../../util/catchAxiosError';

export async function getAcfInfo() {
  const result = await axios
    .get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/pages/960077`)
    .catch(catchAxiosError);
  return result.data.acf;
}
