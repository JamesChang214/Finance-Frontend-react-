import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Grid, Modal, Image, Header, Divider, Label } from 'semantic-ui-react';
import * as trybeAccountActions from './trybeAccountActions';
import WithdrawTrybeForm from '../pages/withdraw/WithdrawTrybeForm';
import * as scatterActions from '../scatter/scatterActions';
import * as pageActions from '../pages/pageActions';

import AirdropButton from './airdropButton/airdropButton';

import balanceImage from '../../staticAssets/images/balance-scale-right.svg';
import lampImage from '../../staticAssets/images/lamp.svg';
import moneyImage from '../../staticAssets/images/money.svg';
import coinImage from '../../staticAssets/images/coins.svg';
import walletImage from '../../staticAssets/images/wallet.svg';

class Airdrops extends Component {
  state = { isWithdrawModalOpen: false };

  componentWillMount() {
    const { getTrybeAccountBalances, getWithdrawStatus, getPowerupStatus, getPageDesc, acctName, userId, walletId } = this.props;
    getWithdrawStatus();
    getPowerupStatus();
    getPageDesc();
    if (acctName || userId || walletId) {
      getTrybeAccountBalances({ account_name: acctName ? acctName : walletId, user_id: userId });
    }
  }

  componentDidUpdate() {
    const { getTrybeAccountBalances, acctName, userId, walletId } = this.props;
    if (acctName || userId || walletId) {
      getTrybeAccountBalances({ account_name: acctName ? acctName : walletId, user_id: userId });
    }
  }

  handleClose = () => this.setState({ isWithdrawModalOpen: false })

  render() {
    const { isWithdrawModalOpen, duration } = this.state;
    const { claimwdTrybe, claimPresale, acctName } = this.props;
    const { myPresaleBalance, withdrawReady, myOnsiteBalance, myLiquidBalance, myTotalBalance,
      myOldSchoolStakedBalance, walletId, myWithdrawName, withdrawStatus } = this.props;

    return (
      <div className="airdrop-container">
        <Modal open={isWithdrawModalOpen} onClose={this.handleClose}>
          <Modal.Header>Withdraw Trybe</Modal.Header>
          <Modal.Content>
            <WithdrawTrybeForm duration={duration} handleClose={() => this.handleClose()} />
          </Modal.Content>
        </Modal>

        <div className="tr-container wallet-cz" style={{ marginBottom: "40px" }}>
          <Header as="h1">
            <Header.Content style={{ color: 'var(--text-color)' }} className="tr-block-title">
              <h1>Wallet Dashboard</h1>
              <Header.Subheader style={{ color: 'var(--text-color)', fontSize: '16px', background: 'var(--back-box-color)', padding: '10px', borderRadius: '8px' }}>
                <b>Withdraw Status:</b> {!withdrawStatus ? "Disabled" : myWithdrawName ? !withdrawReady ? "Your withdraw request is pending and will be sent upon review. May take up to 24 hours. " : "Your withdraw is ready. Please claim it now before requesting another withdraw." : "No Pending Withdraws."}
              </Header.Subheader>
            </Header.Content>
          </Header>
          <Grid columns={3} stackable className="tr-expl-wrapper cz-wrap-wallet" style={{ marginBottom: '20px' }}>
            <Grid.Column>
              <Button
                as="a"
                href="https://newdex.io/trade/trybenetwork-trybe-eos"
                target="_blank"
                className="staking-button"
                style={{ width: '100%', float: 'right', backgroundColor: '#1b1b1b', color: '#fff', borderColor: '#1b1b1b' }}
              > Buy Trybe
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                as={Link}
                to="../wallet/powerUp"
                className="staking-button"
                style={{ width: '100%', float: 'right', backgroundColor: '#1b1b1b', color: '#fff', borderColor: '#1b1b1b' }}
              > Powerup
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                disabled={!withdrawStatus || !acctName || !walletId || myOnsiteBalance <= 5000 || myWithdrawName.length > 0}
                className="staking-button"
                style={{ width: '100%', float: 'right', borderColor: '#1b1b1b', backgroundColor: '#1b1b1b', color: '#fff' }}
                onClick={() => { this.setState({ isWithdrawModalOpen: true, duration: 1 }); }}
              >
                <small>Request</small> Withdraw
              </Button>
            </Grid.Column>
            {withdrawReady !== 0 && (
              <Grid.Column>
                <Button
                  disabled={!walletId || withdrawReady === 0}
                  className="staking-button"
                  style={{ width: '100%' }}
                  onClick={() => {
                    claimwdTrybe({
                      account: walletId,
                    });
                  }}> <small>Claim</small> Withdraw
                </Button>
              </Grid.Column>
            )}
            {myPresaleBalance > 0 && (
              <Grid.Column mobile={12} tablet={3} computer={3}>
                <Button
                  disabled={myPresaleBalance == 0}
                  className="staking-button"
                  style={{ width: '100%', float: 'left' }}
                  onClick={() => {
                    claimPresale({
                      account: walletId,
                    });
                  }}
                >
                  <small>Claim</small> Presale
                </Button>
              </Grid.Column>
            )}
          </Grid>
        </div>

        <div className="tr-flex-container cz-wall-contain">
          <h2 className="tr-block-title">Account Details</h2>
        </div>
        <div className="tr-container tr-balances cz-wallet-balance">
          <Grid stackable className="tr-expl-wrapper" columns={4}>

            <Grid.Column>
              <div className="tr-rounded-box">
                <div className="tr-rounded-box--blue tr-rounded-box__icon">
                  <Image src={lampImage} />
                </div>
                <h1><small>{parseInt(myLiquidBalance)}</small></h1>
                <div className="tr-rounded-box__text">Liquid Balance</div>
              </div>
            </Grid.Column>

            <Grid.Column>
              <div className="tr-rounded-box">
                <div className="tr-rounded-box--green tr-rounded-box__icon">
                  <Image src={balanceImage} />
                </div>
                <h1><small>{parseInt(myOnsiteBalance)}</small></h1>
                <div className="tr-rounded-box__text">Trybe Wallet</div>
              </div>
            </Grid.Column>

            <Grid.Column>
              <div className="tr-rounded-box">
                <div className="tr-rounded-box--orange tr-rounded-box__icon">
                  <Image src={walletImage} />
                </div>
                <h1><small>{parseInt(myTotalBalance)}</small></h1>
                <div className="tr-rounded-box__text">Total</div>
              </div>
            </Grid.Column>

            { myOldSchoolStakedBalance > 1 && (
              <Grid.Column>
                <div className="tr-rounded-box">
                  <div className="tr-rounded-box--pink tr-rounded-box__icon">
                    <Image src={moneyImage} />
                  </div>
                  <h1><small>{parseInt(myOldSchoolStakedBalance)}</small></h1>
                  <div className="tr-rounded-box__text">Legacy <br /><small>Staked</small></div>
                </div>
              </Grid.Column>
            )}

            { myPresaleBalance > 0 && (
              <Grid.Column>
                <div className="tr-rounded-box">
                  <div className="tr-rounded-box--yellow tr-rounded-box__icon">
                    <Image src={coinImage} />
                  </div>
                  <h1><small>{parseInt(myPresaleBalance)}</small></h1>
                  <div className="tr-rounded-box__text">Presale Balance</div>
                </div>
              </Grid.Column>
            )}
          </Grid>
        </div>

        <div className="tr-flex-container cz-wall-contain">
          <h2 className="tr-block-title">Trybe Migration Tool</h2>
        </div>
        <div className="tr-container cz-wallet-fill-info">
          <Grid columns={1} stackable className="tr-expl-wrapper">
            <Grid.Column>
              <div className="tr-rounded-box">
                <p>We decided to migrate the TRYBE token and platform to the Terra blockchain. Terra is a fantastic chain with a thriving community, and (unlike EOS) is very well supported by the founding team. We’re more than sure that you’re all going to love Terra as much as we do!</p>
                <p>During August, we will be minting TRYBE tokens on the Terra blockchain, and your tokens will be sent to your Terra address.</p>
                <p>Be sure to unstake all your tokens before doing this migration.</p>

                <Divider inverted />
                <Label size="large" style={{backgroundColor: '#1c1c1c', color: '#fff'}}><b>1.)</b> Sign-out your Trybe account.</Label>
                <Label size="large" style={{backgroundColor: '#1c1c1c', color: '#fff'}}><b>2.)</b> Connect a EOS wallet.</Label>
                <Label size="large" style={{backgroundColor: '#1c1c1c', color: '#fff'}}><b>3.)</b> Enter your Terra wallet address and click migrate.</Label>

                <AirdropButton />
              </div>
            </Grid.Column>
          </Grid>
        </div>

        <div className="tr-container cz-walet-text" style={{ marginTop: '5rem' }}>
          <h2 className="tr-block-title">Trybe Wallet</h2>
          <Grid columns={2} stackable className="tr-expl-wrapper">
            <Grid.Column>
              <div className="tr-expl-item">
                <div className="tr-expl-item__count">
                  <span>1</span>
                </div>
                Welcome to the Trybe wallet. Here you will find all of your TRYBE tokens as well as a range of services that we offer to our users.
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className="tr-expl-item">
                <div className="tr-expl-item__count">
                  <span>4</span>
                </div>
                Once you have installed a Wallet, you will be able to use it to perform transactions on your EOS account within our website.
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className="tr-expl-item">
                <div className="tr-expl-item__count">
                  <span>2</span>
                </div>
                The first thing to understand is that our token (TRYBE) is built on the EOS blockchain. This means that if you wish to withdraw your tokens from our site you will need to <a href="https://eos-account-creator.com/" target="_blank" rel="noopener noreferrer">create an EOS account</a> for yourself.
                Once you have created an EOS account, please add it in your <Link to="../profile/settings">settings</Link>.
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className="tr-expl-item">
                <div className="tr-expl-item__count">
                  <span>5</span>
                </div>
                Please <a href="https://support.get-scatter.com/" target="_blank" rel="noopener noreferrer">CLICK HERE</a> to understand more about how to install Scatter and how to manage your EOS account and resources.
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className="tr-expl-item">
                <div className="tr-expl-item__count">
                  <span>3</span>
                </div>
                Once you have created an EOS account, we then recommend that you install a wallet such as Scatter, Lynx, TokenPocket or MeetOne. These wallets are designed to authenticate transactions in your EOS account. It keeps your private keys safe and only stores them within your device, as it is not safe to store them or enter them on any external website (even ours).
              </div>
            </Grid.Column>
          </Grid>
        </div>


        <div className="tr-container cz-walet-text" style={{ marginTop: '5rem' }}>
          <h2 className="tr-block-title" id="withdraw">Withdraw Trybe</h2>
          <Grid columns={2} stackable className="tr-expl-wrapper">
            <Grid.Column>
              <div className="tr-expl-item">
                <div className="tr-expl-item__count">
                  <span>1</span>
                </div>
                You must have at least 5000 tokens to request a withdrawal. The minimum withdrawal per day is 500 and the maximum is 10000.
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className="tr-expl-item">
                <div className="tr-expl-item__count">
                  <span>2</span>
                </div>
                Please note that withdrawing tokens will affect your rank, your rating power, and your ability to earn tokens on our site.  Please see our Power Up page for more details.
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className="tr-expl-item">
                <div className="tr-expl-item__count">
                  <span>3</span>
                </div>
                Withdrawals will be manually reviewed and may take up to 24 hours to process
              </div>
            </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(
  (state) => {
    const acctName = state.user.userInfo.eosAccount;
    const walletId = state.scatter.get('account');
    const userId = state.user.userInfo.id;
    const withdrawStatus = state.pages.getIn(['withdraw_status']);
    const myPresaleBalance = parseFloat(state.trybeAccount.getIn(['trybeBalances', 'presaleRows', 'rows', 0, 'amount'], 0));
    const myWithdrawName = state.trybeAccount.getIn(['trybeBalances', 'claimwdrows', 'rows', 0, 'account'], 0);
    const withdrawReady = parseFloat(state.trybeAccount.getIn(['trybeBalances', 'claimwdrows', 'rows', 0, 'approved'], 0));
    const myOnsiteBalance = parseFloat(state.trybeAccount.getIn(['trybeBalances', 'onsiteTokens'], 0));
    const myLiquidBalance = parseFloat(state.trybeAccount.getIn(['trybeBalances', 'liquidRows', 'rows', 0, 'balance'], 0));
    const my90DayStakedBalance = parseFloat(state.trybeAccount.getIn(['trybeBalances', 'newStaked', 'rows', 0, 'nintydaytotal'], 0));
    const my180DayStakedBalance = parseFloat(state.trybeAccount.getIn(['trybeBalances', 'newStaked', 'rows', 0, 'oneeightydaytotal'], 0));
    const myOldSchoolStakedBalance = parseFloat(state.trybeAccount.getIn(['trybeBalances', 'oldStaked', 'rows', 0, 'total_staked_trybe'], 0));
    console.log('liquidBalance', parseFloat(myLiquidBalance));
    const myTotalBalance = myPresaleBalance + myOnsiteBalance + myLiquidBalance + my90DayStakedBalance
      + my180DayStakedBalance + myOldSchoolStakedBalance;
    return {
      withdrawStatus,
      myPresaleBalance,
      withdrawReady,
      myWithdrawName,
      myOnsiteBalance,
      myLiquidBalance,
      acctName,
      userId,
      myTotalBalance,
      my90DayStakedBalance,
      my180DayStakedBalance,
      myOldSchoolStakedBalance,
      walletId
    };
  },
  dispatch => ({
    getWithdrawStatus: () => {
      dispatch(pageActions.getWithdrawStatusRoutine());
    },
    getPowerupStatus: () => {
      dispatch(pageActions.getPowerupStatusRoutine());
    },
    getPageDesc: () => {
      dispatch(pageActions.getPageDescriptionsRoutine());
    },
    getTrybeAccountBalances: (args) => {
      dispatch(trybeAccountActions.getTrybeAccountBalancesRoutine(args));
    },
    claimwdTrybe: (args) => {
      dispatch(scatterActions.claimwdTrybeRoutine(args));
    },
    claimPresale: (args) => {
      dispatch(scatterActions.claimPresaleRoutine(args));
    },
  })
)(Airdrops));