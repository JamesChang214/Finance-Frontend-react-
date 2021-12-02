import axios from 'axios';

export const portfolioGetBalance = (eosAccount) => {
  return axios.get(`${process.env.REACT_APP_DAN_BACKEND}/api/wallet/getAccountBalances/${eosAccount}/all`);
};

// export const portfolioGetBalance = () => {
//   return axios.post('https://api.eosnewyork.io/v1/chain/get_table_rows', {
//     code: 'trybenetwork',
//     json: true,
//     scope: 'trybenetwork',
//     table: 'coinprices'
//   });
// };

export const portfolioGetTokenPrices = () => {
  return axios.get(`${process.env.REACT_APP_DAN_BACKEND}/api/wallet/getAllTokens `);
};
