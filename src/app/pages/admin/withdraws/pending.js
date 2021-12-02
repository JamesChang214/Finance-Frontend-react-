/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Button, Table, Grid, Checkbox } from 'semantic-ui-react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { List } from 'immutable';
import _ from 'underscore';
import Countdown from 'react-moment';
import { setPageForGoogleAnalytics } from '../../../util/helperFunctions';
//import * as scatterActions from '../../../scatter/scatterActions';
import * as pageActions from '../../pageActions';

class Staking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideApproved: true,
      disableDeductButton: false
    };
  }

  componentDidMount() {
    setPageForGoogleAnalytics('wallet/staking');
  }

  componentWillMount() {
    const { getWithdrawsData, getAccountsData } = this.props;
    getWithdrawsData();
    getAccountsData();
  }

  deductButton(payload) {
    const { sendSubBalance } = this.props;
    console.log(payload)
    this.setState({ disableDeductButton: true })
    sendSubBalance(payload);
  }

  approvedButton(payload) {
    const { approveWithdraw } = this.props;
    console.log(payload)
    this.setState({ disableDeductButton: false })
    approveWithdraw(payload);
  }

  handleChange = (e, { checked }) => {
    this.setState({ hideApproved: checked })
  }

  render() {
    const { hideApproved, disableDeductButton } = this.state;
    const { walletId, denyWithdraw, cookies } = this.props;
    const allWithdraws = this.props.withdrawList.sort((a, b) => { return b.date - a.date; });
    const token = cookies.get('trybe_jwt');

    const renderStakes = items => items.map((item, index) => {
      return (
        // eslint-disable-next-line react/no-array-index-key
        <Table.Row key={item.user_id + index} hidden={hideApproved ? item.approved == 1 : item.approved == 0}>
          <Table.Cell>
            {item.user_id}
          </Table.Cell>
          <Table.Cell>
            {item.account}
          </Table.Cell>
          <Table.Cell>
            {item.account_bal} / {parseFloat(item.amount)} / {item.account_bal - parseFloat(item.amount)}
          </Table.Cell>
          <Table.Cell>
            {item.approved == 1 ? 'Approved' : 'Pending'}
          </Table.Cell>
          <Table.Cell>
            <Countdown format="YYYY/MM/DD HH:mm" unix>{item.date}</Countdown>
          </Table.Cell>
          <Table.Cell>
            {item.totalWithdraws == 0 ? item.totalWithdraws + ' Withdraw' : item.totalWithdraws + ' Withdraws'}
          </Table.Cell>
          <Table.Cell>
            <Button
              disabled={item.approved || !walletId || !item.user_id || parseFloat(item.amount) >= parseFloat(item.account_bal) || disableDeductButton}
              className="deduct-button"
              onClick={() => {
                this.deductButton({
                  sub: {
                    token,
                    id: item.user_id,
                    amount: item.amount
                  },
                  endpoint: {
                    token,
                    id: item.user_id
                  }
                })
              }}>
                (1) Deduct
            </Button>
          </Table.Cell>
          <Table.Cell>
            <Button
              disabled={item.approved || !walletId || !item.user_id || parseFloat(item.amount) >= parseFloat(item.account_bal) || !disableDeductButton}
              className="approve-button"
              onClick={() => {
                this.approvedButton({
                  actions: {
                    account: item.account,
                  }
                })
              }}>(2) Send
            </Button>
          </Table.Cell>
          <Table.Cell>
            <Button
              disabled={!walletId}
              className="deny-button"
              onClick={() => {
                denyWithdraw({
                  account: item.account,
                })
              }}>Deny
            </Button>
          </Table.Cell>
          <Table.Cell>
            <Button
              disabled={!item.user_id}
              className="edit-button"
              onClick={() => { window.open(`https://old.trybe.one/wp-admin/user-edit.php?user_id=` + item.user_id) }}>User Account
            </Button>
          </Table.Cell>
        </Table.Row>
      );
    });

    return (
      <div>
        <div className="airdrop-container">
          <h2 className="tr-block-title">Withdraw Approval</h2>
          <Grid stackable columns={1} className="tr-stake-wrapper">
            <Grid.Column>
              <div className="tr-expl-item">
                <div className="tr-expl-item__count">
                  <span>1</span>
                </div>
                <p style={{ color: 'rgb(238, 161, 20)', fontSize: '18px' }}><b>Deduct Funds:</b> Before you send funds always remember to deduct the funds first. (ONLY RUN ONCE)</p>
              </div>
              <div className="tr-expl-item">
                <div className="tr-expl-item__count">
                  <span>2</span>
                </div>
                <p style={{ color: 'var(--green)', fontSize: '18px' }}><b>Send Funds:</b> Once you have deducted the funds you can then proceed with sending the funds.</p>
              </div>
              <div className="tr-expl-item">
                <div className="tr-expl-item__count">
                  <span>3</span>
                </div>
                <p style={{ color: 'var(--red)', fontSize: '18px' }}><b>Denying Withdraw:</b> just incase it is spam.</p>
              </div>
              <div className="tr-expl-item">
                <div className="tr-expl-item__count">
                  <span>4</span>
                </div>
                <p style={{ fontSize: '18px' }}><b>Edit User:</b> Click edit user to view the selected user account on the backend.</p>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className="tr-expl-item" style={{marginTop: '50px'}}>
                <p style={{ fontSize: '18px' }}>Accounts that can approve withdraws: <b>trybenetwork, johanxbeneke, thedeveloper</b></p>
              </div>
            </Grid.Column>
          </Grid>
          <div className="staking-table">
            <p>Hide Approved</p>
            <Checkbox
              toggle
              checked={hideApproved}
              onChange={this.handleChange}
              style={{ color: 'var(--text-color) !important' }} />
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Cell>User ID</Table.Cell>
                  <Table.Cell>EOS Account</Table.Cell>
                  <Table.Cell>Available/Request/Remain</Table.Cell>
                  <Table.Cell>Approval Status</Table.Cell>
                  <Table.Cell>Withdraw Date</Table.Cell>
                  <Table.Cell>Total Withdraws</Table.Cell>
                  <Table.Cell>Actions</Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {renderStakes(allWithdraws)}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

export default withCookies(connect(
  (state, ownProps) => {
    const acctName = state.user.userInfo.eosAccount;
    const walletId = state.scatter.get('account');
    const withdraws = state.pages.getIn(['withdraws', 'rows'], List()).toJS();
    const linkedAccounts = state.pages.getIn(['linked_accounts'], List()).toJS();
    const totalWithdraws = state.pages.getIn(['totalWithdraws'], List()).toJS();
    let indData;
    const withdrawList = [];
    for (let i = 0; i < withdraws.length; i++) {
      const element = withdraws[i];
      indData = _.find(linkedAccounts, (row) => { return row.eos == element.account });
      if (indData && totalWithdraws && element.account == indData.eos) {
        const userID = indData.user_id;
        const accountName = element.account;
        const accountBal = indData.tokens;
        const withdrawAmount = element.amount;
        const approvedStatus = element.approved;
        const withdrawDate = element.withdrawdate;
        const getTotalWithdraws = _.find(totalWithdraws, (row) => { return row.user_id == userID });
        const totalUserWithdraws = getTotalWithdraws ? getTotalWithdraws.withdraws : 0;
        const obj = { user_id: userID, account: accountName, account_bal: accountBal, amount: withdrawAmount, approved: approvedStatus, date: withdrawDate, totalWithdraws: totalUserWithdraws }
        withdrawList.push(obj);
      }
    }
    return {
      acctName, walletId, withdraws, withdrawList, totalWithdraws, cookies: ownProps.cookies
    };
  },
  dispatch => ({
    getWithdrawsData: () => {
      dispatch(pageActions.getWitdrawsRoutine());
    },
    getAccountsData: () => {
      dispatch(pageActions.getLinkedAccountsRoutine());
    },
    sendSubBalance: (args) => {
      dispatch(pageActions.subBalanceRoutine(args));
    },
    approveWithdraw: (args) => {
      dispatch(pageActions.getWithdrawApproveRoutine(args));
    },
    denyWithdraw: (args) => {
      dispatch(pageActions.getWithdrawDenyRoutine(args));
    },
  })
)(Staking));