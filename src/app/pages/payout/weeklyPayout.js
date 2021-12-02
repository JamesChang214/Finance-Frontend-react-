import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { Table, Grid, Loader } from 'semantic-ui-react';

import * as payoutActions from './weeklyPayoutActions';
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
      getPayoutData(token);
    }
    if (!token) {
      getPayoutData();
    }
  }

  /*
  componentDidUpdate() {
    const { getPayoutData, cookies } = this.props;
    const token = cookies.get('trybe_jwt', { path: '/' });

    if (token) {
      getPayoutData(token);
    }
  }
  */

  render() {
    const { payoutData, payoutHistory, weeklyDes1, weeklyDes2 } = this.props;
    return (
      <div className="airdrop-container tr-power-up cz-tr-power-up">
        <div className="tr-power-up__header">
          <h2 className="tr-block-title">Weekly Payout</h2>
          <div className="power-up-button-container">
            <Link to="/wallet/powerup">
              <div
                className="power-up-button-container__button"
              > Powerup To Earn More
              </div>
            </Link>
          </div>
        </div>
        <Grid className="cz-grid-powerup" stackable columns={2}>
          <Grid.Column mobile={16} tablet={16} computer={8}>
            <div className="tr-expl-item">
              <div className="tr-expl-item__count">
                <span>1</span>
              </div>
              {weeklyDes1}
            </div>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={16} computer={8}>
            <div className="tr-expl-item">
              <div className="tr-expl-item__count">
                <span>2</span>
              </div>
              <p>{weeklyDes2}</p>
              <p><b style={{marginTop: '20px'}}>Current Limit: {payoutData ? payoutData.powerups_req + ' TRYBE' : <Loader active={!payoutData} inline size="mini" />}</b></p>
            </div>
          </Grid.Column>
          <Grid.Column className="cz-next-payout" mobile={16} tablet={16} computer={16}>
            <div className="tr-power-up__header">
              <h2 className="tr-block-title">Next Payout</h2>
            </div>
            <div className="tr-expl-item">
              <div className="tr-expl-item__count">
                <span>3</span>
              </div>
              <PayoutCountdown />
            </div>
          </Grid.Column>
        </Grid>
        {payoutData && payoutData.percent && (
          <Grid stackable columns={3} className="cz-tr-stake tr-stake-wrapper">
            <Grid.Column>
              <InfoBlock icon={TokenBalanceIcon} amount={payoutData.total_payout} name="Next Payout Amount" />
            </Grid.Column>
            <Grid.Column>
              <InfoBlock icon={RankIcon} amount={payoutData.rank} name="Your Rank" amountClassName="power-up__rank" />
            </Grid.Column>
            <Grid.Column>
              <InfoBlock icon={PercentIcon} amount={payoutData.engagement + '%'} name="Engagement Percentage" />
            </Grid.Column>
          </Grid>
        )}
        <div className="power-up__user-details-container">
          <div className="staking-table cz-staking-table cz-setstaking-new">
            <Loader active={!payoutData} inline size="massive" />
            { payoutData && payoutData.percent && (
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
                      <Table.Cell width="2">Powerups</Table.Cell>
                      <Table.Cell width="2">Withdraws</Table.Cell>
                      <Table.Cell width="2">Last Updated</Table.Cell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    { payoutData && (
                      <Table.Row className="portfolio-table-row" style={{fontSize: '22px'}}>
                        <Table.Cell width="2">
                          {payoutData.rates} / {payoutData.rates_limit}
                          <small>+{payoutData.percent.rate_percent}</small>
                        </Table.Cell>
                        <Table.Cell width="2">
                          {payoutData.posts} / {payoutData.posts_limit}
                          <small>+{payoutData.percent.post_percent}</small>
                        </Table.Cell>
                        <Table.Cell width="2">
                          {payoutData.comments} / {payoutData.comments_limit}
                          <small>+{payoutData.percent.comment_percent}</small>
                        </Table.Cell>
                        <Table.Cell width="2">
                          {payoutData.powerups} / {payoutData.powerups_limit} <small> &gt; {payoutData.powerups_req}</small>
                          
                          <small>+{payoutData.percent.powerup_percent}</small>
                        </Table.Cell>
                        <Table.Cell width="2" style={{color: '#C83E93'}}>
                          {payoutData.withdraws}
                          
                          <small style={{color: '#C83E93'}}>-100%</small>
                        </Table.Cell>
                        <Table.Cell width="2">
                          <small>{payoutData.last_updated}</small>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </div>
            )}


            { payoutData && (
              <div>
                <Grid className="cz-stackable" stackable columns={2}>
                  <Grid.Column width={11}>
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
                        {payoutData.details.map(item => (
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
                    <Grid.Column className="cz-payout-history" width={5}>
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
                              <Table.Cell width="2">{item.payout} TRYBE</Table.Cell>
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
    const payoutData = state.payout.payoutStats[0];
    const payoutHistory = state.payout.payoutHistory[0];
    const weeklyDes1 = state.pages.getIn(['weekly_payout_descriptions', 'des_1']);
    const weeklyDes2 = state.pages.getIn(['weekly_payout_descriptions', 'des_2']);
    return {
      payoutData,
      payoutHistory,
      weeklyDes1,
      weeklyDes2
    }
  }, dispatch => ({
    getPayoutData: token => dispatch(payoutActions.getPayoutData({ token })),
    getPayoutHistory: token => dispatch(payoutActions.getPayoutHistoryRoutine({ token })),
  })
)(PayoutStats));