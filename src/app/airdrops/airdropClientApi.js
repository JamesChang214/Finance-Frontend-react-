import axios from 'axios';

export const clientGetAirdropLeaderBoard = () => {
  return axios.get('https://uat.wallet.trybe.one:5000/api/airdrop/airdroptop50');
};