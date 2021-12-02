/* eslint-disable jsx-a11y/click-events-have-key-events*/
/* eslint-disable jsx-a11y/mouse-events-have-key-events*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Form, Button } from 'semantic-ui-react';
import * as scatterActions from '../../../scatter/scatterActions';

class PowerUpButton extends Component {
  state = {
    showModal: false,
    powerUpAmount: '',
  };

  togglePowerUpForm = () => {
    const { showModal } = this.state;
    this.setState({ showModal: !showModal });
  }

  onOutModal = () => {
    this.setState({ showModal: false });
  }

  onChangeInput = (event) => {
    this.setState({ powerUpAmount: event.target.value});
  }

  sendPowerUp = () => {
    const { powerUpAmount } = this.state;
    const {powerupTrybe, walletId} = this.props;
    const { cookies } = this.props;
    powerupTrybe({
      token: cookies.get('trybe_jwt', { path: '/' }),
      data: {
        from: walletId,
        to: 'trybepayment',
        quantity: parseFloat(powerUpAmount).toFixed(0) + '.0000 TRYBE',
        memo: 'POWER UP',
      }
    });
  }

  render() {
    const { showModal, powerUpAmount } = this.state;
    const { walletId, acctName, powerupStatus } = this.props;
    return (
      <div className="power-up-button-container">
        <div
          className={powerupStatus ? 'power-up-button-container__button' : 'power-up-button-container__button_disabled'}
          onClick={powerupStatus ? this.togglePowerUpForm : ''}
        > {powerupStatus ? 'Powerup Trybe Wallet' : 'Powerups are Disabled'}
        </div>
        {showModal && (
          <div className="power-up-button-container__modal">
            <Form className="power-up-button-container__container-form" onMouseLeave={this.onOutModal}>
              <Form.Field>
                <label
                  className="power-up-button-container__container-form__label"
                  htmlFor="power-up-button-form-input">Amount
                </label>
                <input
                  id="power-up-button-form-input"
                  placeholder="Amount"
                  value={powerUpAmount}
                  onChange={this.onChangeInput}
                />
              </Form.Field>
              <Button
                disabled={!walletId || !acctName}
                type="submit"
                onClick={() => {
                  this.sendPowerUp()
                }}>Power up
              </Button>
            </Form>
          </div>)
        }
      </div>
    );
  }
}

export default withCookies(connect(
  (state, ownProps) => ({
    acctName: state.user.userInfo.id,
    walletId: state.scatter.get('account'),
    cookies: ownProps.cookies,
    powerupStatus: state.pages.getIn(['powerup_status']),
  }), dispatch => ({
    powerupTrybe: (token, args) => { dispatch(scatterActions.powerupTrybeRoutine(token, args)); },
  })
)(PowerUpButton));