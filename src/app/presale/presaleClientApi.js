import axios from 'axios';

export const clientGetLeaderBoard = () => {
  return axios.get('https://uat.wallet.trybe.one:5000/api/presale/getleaderboarddata');
};

export const clientGetPresaleProgress = () => {
  return axios.get('https://uat.wallet.trybe.one:5000/api/presale/getpresaleprogress');
};

export const clientGetEosBalances = (args) => {
  return axios.post(`https://${process.env.REACT_APP_SCATTER_HOST}/v1/chain/get_account`, args);
};

export const clientGetMyPresaleBalances = ({account_name}) => {
  return axios.post(`https://${process.env.REACT_APP_SCATTER_HOST}/v1/chain/get_table_rows`, {
    json: 'true',
    scope: 'trybepresale',
    code: 'trybepresale',
    table: 'trybepresale',
    lower_bound: account_name,
    upper_bound: account_name,
    limit: 1
  });
};

export const clientGetTrybeExchangeRate = () => {
  return axios.post(`https://${process.env.REACT_APP_SCATTER_HOST}/v1/chain/get_table_rows`, {
    code: 'trybenetwork',
    json: true,
    scope: 'trybenetwork',
    table: 'coinprices'
  });
};

export const clientIsForbiddenLand = async () => {
  const ipResp = await axios.get('https://get.geojs.io/v1/ip.json');
  const countryResp = await axios.get(`https://get.geojs.io/v1/ip/country/${ipResp.ip}.json`);
  return countryResp.country==='US';
}