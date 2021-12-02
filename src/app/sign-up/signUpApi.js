import axios from 'axios';
import catchAxiosError from '../util/catchAxiosError';

export function signUp(params) {
  return axios
    .post(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/users/signup`, params)
    .catch(catchAxiosError);
}

export function activateUser(params) {
  return axios
    .post(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/users/activateuser`, params)
    .catch(catchAxiosError);
}
