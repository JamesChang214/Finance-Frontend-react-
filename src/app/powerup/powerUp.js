import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Table, Grid, Loader } from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';

import * as powerUpActions from './powerUpActions';
import * as pageActions from '../pages/pageActions';
import InfoBlock from './components/InfoBlock/InfoBlock';
import PowerUpButton from './components/powerUpButton/powerUpButton';

const TokenBalanceIcon = <div className="icon-wrapper icon-balance-wrapper"><i className="fas fa-coins icon icon-balance" /></div>;
const RankIcon = <div className="icon-wrapper icon-trophy-wrapper"><i className="fas fa-trophy icon icon-trophy" /></div>;
const TokensNeeded = <div className="icon-wrapper icon-piggy-wrapper"><i className="fas fa-piggy-bank icon icon-piggy" /></div>;

class PowerUp extends PureComponent {
  componentDidMount() {
    const { getPowerupStatus, getPowerUpData, getPowerUpDisplayData, getPowerUpHelperData, cookies } = this.props;
    const cachedUserInfo = JSON.parse(localStorage.getItem('trybe_user'));
    const token = cookies.get('trybe_jwt');
    getPowerupStatus();

    if (cachedUserInfo && cachedUserInfo.id) {
      getPowerUpData(cachedUserInfo.id);
    }

    if (token) {
      getPowerUpHelperData(token);
      getPowerUpDisplayData(token);
    }
    if (!token) {
      getPowerUpHelperData();
      getPowerUpDisplayData();
    }
  }

  renderTable = (userDetails) => {
    return (
      <Table>
        <Table.Header>
          <Table.Row className="portfolio-table-row">
            <Table.Cell width="2">Trybe Rank</Table.Cell>
            <Table.Cell width="2">Tokens Required</Table.Cell>
            <Table.Cell width="2">Voting Weight</Table.Cell>
            <Table.Cell width="2">Bonus Rewards*</Table.Cell>
            <Table.Cell width="2">Weekly Payout Amount</Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {userDetails.map(item => (
            <Table.Row className="portfolio-table-row">
              <Table.Cell width="2">{item.name}</Table.Cell>
              <Table.Cell width="2" className="tokens-required-cell">
                <i className="fas table-icon-padding fa-piggy-bank icon icon-piggy" /> {item.tokens_required}
              </Table.Cell>
              <Table.Cell width="2" className="voting-articles-cell">
                <i className="table-icon-padding fas fa-chart-bar" /> {item.voting_weight_article}
              </Table.Cell>
              <Table.Cell width="2" className="bonus-rewards-cell">
                <i className="table-icon-padding far fa-star" /> {item.bonus_rewards}%
              </Table.Cell>
              <Table.Cell width="2">
                <i className="table-icon-padding far fa-star" />{item.payout_amount}
              </Table.Cell>
              {/*<Table.Cell width="2">{item.voting_weight_social_post}</Table.Cell>
              <Table.Cell width="2">{item.posts_per_day }</Table.Cell>*/}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>);
  }

  render() {
    const { powerUpData, acctName } = this.props;
    return (
      powerUpData.userInfo && powerUpData.userInfo.next_rank ? (
        <div className="airdrop-container tr-power-up">
          <div className="tr-power-up__header">
            <h2 className="tr-block-title">Powerup Rewards</h2>
            <PowerUpButton />
          </div>
          <Grid stackable columns={1}>
            <Grid.Column mobile={16} tablet={16} computer={16}>
              <div className="tr-expl-item">
                <div className="tr-expl-item__count">
                  <span>1</span>
                </div>
                {powerUpData.powerupOptions && (
                  ReactHtmlParser(powerUpData.powerupOptions.data)
                )}
              </div>
            </Grid.Column>
          </Grid>
          {acctName && powerUpData.userInfo && (
            <Grid stackable columns={3} className="tr-stake-wrapper">
              <Grid.Column>
                <InfoBlock icon={TokenBalanceIcon} amount={powerUpData.userInfo.token_balance} name="Your Token Balance" />
              </Grid.Column>
              <Grid.Column>
                <InfoBlock icon={RankIcon} amount={powerUpData.userInfo.user_rank} name="Your Rank" amountClassName="power-up__rank" />
              </Grid.Column>
              <Grid.Column>
                <InfoBlock icon={TokensNeeded} amount={powerUpData.userInfo.next_rank} name="Tokens needed to reach next rank" />
              </Grid.Column>
            </Grid>
          )}
          <div className="power-up__user-details-container">
            <div className="staking-table">
              {powerUpData.userDetails.length > 0 && this.renderTable(powerUpData.userDetails)}
            </div>
          </div>
        </div>
      ) : (
        <Grid stackable columns={1} style={{marginTop: '50px'}}>
          <Grid.Column>
            <Loader active size="massive" />
          </Grid.Column>
        </Grid>
      )
    );
  }
}

export default withCookies(connect(
  (state, ownProps) => ({
    acctName: state.user.userInfo.eosAccount,
    powerUpData: state.powerUp,
    cookies: ownProps.cookies
  }), dispatch => ({
    getPowerUpData: id => dispatch(powerUpActions.getPowerUpData({id})),
    getPowerUpDisplayData: token => dispatch(powerUpActions.getPowerUpDisplayData({ token })),
    getPowerUpHelperData: id => dispatch(powerUpActions.getPowerUpHelperData({id})),
    getPowerupStatus: () => {
      dispatch(pageActions.getPowerupStatusRoutine());
    },
  })
)(PowerUp));