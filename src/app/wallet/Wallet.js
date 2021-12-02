import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setPageForGoogleAnalytics } from '../util/helperFunctions';
import WalletSidebar from './components/walletSidebar/WalletSidebar.tsx';
import Staking from '../staking/Staking';
import Airdrops from '../airdrops/Airdrops';
import Portfolio from '../portfolio/Portfolio';
import TrybeAccount from '../trybeaccount/TrybeAccount';
import PowerUp from '../powerup/powerUp';
import PayoutStats from '../pages/payout/weeklyPayout';
import PendingWithdraws from '../pages/admin/withdraws/pending';
import Helmet from 'react-helmet';

class Wallet extends Component {
  componentDidMount() {
    setPageForGoogleAnalytics('wallet');
  }

  render() {
    const { isAdmin } = this.props;
    return (
      <div className="wallet-row">
        <Helmet>
          <title>Loop Finance | Wallet</title>
        </Helmet>
        <WalletSidebar />
        {/* <Dropdown item>
          <Dropdown.Menu className="mobile-wallet-menu">
            <Dropdown.Item>
              <Link to="/wallet">TRYBE Account</Link>
            </Dropdown.Item>
            <Dropdown.Item />
            <Dropdown.Item>
              <Link to="/wallet/staking">Staking Bonuses</Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link to="/wallet/airdrops">Airdrop Bonuses</Link>
            </Dropdown.Item>
            <Dropdown.Item />
            <Dropdown.Item>
              <Link to="/wallet/portfolio">Portfolio</Link>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> */}

        <Switch>
          <div className="wallet-main-view">
            <Route path="/wallet" exact component={TrybeAccount} />
            <Route path="/wallet/staking" component={Staking} />
            <Route path="/wallet/airdrops" component={Airdrops} />
            <Route path="/wallet/portfolio" component={Portfolio} />
            <Route path="/wallet/powerup" component={PowerUp} />
            <Route path="/wallet/payout" component={PayoutStats} />
            {isAdmin && (isAdmin.administrator) && (
              <Route path="/wallet/withdraws" component={PendingWithdraws} />
            )}
          </div>
        </Switch>
      </div>
    );
  }
}

export default withRouter(connect(
  (state) => {
    const isAdmin = state.user.userInfo.extra_capabilities;
    return {
      isAdmin
    };
  }
)(Wallet));
