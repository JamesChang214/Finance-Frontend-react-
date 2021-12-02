import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Divider, Header, Segment } from 'semantic-ui-react';
import * as presaleActions from '../presaleActions';
import PurchaseTrybeForm from './PurchaseTrybeForm';

class BuyTrybe extends Component {
  componentDidUpdate(prevProps) {
    const {account_name, getTrybeExchangeRate} = this.props;
    if (prevProps.account_name !== account_name && account_name!=null) {
      getTrybeExchangeRate();
    }
  }

  render() {
    const {account_name, trybeExchangeRate} = this.props;

    return (
      <Segment>
        {account_name && trybeExchangeRate ? (
          <div>
            Current Price
            <Header as="h1">1 EOS = 260 TRYBE</Header>
            <Divider />
            <PurchaseTrybeForm />
            <Divider />
            <p>The PRESALE token price is US$0.01 per Trybe, you can only buy Trybe using EOS.</p>

            <p>All pre-sale tokens are automatically staked until July 1st 2019, at which point you will have access to 10% each month for 6 months.</p>

            <p>After 6 months - all will be available.</p>

            <p>Pre-sale tokens will be eligible for airdrops.</p>
          </div>
        ) : <div>Please login to purchase trybe</div>}
      </Segment>
    );
  }
}

export default withRouter(connect(
  (state) => {
    const trybeExchangeRate = state.presale.getIn(['trybeExchangeRate', 'price']);
    const account_name = state.scatter.getIn(['account', 'name']);
    return {
      account_name, trybeExchangeRate
    };
  },
  dispatch => ({
    getTrybeExchangeRate: () => {
      dispatch(presaleActions.getTrybeExchangeRateRoutine());
    },
  })
)(BuyTrybe));