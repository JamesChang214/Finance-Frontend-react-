import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Divider, Image, Grid, Statistic, Segment } from 'semantic-ui-react';
import * as presaleActions from '../presaleActions';
import wallet from '../../svg/wallet.svg';
import trybeIcon from '../../svg/trybeicon.svg';

class MyPresale extends Component {
  componentDidUpdate(prevProps) {
    const {account_name, getMyPresaleBalances} = this.props;
    if (prevProps.account_name !== account_name && account_name!=null) {
      getMyPresaleBalances({account_name});
    }
  }

  render() {
    const {account_name, myPresaleTrybe} = this.props;

    return (
      <div>
        {account_name
          ? (
            <Grid>
              <Grid.Row>
                <Grid.Column width="2">
                  <Image className="wallet" src={wallet} />
                </Grid.Column>
                <Grid.Column width="12">
                  <Statistic size="tiny">
                    <Statistic.Label>
                      Your Presale Tokens
                    </Statistic.Label>
                    <Statistic.Value>
                      {myPresaleTrybe ? myPresaleTrybe : '0 TRYBE'}
                    </Statistic.Value>
                  </Statistic>
                </Grid.Column>
                <Grid.Column width="2">
                  <Image className="mypre-trybe-icon" src={trybeIcon} />
                </Grid.Column>
              </Grid.Row>
              <Divider />
              <Grid.Row>
                <Segment>
                  <div className="ref-link-label">Your referral link</div>
                  <div className="ref-link-value">https://live.wallet.trybe.one/#/home?r={account_name}</div>
                </Segment>
              </Grid.Row>
            </Grid>
          )
          : <div>Login to see your Presale Information</div>
        }
      </div>

    );
  }
}

export default withRouter(connect(
  (state) => {
    const myPresaleTrybe = state.presale.getIn(['myPresaleBalances', 'trybe_amount']);
    const account_name = state.scatter.getIn(['account', 'name']);
    return {
      account_name, myPresaleTrybe
    };
  },
  dispatch => ({
    getMyPresaleBalances: (args) => {
      dispatch(presaleActions.getMyPresaleBalancesRoutine(args));
    },
  })
)(MyPresale));