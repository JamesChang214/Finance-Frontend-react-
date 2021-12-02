import axios from 'axios';
import { initAccessContext } from 'eos-transit';
import scatter from 'eos-transit-scatter-provider';
import meetone from 'eos-transit-meetone-provider';
import lynx from 'eos-transit-lynx-provider';
import tokenPocket from 'eos-transit-tokenpocket-provider';
import anchorlink from 'eos-transit-anchorlink-provider';
import catchAxiosError from '../util/catchAxiosError';

const accessContext = initAccessContext({
  appName: 'trybe.one',
  network: {
    host: process.env.REACT_APP_SCATTER_HOST,
    port: process.env.REACT_APP_SCATTER_PORT,
    protocol: process.env.REACT_APP_SCATTER_PROTOCOL,
    chainId: process.env.REACT_APP_SCATTER_CHAIN_ID
  },
  walletProviders: [
    scatter(),
    anchorlink("TRYBE"),
    meetone(),
    lynx(),
    tokenPocket(),
    tokenPocket(),
  ]
});

let walletapi;

export const wallet = function (value) {
  const walletType = value ? value : 0;
  walletapi = accessContext.initWallet(accessContext.getWalletProviders()[walletType]);
  return walletapi;
};

export function getScatter() {
  return accessContext.walletProviders;
}

export function* connectToScatter(data) {
  try {
    yield wallet(data);
    const connected = yield walletapi.connect();
    return connected;
  } catch (e) {
    return {isError: true};
  }
}

export function* getScatterIdentity() {
  try {
    const identity = yield walletapi.login();
    return identity;
  } catch (e) {
    return {isError: true};
  }
}

export function* linkScatter() {
  //const identity = yield getWalletIdentity();
  try {
    const linked = yield walletapi.auth.accountName;
    console.log(linked)
    return linked;
  } catch (e) {
    return {isError: true};
  }
}

export function* forgetIdentity() {
  const forgotten = yield walletapi.logout();
  return forgotten;
}

export function* createTransfer({account, to, amount, memo}) {
  const transactionOptions = { authorization: [`${walletapi.auth.accountName}@${walletapi.auth.permission}`] };
  yield walletapi.eosApi.transfer(account.name, to, amount, memo, transactionOptions);
}

// I don't think I am actually using this anymore but not deleting just to be safe
export function* claimAirdrop({account}) {
  const transactionOptions = { authorization: [`${walletapi.auth.accountName}@${walletapi.auth.permission}`] };
  yield walletapi.eosApi.transfer(account.name, transactionOptions);
}

export function* broadcastTransaction({contract, method, data}) {
  //yield connectToScatter();
  //yield linkScatter();
  try {
    //const account = yield wallet.login('account_name');
    const res = yield walletapi.eosApi
      .transact(
        {
          actions: [
            {
              account: contract,
              name: method,
              authorization: [{
                actor: walletapi.auth.accountName,
                permission: walletapi.auth.permission
              }],
              data
            }
          ]
        },
        {
          broadcast: true,
          blocksBehind: 3,
          expireSeconds: 60
        }
      );
    return res;
  } catch(e) {
    return e;
  }
}

export function* getTableRows(query) {
  return yield walletapi.eosApi.getTableRows(query);
}

export const newPowerup = ({ token, eos_account, amount, transaction_id }) => {
  return axios
    .post(
      `https://${process.env.REACT_APP_TRYBE_WP}/wp-json/trybe/v1/powerup/new`,
      { eos_account, amount, transaction_id },
      { headers: { Authorization: 'Bearer ' + token } }
    )
    .then((result) => {
      console.log(result)
    })
    .catch(catchAxiosError);
};

export const newWithdraw = ({ token, eos_account, amount, transaction_id }) => {
  return axios
    .post(
      `https://${process.env.REACT_APP_TRYBE_WP}/wp-json/trybe/v1/withdraw/new`,
      { eos_account, amount, transaction_id },
      { headers: { Authorization: 'Bearer ' + token } }
    )
    .then((result) => {
      console.log(result)
    })
    .catch(catchAxiosError);
};

export function fetchWithdrawStatus() {
  return axios.get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/wallet/v1/withdraw/status/`);
}