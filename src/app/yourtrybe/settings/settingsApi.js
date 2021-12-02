import axios from 'axios';
import catchAxiosError from '../../util/catchAxiosError';

export const updateUser = (payload) => {
  const { token, params, id } = payload;
  return axios
    .post(
      `https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wp/v2/users/${id}`,
      params,
      {
        headers: {
          Authorization: 'Bearer' + token
        }
      }
    )
    .catch(catchAxiosError);
};

export const updateAvatar = (payload) => {
  const { file, token, user_id } = payload;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('action', 'bp_avatar_upload');
  return axios.post(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/buddypress/v1/members/${user_id}/avatar`, formData, {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'multipart/form-data'
    }
  }).catch(catchAxiosError);
};

export const getRefId = (payload) => {
  const { token, userId } = payload;
  return axios.post(
    `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/user/ref-id`,
    {
      user_id: userId,
      token
    }
  ).catch(catchAxiosError);
};
export const setEosAccount = (payload) => {
  const { userId, token, terraAccount } = payload;
  return axios.post(
    `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v2/user/update_terra`,
    {
      userId,
      token,
      terraAccount
    }
  );
};
