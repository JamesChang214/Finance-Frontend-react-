import axios from 'axios';

export function getPayoutStats({ payload }) {
  const { token } = payload;
  return axios.get(
    `https://${process.env.REACT_APP_TRYBE_WP}/wp-json/trybe/v1/payout/stats`,
    token && {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    }
  );
}


export function getPayoutHistory({ payload }) {
  const { token } = payload;
  return axios.get(
    `https://${process.env.REACT_APP_TRYBE_WP}/wp-json/trybe/v1/payout/history`,
    token && {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    }
  );
}