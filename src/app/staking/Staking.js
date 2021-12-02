/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Button, Grid, Table, Modal, Message } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { List } from 'immutable';
import ReactHtmlParser from 'react-html-parser';
import { setPageForGoogleAnalytics } from '../util/helperFunctions';
import * as trybeAccountActions from '../trybeaccount/trybeAccountActions';
import * as scatterActions from '../scatter/scatterActions';
import * as pageActions from '../pages/pageActions';
import StakeTrybeForm from './StakeTrybeForm';

class Staking extends Component {
  state = { isStakingModalOpen: false, loaded: false };

  componentDidMount() {
    setPageForGoogleAnalytics('wallet/staking');
  }

  componentWillMount() {
    const { getTrybeAccountBalances, getPageDesc, acctName, walletId } = this.props;
    getPageDesc();
    if (acctName || walletId) {
      getTrybeAccountBalances({ account_name: acctName ? acctName : walletId });
    }
  }

  componentDidUpdate() {
    const { getTrybeAccountBalances, walletId } = this.props;
    const { loaded } = this.state;
    if (walletId) {
      if (!loaded) {
        getTrybeAccountBalances({ account_name: walletId });
        this.handleLoad(true);
      }
    }
  }

  handleLoad = value => this.setState({ loaded: value })

  handleClose = () => this.setState({ isStakingModalOpen: false })

  render() {
    const { isStakingModalOpen, duration } = this.state;
    const { refundTrybe, refundStatus, unstakeTrybe, stakingDesc, walletId } = this.props;
    const my90DayStakedBalance = this.props.my90DayStakedBalance.toJS();
    const my180DayStakedBalance = this.props.my180DayStakedBalance.toJS();

    const stakedData = [];
    my90DayStakedBalance.forEach((obj) => {
      obj.type = '90 Day';
      obj.bonus = parseFloat(obj.amount.split(' ')[0]) * 0.1;
      obj.datestamp = new Date(obj.datestamp * 1000).toLocaleDateString();
      obj.refunddate = new Date(obj.refunddate * 1000).toLocaleDateString();
      stakedData.push(obj);
    });
    my180DayStakedBalance.forEach((obj) => {
      obj.type = '180 Day';
      obj.bonus = parseFloat(obj.amount.split(' ')[0]) * 0.25;
      obj.datestamp = new Date(obj.datestamp * 1000).toLocaleDateString();
      obj.refunddate = new Date(obj.refunddate * 1000).toLocaleDateString();
      stakedData.push(obj);
    });

    const renderStakes = items => items.map((item, index) => {
      return (
        // eslint-disable-next-line react/no-array-index-key
        <Table.Row key={item.datestamp + index}>
          <Table.Cell>
            {item.datestamp}
          </Table.Cell>
          <Table.Cell>
            {item.amount}
          </Table.Cell>
          <Table.Cell>
            {item.type}
          </Table.Cell>
          <Table.Cell>
            {parseFloat(item.bonus).toFixed(4) + ' TRYBE'}
          </Table.Cell>
          <Table.Cell>
            {item.refunddate}
          </Table.Cell>
          <Table.Cell>
            <Button
              disabled={!walletId}
              className="unstaking-button"
              onClick={() => {
                unstakeTrybe({
                  account_name: walletId,
                  owner: walletId,
                  from: walletId,
                  total_unstake: item.amount,
                  staking_period: item.type === '90 Day' ? 1 : 2,
                });
              }}>Unstake
            </Button>
          </Table.Cell>
        </Table.Row>
      );
    });


    const mobileRenderStakes = items => items.map((item, index) => {
      return (
        <Grid>
          <Grid key={item.datestamp + index}>
            <Grid>Date Staked<p>{item.datestamp}</p></Grid>
            <Grid>Amount<p>{item.amount}</p></Grid>
            <Grid>End Date<p>{item.refunddate}</p></Grid>
            <Grid>Length<p>90 Day</p></Grid>
            <Grid>Bonus<p>{parseFloat(item.bonus).toFixed(4) + ' TRYBE'}</p></Grid>
            <Grid><Button
              disabled={!walletId}
              className="unstaking-button"
              onClick={() => {
                unstakeTrybe({
                  account_name: walletId,
                  owner: walletId,
                  from: walletId,
                  total_unstake: item.amount,
                  staking_period: item.type === '90 Day' ? 1 : 2,
                });
              }}>Unstake
            </Button></Grid>
          </Grid>
        </Grid>
      )
    })

    return (
      <div>
        <Modal open={isStakingModalOpen} onClose={this.handleClose}>
          <Modal.Header>Stake Trybe</Modal.Header>
          <Modal.Content>
            <StakeTrybeForm duration={duration} handleClose={() => this.handleClose()} />
          </Modal.Content>
        </Modal>
        <div className="airdrop-container cz-staking">
          <h2 className="tr-block-title">Staking (legacy)</h2>
          <Message warning size="large">
            <Message.Header>Important Notice</Message.Header>
            <p>
              Remember to unstake all your Trybe for the upcoming airdrop and read more on our latest article <a style={{ fontWeight: 'bolder' }} href="https://trybe.one/loop-airdrop-and-migration-of-trybe-to-terra" target="_blank" rel="noopener noreferrer">here</a>
            </p>
          </Message>
          <Grid stackable columns={1} className="tr-stake-wrapper">
            <Grid.Column>
              <p> {ReactHtmlParser(stakingDesc)} </p>
            </Grid.Column>
            {/*
            <Grid.Column>
              <div className="tr-rounded-box tr-stake">
                <p><span>10%</span> bonus</p>
                <Button disabled className="staking-button">Disabled</Button>
              </div>
            </Grid.Column>

            <Grid.Column>
              <div className="tr-rounded-box tr-stake tr-stake--yellow">
                <p><span>25%</span> bonus</p>
                <Button disabled className="staking-button staking-button--yellow">Disabled</Button>
              </div>
            </Grid.Column>
            */}
          </Grid>

        </div>
        <div className="staking-table cz-staking-table">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Cell>Date Staked</Table.Cell>
                <Table.Cell>Amount</Table.Cell>
                <Table.Cell>Length</Table.Cell>
                <Table.Cell>Bonus</Table.Cell>
                <Table.Cell>End Date</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {renderStakes(stakedData)}
            </Table.Body>
          </Table>
          <Button
            className="refund-button refund-button--red"
            disabled={!refundStatus}
            onClick={() => {
              refundTrybe({
                account: walletId,
              });
            }}>{refundStatus ? 'Refund Available' : 'No Refunds Pending'}
          </Button>
        </div>

        <div className="staking-table cz-staking-table-mobile cz-staking-table">
          {mobileRenderStakes(stakedData)}
          <Button
            className="refund-button refund-button--red"
            disabled={!refundStatus}
            onClick={() => {
              refundTrybe({
                account: walletId,
              });
            }}>{refundStatus ? 'Refund Available' : 'No Refunds Pending'}
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(
  (state) => {
    const acctName = state.user.userInfo.eosAccount;
    const walletId = state.scatter.get('account');
    const stakingDesc = state.pages.getIn(['descriptions', 'staking']);
    const my90DayStakedBalance = state.trybeAccount.getIn(['trybeBalances', 'newStaked', 'rows', 0, 'nintydaystaked'], List());
    const my180DayStakedBalance = state.trybeAccount.getIn(['trybeBalances', 'newStaked', 'rows', 0, 'oneeightydaystaked'], List());
    const refundName = state.trybeAccount.getIn(['trybeBalances', 'refund', 'rows', 0, 'owner'], 0);

    let refundStatus;
    acctName == refundName ? refundStatus = true : refundStatus = false;
    return {
      acctName, my90DayStakedBalance, my180DayStakedBalance, refundStatus, stakingDesc, walletId
    };
  },
  dispatch => ({
    getPageDesc: () => {
      dispatch(pageActions.getPageDescriptionsRoutine());
    },
    getTrybeAccountBalances: (args) => {
      dispatch(trybeAccountActions.getTrybeAccountBalancesRoutine(args));
    },
    unstakeTrybe: (args) => {
      dispatch(scatterActions.unstakeTrybeRoutine(args));
    },
    refundTrybe: (args) => {
      dispatch(scatterActions.refundTrybeRoutine(args));
    },
  })
)(Staking));