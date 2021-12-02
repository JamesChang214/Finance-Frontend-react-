import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Button, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as scatterActions from '../../scatter/scatterActions';
import { showErrorAlert } from '../../alerts/showAlert';

class WithdrawTrybeForm extends Component {
  state = {
    showModal: false,
    withdrawAmount: '',
  };

  togglePowerUpForm = () => {
    const { showModal } = this.state;
    this.setState({ showModal: !showModal });
  }

  onOutModal = () => {
    this.setState({ showModal: false });
  }

  onChangeInput = (event) => {
    this.setState({ withdrawAmount: event.target.value });
  }

  sendWithdraw = () => {
    const { withdrawAmount } = this.state;
    const { withdrawTrybe, acctName, onsiteBalance } = this.props;
    const { cookies } = this.props;
    parseFloat(withdrawAmount) > parseFloat(onsiteBalance) ? showErrorAlert("You are trying to withdraw more then you have.")
      : onsiteBalance - withdrawAmount < 5000 ? showErrorAlert("You can't withdraw that much, try lowering the amount.")
        : withdrawTrybe({
          token: cookies.get('trybe_jwt', { path: '/' }),
          data: {
            account: acctName,
            total: withdrawAmount,
          }
        });
  }

  render() {
    const { withdrawAmount } = this.state;
    return (
      <div className="modalFormFieldDiv">
        <Form>
          <Form.Field>
            <p>
              <b>Daily Limit: ( Minimum: 500 TRYBE | Maximum: 10,000 TRYBE )</b>
              <br />
              <b>Withdraws Are Approved Once Per Day.</b>
            </p>
            <input
              id="withdraw-button-form-input"
              type="number"
              placeholder="Amount"
              value={withdrawAmount}
              onChange={this.onChangeInput}
            />
          </Form.Field>
          <Button
            type="submit"
            onClick={() => {
              this.sendWithdraw()
            }}>Request Withdraw
          </Button>
        </Form>
      </div>
    );
  }
}

export default withCookies(connect(
  (state, ownProps) => ({
    acctName: state.user.userInfo.eosAccount,
    cookies: ownProps.cookies,
    onsiteBalance: state.trybeAccount.getIn(['trybeBalances', 'onsiteTokens'], 0),
  }), dispatch => ({
    withdrawTrybe: (token, args) => { dispatch(scatterActions.withdrawTrybeRoutine(token, args)); },
  })
)(WithdrawTrybeForm));