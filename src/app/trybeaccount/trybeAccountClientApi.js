import axios from 'axios';

export function* clientGetTrybeAccountBalances({account_name, user_id}) {
  const resultObj = {};

  if (user_id) {
    try {
      const onsiteResponse = yield axios.get(`https://old.trybe.one/wp-json/wallet/v1/?id=${user_id}`);
      if(onsiteResponse.data.tokens) {
        resultObj.onsiteTokens = onsiteResponse.data.tokens;
      }
    } catch(e) {
      console.error('Error retrieving on site', e);
    }
  }

  if (account_name) {
    try {
      const tmpPresaleStaked = yield axios.post(`https://${process.env.REACT_APP_SCATTER_HOST}/v1/chain/get_table_rows`, {
        json: 'true',
        scope: 'trybenetwork',
        code: 'trybenetwork',
        table: 'trybepresale',
        lower_bound: account_name,
        upper_bound: account_name,
        limit: 1
      });
      resultObj.presaleRows = tmpPresaleStaked.data;
    } catch(e) {
      console.error('Error retrieving presale', e);
    }

    try {
      const tmpPresaleTable = yield axios.post(`https://${process.env.REACT_APP_SCATTER_HOST}/v1/chain/get_table_rows`, {
        json: 'true',
        scope: 'trybenetwork',
        code: 'trybenetwork',
        table: 'trybepresale',
        lower_bound: account_name,
        upper_bound: account_name,
        limit: 1
      });
      resultObj.newPresaleRows = tmpPresaleTable.data;
    } catch(e) {
      console.error('Error retrieving presale table', e);
    }

    try {
      const claimwdStatus = yield axios.post(`https://${process.env.REACT_APP_SCATTER_HOST}/v1/chain/get_table_rows`, {
        json: 'true',
        scope: 'trybenetwork',
        code: 'trybenetwork',
        table: 'withdraw',
        lower_bound: account_name,
        upper_bound: account_name,
        limit: 1
      });
      resultObj.claimwdrows = claimwdStatus.data;
    } catch(e) {
      console.error('Error retrieving withdraw status', e);
    }

    try {
      const tmpLiquidStaked = yield axios.post(`https://${process.env.REACT_APP_SCATTER_HOST}/v1/chain/get_table_rows`, {
        json: 'true',
        scope: account_name,
        code: 'trybenetwork',
        table: 'accounts',
      });
      resultObj.liquidRows = tmpLiquidStaked.data;
    } catch(e) {
      console.error('Error retrieving liquid', e);
    }

    try {
      const tmpOldStaked = yield axios.post(`https://${process.env.REACT_APP_SCATTER_HOST}/v1/chain/get_table_rows`, {
        json: 'true',
        scope: account_name,
        code: 'trybenetwork',
        table: 'trybestaked',
        lower_bound: account_name,
        upper_bound: account_name,
        limit: 1
      });
      resultObj.oldStaked = tmpOldStaked.data;
    } catch(e) {
      console.error('Error retrieving old staked', e);
    }

    try {
      const tmpNewStaked = yield axios.post(`https://${process.env.REACT_APP_SCATTER_HOST}/v1/chain/get_table_rows`, {
        json: 'true',
        scope: account_name,
        code: 'trybenetwork',
        table: 'stake',
        lower_bound: account_name,
        upper_bound: account_name,
        limit: 1
      });
      resultObj.newStaked = tmpNewStaked.data;
    } catch(e) {
      console.error('Error retrieving new staked', e);
    }

    try {
      const refundStatus = yield axios.post(`https://${process.env.REACT_APP_SCATTER_HOST}/v1/chain/get_table_rows`, {
        json: 'true',
        scope: account_name,
        code: 'trybenetwork',
        table: 'refunds',
        lower_bound: account_name,
        upper_bound: account_name,
        limit: 1
      });
      resultObj.refund = refundStatus.data;
    } catch(e) {
      console.error('Error retrieving old staked', e);
    }
  }

  return resultObj;
}