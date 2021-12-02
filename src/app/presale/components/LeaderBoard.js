import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Table, Tab, Image } from 'semantic-ui-react';
import * as presaleActions from '../presaleActions';

class LeaderBoard extends Component {
  componentDidMount() {
    const { getLeaderBoard } = this.props;
    getLeaderBoard();
  }

  render() {
    const { leaderBoardData } = this.props;
    console.log('lbd', leaderBoardData);
    const totalTrybeSpent = leaderBoardData ? leaderBoardData.topFiftyCurrentMonth.reduce((total, item) => {
      return total + parseFloat(item.sum_trybe_amount);
    }, 0) : 0;

    const lastMonthsWinnersData = [
      ['newt2222xxxx', '191820 TRYBE', 'befaeab89dd8740cc89a407ebcab14923ba32e4b0a4069d08f0237f60047b9d9'],
      ['hazdmnjvg4ge', '142670 TRYBE', 'f988e6948c9d0249257efb47267e743f8f931b7790f1d835e46a90ce31e5b7e6'],
      ['balazsdancso', '114430 TRYBE', '0398023d70c8026984b144f499f5e5be7d9df928b37a41b2ce83f147c141af55'],
      ['g44dknrtgage', '104710 TRYBE', '15df0d379daa7e136fd52bd3c702cc5fbe0545310ca01de5bdaba331e4c1d064'],
      ['starcitizen1', '91230 TRYBE', '005d7e6723951402205e48189535c59e305390f550766c405b5a9dd233b69425'],
      ['gm3daobygege', '77570 TRYBE', 'd0931c78132a547d7dfdf35a184dff2f2ad749e61abf01dc5c6b31db1706cd63'],
      ['geydenjsgmge', '73040 TRYBE', '080a7123932a4350e4b0dffeac58ef9f82f7bbe8739860f91aca919db432efbc'],
      ['linxia353222', '71420 TRYBE', 'f7543d320f382a2e0e4a34d3f10a00ba865bdc37b9cdaa601f7b4bbe628072b7'],
      ['myneweosname', '69050 TRYBE', '52397dbb7ce1d49029432b6674eff3475b9c068ae7e48d19285bf7fe19d947b0'],
      ['gmztqnzxgmge', '64050 TRYBE', 'e4878329d427ced20e2489ff9a398b3e3f988c622dc9822866b36325f0a124d7']
    ];
    const panes = [
      {
        menuItem: 'Top 50 This Month',
        render: () => (
          <Tab.Pane attached={false}>
            <Table celled inverted>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={1}>Rank</Table.HeaderCell>
                  <Table.HeaderCell width={2}>Account</Table.HeaderCell>
                  <Table.HeaderCell width={2}>Trybe Amount</Table.HeaderCell>
                  <Table.HeaderCell width={2}>Eos Amount</Table.HeaderCell>
                  <Table.HeaderCell width={2}>Bonus Trybe</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {leaderBoardData && renderTopFiftyRows(leaderBoardData.topFiftyCurrentMonth)}
              </Table.Body>
            </Table>
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Top 200 All Time',
        render: () => (
          <Tab.Pane attached={false}>
            <Table celled inverted>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={1}>Rank</Table.HeaderCell>
                  <Table.HeaderCell width={2}>Account</Table.HeaderCell>
                  <Table.HeaderCell width={2}>All Time Trybe Amount</Table.HeaderCell>
                  <Table.HeaderCell width={2}>All Time Eos Amount</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {leaderBoardData && renderTopTwoHundredRows(leaderBoardData.topTwoHundredAllTime)}
              </Table.Body>
            </Table>
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Last Months Winners',
        render: () => (
          <Tab.Pane attached={false}>
            <Table celled inverted>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={1}>Rank</Table.HeaderCell>
                  <Table.HeaderCell width={2}>Account</Table.HeaderCell>
                  <Table.HeaderCell width={2}>Trybe Amount</Table.HeaderCell>
                  <Table.HeaderCell width={2}>EOS Transaction</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {renderLastMonthsWinners(lastMonthsWinnersData)}
              </Table.Body>
            </Table>
          </Tab.Pane>
        )
      },
    ];

    const renderTopFiftyRows = items => items.map((item, index) => {
      return (
        <Table.Row key={item.account}>
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>{item.account}</Table.Cell>
          <Table.Cell>{item.sum_trybe_amount.toFixed(4)}</Table.Cell>
          <Table.Cell>{item.sum_eos_amount.toFixed(4)}</Table.Cell>
          <Table.Cell>{(1000000 * item.sum_trybe_amount / totalTrybeSpent).toFixed(0)}</Table.Cell>
        </Table.Row>
      );
    });

    const renderTopTwoHundredRows = items => items.map((item, index) => {
      return (
        <Table.Row key={item.account}>
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>{item.account}</Table.Cell>
          <Table.Cell>{item.sum_trybe_amount.toFixed(4)}</Table.Cell>
          <Table.Cell>{item.sum_eos_amount.toFixed(4)}</Table.Cell>
        </Table.Row>
      );
    });

    const renderLastMonthsWinners = items => items.map((item, index) => {
      return (
        <Table.Row key={item[0]}>
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>{item[0]}</Table.Cell>
          <Table.Cell>{item[1]}</Table.Cell>
          <Table.Cell>
            <a href={`https://bloks.io/transaction/${item[2]}`} target="_blank" rel="noopener noreferrer">
              <Image floated="left" className="leaderboard-bloks-logo" src="https://live.wallet.trybe.one/assets/img/bloks.png" />
              <span className="leaderboard-bloks-link">view transaction on bloks.io</span>
            </a>
          </Table.Cell>
        </Table.Row>
      );
    });

    return (
      <Tab menu={{ inverted: true, secondary: true, pointing: true }} panes={panes} />
    );
  }
}

export default withRouter(connect(
  (state) => {
    const leaderBoardData = state.presale.get('leaderBoard');
    return {
      leaderBoardData,
    };
  },
  dispatch => ({
    getLeaderBoard: () => {
      dispatch(presaleActions.getLeaderBoardRoutine());
    },
  })
)(LeaderBoard));