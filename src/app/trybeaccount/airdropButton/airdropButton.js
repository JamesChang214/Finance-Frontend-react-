/* eslint-disable jsx-a11y/click-events-have-key-events*/
/* eslint-disable jsx-a11y/mouse-events-have-key-events*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Form, Button } from 'semantic-ui-react';
import * as trybeAccountActions from '../trybeAccountActions';

class PowerUpButton extends Component {
  state = {
    showModal: false,
    terraAddress: '',
  };

  togglePowerUpForm = () => {
    const { showModal } = this.state;
    this.setState({ showModal: !showModal });
  }

  onOutModal = () => {
    this.setState({ showModal: false });
  }

  onChangeInput = (event) => {
    this.setState({ terraAddress: event.target.value});
  }

  migrateTrybe = () => {
    const { terraAddress } = this.state;
    const { walletId, trybeBalance, migrateAction} = this.props;
    //console.log(`Connected Account: ${walletId}`)
    //console.log(`Trybe Balance Address: ${parseFloat(trybeBalance).toFixed(4) + ' TRYBE'}`)
    //console.log(`Terra Address: ${terraAddress}`)
    migrateAction({
      data: {
        from: walletId,
        to: 'trybe.e',
        quantity: (parseFloat(trybeBalance).toFixed(0) - 1) + '.0000 TRYBE',
        memo: terraAddress,
      }
    });
  }

  render() {
    const { terraAddress } = this.state;
    const { acctName, walletId } = this.props;
    return (
      <div className="airdrop-button-container" style={{margin: 'auto !important'}}>
        <Form className="airdrop-button-container__container-form" onMouseLeave={this.onOutModal}>
          <Form.Field>
            <input
              disabled={!walletId || acctName}
              id="airdrop-button-form-input"
              placeholder="Terra Wallet Address"
              value={terraAddress}
              onChange={this.onChangeInput}
            />
          </Form.Field>
          <Button
            className="airdrop-button-container__button"
            disabled={terraAddress.length < 30}
            style={{display: terraAddress.length < 30 ? 'none' : 'block'}}
            type="submit"
            onClick={() => {
              this.migrateTrybe()
            }}>Migrate
          </Button>
        </Form>
        <b style={{color: 'red'}}>WARNING: MAKE SURE YOU ENTER YOUR TERRA ADDRESS, IF YOU ENTER THE WRONG ADDRESS YOUR FUNDS WILL BE LOST.</b>
      </div>
    );
  }
}

export default withCookies(connect(
  (state, ownProps) => ({
    acctName: state.user.userInfo.id,
    walletId: state.scatter.get('account'),
    cookies: ownProps.cookies,
    trybeBalance: parseFloat(state.trybeAccount.getIn(['trybeBalances', 'liquidRows', 'rows', 0, 'balance'], 0)),
  }), dispatch => ({
    migrateAction: (args) => {
      dispatch(trybeAccountActions.migrateTrybeRoutine(args));
    },
  })
)(PowerUpButton));