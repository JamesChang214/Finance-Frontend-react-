import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Table } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import { setPageForGoogleAnalytics } from '../util/helperFunctions';
import * as portfolioActions from './portfolioActions';
import Chart from './components/Chart';
import ChartButtons from './components/ChartButtons';
import Preloader from './components/Preloader';
import calculateBalanceHelper from './helpers/calculateBalanceHelper';

class Portfolio extends Component {
  state = {
    labels: [],
    walletData: [],
    activeElement: null,
    removedElements: [],
    totalUsd: 0
  };

  componentDidMount() {
    setPageForGoogleAnalytics('wallet/portfolio');
    const { userInfo } = this.props;
    if ((userInfo && userInfo.eosAccount)) {
      const { getBalance } = this.props;
      getBalance(userInfo.eosAccount);
    }
  }

  componentDidUpdate(prevProps) {
    const { balance } = this.props;
    if (prevProps.balance !== balance && balance.popular.length > 0) {
      this.calculateBalance();
    }

    const { userInfo } = this.props;
    if ((userInfo && userInfo.eosAccount) && isEmpty(balance)) {
      const { getBalance } = this.props;
      getBalance(userInfo.eosAccount);
    }
  }

  calculateBalance = () => {
    const { balance } = this.props;
    const { removedElements } = this.state;
    const { labels, walletData, activeElement, totalUsd } = calculateBalanceHelper(balance, removedElements);
    this.setState({ labels, walletData, activeElement, totalUsd });
  }

  setActiveElement = (label, value) => {
    const { labels, activeElement } = this.state;
    const index = labels.indexOf(label);
    if (activeElement.label !== label) {
      this.setState({
        activeElement: {
          label,
          value,
          index
        }
      });
    }
  }

  removeElement = (label) => {
    const { removedElements } = this.state;
    if (removedElements.indexOf(label) === -1) {
      removedElements.push(label);
      this.setState({removedElements: [...removedElements]}, () => this.calculateBalance());
    }
  }

  revertElement = (element) => {
    const { removedElements } = this.state;
    const index = removedElements.indexOf(element);
    removedElements.splice(index, 1);
    this.setState({removedElements: [...removedElements]}, () => this.calculateBalance());
  }

  renderChart = () => {
    const { labels, walletData, activeElement, removedElements } = this.state;
    return labels.length > 0 && walletData.length > 0 ? (
      <>
        <Chart
          labels={labels}
          walletData={walletData}
          setActiveElement={this.setActiveElement}
          activeElement={activeElement}
        />
        <ChartButtons
          labels={labels}
          walletData={walletData}
          setActiveElement={this.setActiveElement}
          activeElement={activeElement}
          removeElement={this.removeElement}
          elementForAdding={removedElements[0]}
          addElementBack={this.revertElement}
        />
      </>
    ) : <Preloader />;
  }

  renderTable = () => {
    const { balance } = this.props;
    if (balance) {
      const { all, eosUsd } = balance;
      return (
        <Table className="portfolio-table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="3">Token</Table.HeaderCell>
              <Table.HeaderCell>Total</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Total EOS</Table.HeaderCell>
              <Table.HeaderCell>Total USD</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {all.map(item => (
              <Table.Row>
                <Table.Cell colSpan="3">{item.key}</Table.Cell>
                <Table.Cell>{item.amount}</Table.Cell>
                <Table.Cell>{item.price}</Table.Cell>
                <Table.Cell>{item.eoseq.toFixed(2)} EOS</Table.Cell>
                <Table.Cell>{(item.eoseq * eosUsd).toFixed(2)} USD</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      );
    }

    return <Preloader />;
  }

  render() {
    const { totalUsd } = this.state;
    return (
      <div className="portfolio-container">
        <h1 className="head-text">Top 5 Tokens by Amount</h1>
        <div className="portfolio-chart">
          {this.renderChart()}
        </div>
        <h2 className="head-text">{ totalUsd } total usd value</h2>
        {this.renderTable()}
      </div>
    );
  }
}

export default withRouter(connect(
  (state) => {
    const balance = state.portfolio.get('balance');
    return { balance, userInfo: state.user.userInfo };
  },
  dispatch => ({
    getBalance: eosAccount => dispatch(portfolioActions.getBalanceRoutine(eosAccount))
  })
)(Portfolio));
