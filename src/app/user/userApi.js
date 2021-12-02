import axios from 'axios';
import catchAxiosError from '../util/catchAxiosError';

export const postLogin = (data) => {
  return axios
    .post(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/jwt-auth/v1/token`, data.payload)
    .catch(catchAxiosError);
};

export const getUserData = (token) => {
  return axios
    .post(
      `https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/users/me?_embed`,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      }
    )
    .catch(catchAxiosError);
};

export const updateUser = (body) => {
  return axios.post(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/user`, body, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const getEosAccountName = (token) => {
  return axios
    .get(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/user/eos`, {
      params: { token }
    }).then(response => response.data);
};

export const forgotPasswordRequest = ({ email }) => {
  return axios.post(
    `https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/users/lostpassword`,
    {
      user_login: email
    }, {
      headers: { 'Content-Type': 'application/json' }
    }
  ).catch(catchAxiosError);
};

export const sendNewPassword = ({ email, newPassword, key }) => {
  return axios.post(
    `https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/users/resetpassword`,
    {
      rp_key: key,
      rp_login: email,
      new_password: newPassword
    }, {
      headers: { 'Content-Type': 'application/json' }
    }
  ).catch(catchAxiosError);
};