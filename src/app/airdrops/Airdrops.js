import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Table, Button } from 'semantic-ui-react';
import _ from 'underscore';
import ReactHtmlParser from 'react-html-parser';
import { setPageForGoogleAnalytics } from '../util/helperFunctions';
//import AirdropCountdown from './components/AirdropCountdown';
import * as airdropActions from './airdropActions';
import * as pageActions from '../pages/pageActions';

class Airdrops extends Component {
  componentDidMount() {
    setPageForGoogleAnalytics('wallet/airdrops');
    const { getAirdropLeaderBoard, getPageDesc } = this.props;
    getPageDesc();
    getAirdropLeaderBoard();
  }

  render() {
    const { claimAirdrop, airdorpDesc, airdropTop50, indData, myAirdrop, walletId, claimStatus, claimError } = this.props;

    const renderTopFiftyRows = items => items.map((item, index) => {
      return (
        index < 50
          ? (
            <Table.Row key={item.account}>
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell>{item.account}</Table.Cell>
              <Table.Cell>{formatThousands(item.totalStaked)}</Table.Cell>
              <Table.Cell>{formatThousands(item.bonus)}</Table.Cell>
            </Table.Row>
          ) : null
      );
    });

    const formatThousands = (input, args) => {
      const suffixes = ['k', 'M', 'B', 'T', 'P', 'E'];
      if (Number.isNaN(input)) {
        return 0;
      }
      if (input < 1000) {
        return parseFloat(input).toFixed(2);
      }
      const exp = Math.floor(Math.log(input) / Math.log(1000));
      return (input / (1000 ** exp)).toFixed(args) + suffixes[exp - 1];
    };

    return (
      <div>
        <div className="airdrop-container">
          <h2 className="tr-block-title">Airdrop Rewards</h2>
          <Grid stackable columns="equal" className="tr-stake-wrapper">
            <Grid.Column width={8}>
              <p>{ReactHtmlParser(airdorpDesc)}</p>
            </Grid.Column>
            <Grid.Column width={8}>
              <div className="tr-rounded-box tr-airdrop-countdown-wrap tr-flex-center">
                <h1>AIRDROP ENDED</h1>
              </div>
            </Grid.Column>
            <Grid.Column width={8}>
              {indData && (
                <div className="tr-info-card" style={{ width: '100%' }}>
                  <div>
                    <div className="tr-info-card__row tr-info-card__header">
                      <div className="tr-info-card__label">Current Round</div>
                      <div className="tr-info-card__value"><Button disabled={!walletId} onClick={() => claimAirdrop(walletId)}>Claim Now</Button></div>
                    </div>
                    <div className="tr-info-card__row">
                      <div className="tr-info-card__label">Eligible TRYBE:</div>
                      <div className="tr-info-card__value">{parseInt(indData.totalStaked)}</div>
                    </div>
                    <div className="tr-info-card__row">
                      <div className="tr-info-card__label">Expected Airdrop Amount:</div>
                      <div className="tr-info-card__value">{parseInt(myAirdrop)}</div>
                    </div>
                    {indData.bonus && (
                      <div>
                        <div className="tr-info-card__row">
                          <div className="tr-info-card__label">Expected Airdrop Bonus:</div>
                          <div className="tr-info-card__value">{indData.bonus}</div>
                        </div>
                        <div className="tr-info-card__row">
                          <div className="tr-info-card__label">Total Expected:</div>
                          <div className="tr-info-card__value">{parseInt(myAirdrop + indData.bonus)}</div>
                        </div>
                      </div>
                    )}
                    <div className="tr-info-card__row tr-info-card__info">
                      <div className="tr-info-card__label">Claimed airdrops will be staked for 180 days automatically.</div>
                    </div>
                    {claimStatus && <div className="tr-info-card__status">{claimStatus}</div>}
                    {claimError && <div className="tr-info-card__status tr-info-card__error">{claimError}</div>}
                  </div>
                </div>
              )}
            </Grid.Column>
          </Grid>

          <div className="tr-airdrop-tables-header">
            <h2 className="tr-block-title">Airdrop Bonuses</h2>
            <p>Airdrop bonuses will be automatically included in your total when you claim your airdrop above.</p>
          </div>

          <Grid stackable columns={2} className="tr-airdrop-tables-wrapper tr-stake-wrapper">
            <Grid.Column>
              <div className="staking-table">
                <Table inverted>
                  <Table.Header>
                    <Table.Row>
                      <Table.Cell>Rank</Table.Cell>
                      <Table.Cell>Account</Table.Cell>
                      <Table.Cell>Eligible TRYBE</Table.Cell>
                      <Table.Cell>Bonus</Table.Cell>
                    </Table.Row>
                  </Table.Header>
                  {airdropTop50
                    && (
                      <Table.Body>
                        {renderTopFiftyRows(airdropTop50)}
                      </Table.Body>
                    )
                  }
                </Table>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className="staking-table">
                <Table inverted>
                  <Table.Header>
                    <Table.Row>
                      <Table.Cell>Date</Table.Cell>
                      <Table.Cell>Amount</Table.Cell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>--</Table.Cell>
                      <Table.Cell>--</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </div>
            </Grid.Column>
          </Grid>
          {/* <div className="airdrop-status-container">
            <Grid stackable>
              <Grid.Column width="8">
                <Segment>
                  Airdrop List
                </Segment>
              </Grid.Column>
              <Grid.Column width="8">
                <Segment>
                  Airdrop Dates
                </Segment>
              </Grid.Column>
            </Grid>
          </div> */}
        </div>
      </div>
    );
  }
}

export default withRouter(connect(
  (state) => {
    const airdropData = state.airdrop.get('leaderBoard');
    const acctName = state.user.userInfo.eosAccount;
    const walletId = state.scatter.get('account');
    const airdorpDesc = state.pages.getIn(['descriptions', 'airdrop']);

    const airdropBonuses = [
      150000, 140000, 130000, 120000, 110000, 100000, 95000, 90000, 85000,
      80000, 75000, 70000, 65000, 60000, 55000, 50000, 45000,
      40000, 35000, 28000, 22000, 21500, 21000, 20500, 20000,
      19500, 19000, 18500, 18000, 17500, 17000, 16500, 16000,
      15000, 14000, 13000, 12000, 11000, 10000, 9000, 8500,
      8000, 7000, 6000, 5000, 4000, 3000, 2000, 1500, 1000,
    ];

    let stakedBalanceSum = 0;
    let presaleBalanceSum = 0;
    let onsiteBalanceSum = 0;
    let airdropTop50 = [];
    if (airdropData) {
      airdropTop50 = Object.keys(airdropData).map((resultKey) => {
        const resultVal = airdropData[resultKey];
        const stakedBalance = parseFloat(resultVal.stakedBalance) ? parseFloat(resultVal.stakedBalance) : 0;
        const presaleBalance = parseFloat(resultVal.presaleBalance) ? parseFloat(resultVal.presaleBalance) : 0;
        const onsiteBalance = parseFloat(resultVal.onsiteBalance) ? parseFloat(resultVal.onsiteBalance) : 0;
        stakedBalanceSum += stakedBalance;
        presaleBalanceSum += presaleBalance;
        onsiteBalanceSum += onsiteBalance;
        return {
          account: resultVal.account,
          totalStaked: stakedBalance + presaleBalance + onsiteBalance
        };
      });

      airdropTop50 = airdropTop50.sort((a, b) => { return b.totalStaked - a.totalStaked; });
      for (let x = 0; x < airdropBonuses.length; x++) {
        airdropTop50[x].bonus = airdropBonuses[x];
      }
    }

    const totalTrybeEligible = stakedBalanceSum + presaleBalanceSum + onsiteBalanceSum;
    const indData = _.find(airdropTop50, (row) => { return row.account === walletId; });
    const myAirdropPercentage = indData ? indData.totalStaked / totalTrybeEligible : 0;
    const myAirdrop = 5000000 * myAirdropPercentage;
    const claimStatus = state.airdrop.get('claimStatus');
    const claimError = state.airdrop.get('claimError');
    return {
      airdropData, airdorpDesc, indData, totalTrybeEligible, airdropTop50, acctName, myAirdropPercentage, myAirdrop, claimStatus, claimError, walletId
    };
  },
  dispatch => ({
    getPageDesc: () => {
      dispatch(pageActions.getPageDescriptionsRoutine());
    },
    getAirdropLeaderBoard: () => {
      dispatch(airdropActions.getAirdropLeaderBoardRoutine());
    },
    claimAirdrop: (args) => {
      dispatch(airdropActions.claimAirdropRoutine(args));
    },
  })
)(Airdrops));