import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Segment, Grid, Statistic, Progress, Divider, Image } from 'semantic-ui-react';
import wallet from '../../svg/wallet.svg';
import ramArt from '../../svg/ram-line-art.svg';
import cpuArt from '../../svg/cpu-line-art.svg';
import netArt from '../../svg/net-line-art.svg';
import * as presaleActions from '../presaleActions';

class PresaleProgress extends Component {
  componentDidUpdate(prevProps) {
    const {account_name, getEosBalances} = this.props;
    if (prevProps.account_name !== account_name && account_name!=null) {
      getEosBalances({account_name});
    }
  }

  render() {
    const {eosBalances, account_name} = this.props;
    console.log('eosBalances', eosBalances);
    const dataPoint = (dpImg, dpLabel, dpUnits, dpUsed, dpTotal) => {
      return (
        <Grid.Column>
          <div className="datapoint">
            <img className="icon" alt={dpLabel} src={dpImg} />
            <span className="label">
              {dpLabel}
            </span>
            <span className="value">{dpUnits(dpUsed)}</span>
          </div>
          <div>
            <Progress percent={(dpUsed/dpTotal)*100} inverted color="purple" />
          </div>
          <div className="datapoint">
            <div className="label">
              {dpUnits(dpTotal-dpUsed)} remaining
            </div>
          </div>
        </Grid.Column>
      );
    };

    return (
      <Segment>
        {eosBalances && account_name
          ? (
            <Grid>
              <Grid.Row>
                <Grid.Column width="2">
                  <Image className="wallet" src={wallet} />
                </Grid.Column>
                <Grid.Column width="12">
                  <Statistic size="tiny">
                    <Statistic.Label>
                      Liquid Balance
                    </Statistic.Label>
                    <Statistic.Value>
                      {eosBalances.core_liquid_balance}
                    </Statistic.Value>
                  </Statistic>
                </Grid.Column>
                <Grid.Column width="2">
                  <Image src="https://live.wallet.trybe.one/assets/img/2000-px-eosio-logo@2x.png" />
                </Grid.Column>
              </Grid.Row>
              <Divider />
              <Grid.Row columns={3}>
                {dataPoint(ramArt, 'RAM', formatBytes, eosBalances.ram_usage, eosBalances.ram_quota)}
                {dataPoint(cpuArt, 'CPU', formatMicroseconds, eosBalances.cpu_limit.used, eosBalances.cpu_limit.available)}
                {dataPoint(netArt, 'NET', formatBytes, eosBalances.net_limit.used, eosBalances.net_limit.available)}
              </Grid.Row>
            </Grid>
          )
          : <div>Login to see your Eos Balances</div>
        }
      </Segment>
    );
  }
}

function formatBytes(a, b) {
  if(a===0) return '0 Bytes';
  const c = 1024;
  const d = b||2;
  const e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const f = Math.floor(Math.log(a)/Math.log(c));
  return parseFloat((a/(c**f)).toFixed(d))+' ' + e[f];
}

function formatMicroseconds(a, b) {
  if(a===0) return '0 Bytes';
  const c = 1000;
  const d = b||2;
  const e = ['us', 'ms', 's'];
  const f = Math.floor(Math.log(a)/Math.log(c));
  return parseFloat((a/(c**f)).toFixed(d))+' ' + e[f];
}

export default withRouter(connect(
  (state) => {
    const eosBalances = state.presale.get('eosBalances');
    const account_name = state.scatter.getIn(['account', 'name']);
    return {
      eosBalances, account_name,
    };
  },
  dispatch => ({
    getEosBalances: (args) => {
      dispatch(presaleActions.getEosBalancesRoutine(args));
    },
  })
)(PresaleProgress));
