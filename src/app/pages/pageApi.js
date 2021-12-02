import axios from 'axios';

export function fetchWithdrawStatus() {
  return axios.get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wallet/v1/withdraw/status/`);
}

export function fetchPowerupStatus() {
  return axios.get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wallet/v1/powerup/status/`);
}

export function clientGetPageDescriptions() {
  return axios.get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/trybe/v1/page/descriptions`);
}

export function weeklyPayoutDescriptions() {
  return axios.get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/trybe/v1/page/descriptions/weekly_payout`);
}

export function getTotalWithdraw() {
  return axios.get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/trybe/v1/withdraw/total`);
}

export function addWithdraw(token, id) {
  return axios.post(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/trybe/v1/withdraw/add?user_id=${id}`,
    {user_id: id},
    { headers: { Authorization: 'Bearer ' + token } });
}

export function subBalance(token, id, amount) {
  return axios.post(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/trybe/v1/withdraw/approve?user_id=${id}&sub_balance=${amount}`,
    {user_id: id, sub_balance: amount},
    { headers: { Authorization: 'Bearer ' + token } });
}

export function clientGetWithdraws() {
  try {
    const withdrawTable = axios.post(`https://${process.env.REACT_APP_SCATTER_HOST}/v1/chain/get_table_rows`, {
      json: 'true',
      scope: 'trybenetwork',
      code: 'trybenetwork',
      table: 'withdraw',
      limit: -1
    });
    return withdrawTable;
  } catch (e) {
    console.error('Error retrieving presale table', e);
  }
  return ' ';
}

export function clientLinkedAccounts() {
  return axios.get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wallet/v1/all`);
}