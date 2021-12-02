import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { Table, Grid, Loader } from 'semantic-ui-react';

import * as payoutActions from './engagementActions';
import InfoBlock from './components/InfoBlock/InfoBlock';
import PayoutCountdown from './components/Countdown';

const TokenBalanceIcon = <div className="icon-wrapper icon-balance-wrapper"><i className="fas fa-coins icon icon-balance" /></div>;
const RankIcon = <div className="icon-wrapper icon-trophy-wrapper"><i className="fas fa-trophy icon icon-trophy" /></div>;
const PercentIcon = <div className="icon-wrapper icon-piggy-wrapper"><i className="fas fa-percentage icon icon-piggy" /></div>;

class PayoutStats extends PureComponent {
  componentDidMount() {
    const { getPayoutData, getPayoutHistory, cookies } = this.props;
    const token = cookies.get('trybe_jwt', { path: '/' });

    if (token) {
      getPayoutHistory(token);
    }
  }

  render() {
    const { userInfo, payoutHistory, weeklyDes1, weeklyDes2 } = this.props;
    return (
      <div className="airdrop-container tr-power-up cz-tr-power-up" style={{marginBottom: '100px'}}>
        <Grid className="cz-grid-powerup" columns={1}>
          <Grid.Column mobile={16} tablet={16} computer={16}>
            <div className="tr-expl-item">
              {weeklyDes1}
            </div>
          </Grid.Column>
          {/*
          <Grid.Column mobile={16} tablet={16} computer={8}>
            <div className="tr-expl-item">
              <div className="tr-expl-item__count">
                <span>2</span>
              </div>
              <p>{weeklyDes2}</p>
              <p><b style={{marginTop: '20px'}}>Current Limit: {payoutData ? payoutData.powerups_req + ' LOOPR' : <Loader active={!payoutData} inline size="mini" />}</b></p>
            </div>
          </Grid.Column>
          */}
          <Grid.Column className="cz-next-payout" mobile={16} tablet={16} computer={16}>
            <div className="tr-power-up__header">
              <h2 className="tr-block-title">Next Payout</h2>
            </div>
            <div className="tr-expl-item">
              <PayoutCountdown />
            </div>
          </Grid.Column>
        </Grid>
        {userInfo && (
          <Grid stackable columns={3} className="cz-tr-stake tr-stake-wrapper">
            <Grid.Column>
              <InfoBlock icon={PercentIcon} amount={userInfo.details.engagement?.engagement + '%'} name="Engagement Percentage" />
            </Grid.Column>
            <Grid.Column>
              <InfoBlock icon={RankIcon} amount={userInfo.details?.rank} name="Your Rank" amountClassName="power-up__rank" />
            </Grid.Column>
            <Grid.Column>
              <InfoBlock icon={TokenBalanceIcon} amount={userInfo.details.engagement?.total_payout} max={userInfo.details.engagement?.max_payout} name="Next Payout Amount" />
            </Grid.Column>
          </Grid>
        )}
        <div className="power-up__user-details-container">
          <div className="staking-table cz-staking-table cz-setstaking-new">
            <Loader active={!userInfo} inline size="massive" />
            { userInfo && (
              <div>
                <div className="tr-power-up__header" style={{marginTop: '4rem'}}>
                  <h2 className="tr-block-title">Your Engagement</h2>
                </div>
                <Table>
                  <Table.Header>
                    <Table.Row className="portfolio-table-row">
                      <Table.Cell width="2">Ratings</Table.Cell>
                      <Table.Cell width="2">Posts</Table.Cell>
                      <Table.Cell width="2">Comments</Table.Cell>
                      {/* <Table.Cell width="2">Withdraws</Table.Cell> */}
                      {/* <Table.Cell width="2">Last Updated</Table.Cell> */}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    { userInfo && (
                      <Table.Row className="portfolio-table-row" style={{fontSize: '22px'}}>
                        <Table.Cell width="2">
                          {userInfo.details.engagement.limit?.rates_count} / {userInfo.details.engagement.limit?.rates_limit}
                          <small>+{userInfo.details.engagement.percent?.rate_percent}</small>
                        </Table.Cell>
                        <Table.Cell width="2">
                          {userInfo.details.engagement.limit?.posts_count} / {userInfo.details.engagement.limit?.posts_limit}
                          <small>+{userInfo.details.engagement.percent?.post_percent}</small>
                        </Table.Cell>
                        <Table.Cell width="2">
                          {userInfo.details.engagement.limit?.comments_count} / {userInfo.details.engagement.limit?.comments_limit}
                          <small>+{userInfo.details.engagement.percent?.comment_percent}</small>
                        </Table.Cell>
                        {/* 
                        <Table.Cell width="2" style={{color: '#C83E93'}}>
                          {payoutData.withdraws}
                          
                          <small style={{color: '#C83E93'}}>-100%</small>
                        </Table.Cell>
                        
                        <Table.Cell width="2">
                          <small>{payoutData.last_updated}</small>
                        </Table.Cell>
                        */}
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </div>
            )}


            { userInfo.details && (
              <div>
                <Grid className="cz-stackable" stackable columns={2}>
                  <Grid.Column width={8}>
                    <div className="tr-power-up__header" style={{marginTop: '4rem'}}>
                      <h2 className="tr-block-title">Reward Details</h2>
                    </div>
                    <Table>
                      <Table.Header>
                        <Table.Row className="portfolio-table-row">
                          <Table.Cell width="2">Rank</Table.Cell>
                          <Table.Cell width="2">Token Balance</Table.Cell>
                          <Table.Cell width="2">Max Weekly Payout</Table.Cell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {userInfo.details.engagement_details.map(item => (
                          <Table.Row className="portfolio-table-row">
                            <Table.Cell width="2">{item.name}</Table.Cell>
                            <Table.Cell width="2" className="tokens-required-cell">
                              <i className="fas table-icon-padding fa-piggy-bank icon icon-piggy" /> {item.tokens_required}
                            </Table.Cell>
                            <Table.Cell width="2" className="voting-articles-cell">
                              <i className="table-icon-padding fas fa-chart-bar" /> {item.bonus_reward}
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </Grid.Column>

                  {payoutHistory && (
                    <Grid.Column className="cz-payout-history" width={8}>
                      <div className="tr-power-up__header" style={{marginTop: '4rem'}}>
                        <h2 className="tr-block-title">Past 10 Payouts</h2>
                      </div>
                      <Table className="cz-payout-history-table">
                        <Table.Header>
                          <Table.Row className="portfolio-table-row">
                            <Table.Cell width="2">Rank</Table.Cell>
                            <Table.Cell width="2">Payout Date</Table.Cell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {payoutHistory.data.map(item => (
                            <Table.Row className="portfolio-table-row">
                              <Table.Cell width="2">{item.payout} LOOPR</Table.Cell>
                              <Table.Cell width="2" className="tokens-required-cell">
                                {item.date}
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table>
                    </Grid.Column>
                  )}
                </Grid>
              </div>
            )}
          </div>
        </div>
      </div>);
  }
}

export default withCookies(connect(
  (state) => {
    const userInfo = state.user.userInfo,
    const payoutHistory = state.payout.payoutHistory[0];
    const weeklyDes1 = state.pages.getIn(['weekly_payout_descriptions', 'des_1']);
    const weeklyDes2 = state.pages.getIn(['weekly_payout_descriptions', 'des_2']);
    return {
      payoutHistory,
      weeklyDes1,
      weeklyDes2,
      userInfo
    }
  }, dispatch => ({
    getPayoutHistory: token => dispatch(payoutActions.getPayoutHistoryRoutine({ token })),
  })
)(PayoutStats));