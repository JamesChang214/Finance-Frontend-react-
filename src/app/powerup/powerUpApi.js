import axios from 'axios';
import catchAxiosError from '../util/catchAxiosError';

export function getPowerupInfo({ payload }) {
  const { id } = payload;
  return axios
    .get(
      `https://${process.env.REACT_APP_TRYBE_WP}/wp-json/trybe/v1/powerup/stats?user_id=${id}`,
    )
    .catch(catchAxiosError);
}

export function getPowerOfDisplayDetails({ payload }) {
  const { token } = payload;
  return axios.get(
    `https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/users/displaydetails`,
    token && {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    }
  );
}

export function getPowerHelper() {
  return axios.get(
    `https://${process.env.REACT_APP_TRYBE_WP}/wp-json/trybe/v1/powerup/options`
  );
}
