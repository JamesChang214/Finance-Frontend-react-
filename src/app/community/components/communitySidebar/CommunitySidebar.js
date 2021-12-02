import React, { Component } from 'react';
import { Grid, Menu, Button, Dropdown, Divider } from 'semantic-ui-react';
import { NavLink, withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as scatterActions from '../../../scatter/scatterActions';
import scatterIcon from '../../../../staticAssets/images/scatter-icon.svg';
import meetoneIcon from '../../../../staticAssets/images/meetone_wallet_logo.svg';
import lynxIcon from '../../../../staticAssets/images/eos_lynx_wallet_logo.svg';
import tpIcon from '../../../../staticAssets/images/tp-icon.svg';
import wombatIcon from '../../../../staticAssets/images/wombat_icon.svg';

class WalletSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false, value: 99999, isLynx: false };
  }

  toggleVisibility = () => this.setState(prevState => ({ visible: !prevState.visible }));

  handleChange = (e, { value }) => this.setState({ value });

  render() {
    const { value, isLynx } = this.state;
    const { signInToScatter, signOutOfScatter, walletId, acctName, isAdmin } = this.props;

    const options = [
      { text: 'SCATTER', value: 0, image: { avatar: true, src: scatterIcon } },
      { text: 'ANCHOR', value: 1, image: { avatar: true, src: 'data:image/svg+xml,%3C%3Fxml version=\'1.0\' encoding=\'UTF-8\'%3F%3E%3Csvg viewBox=\'0 0 160 160\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'80\' cy=\'80\' r=\'80\' fill=\'%233650A2\'/%3E%3Cpath d=\'m80.006 30c2.2988 0 4.3956 1.3134 5.3987 3.3818l24.006 49.5 0.542 1.1178h-13.337l-3.8797-8h-25.461l-3.8798 8h-13.337l0.5423-1.1182 24.006-49.5c1.0031-2.0684 3.0998-3.3818 5.3986-3.3818zm-7.8807 36h15.761l-7.8807-16.25-7.8807 16.25zm25.874 35h12.006c-0.361 16.152-13.731 29-29.999 29s-29.638-12.848-29.998-29h12.005c0.281 7.354 5.1673 13.631 11.987 15.996v-23.996c0-3.3137 2.6863-6 6-6s6 2.6863 6 6v24c6.8262-2.362 11.718-8.641 11.999-16z\' clip-rule=\'evenodd\' fill=\'%23fff\' fill-rule=\'evenodd\'/%3E%3C/svg%3E%0A' } },
      { text: 'MEETONE', value: 2, image: { avatar: true, src: meetoneIcon } },
      { text: 'LYNX', value: 3, image: { avatar: true, src: lynxIcon } },
      { text: 'TP', value: 4, image: { avatar: true, src: tpIcon } },
      { text: 'Wombat', value: 5, image: { avatar: true, src: wombatIcon } },
    ].sort((a, b) => { return a.value - b.value; });

    window.addEventListener('lynxMobileLoaded', () => {
      // lynx is on the window and ready!
      !acctName && signInToScatter({ data: 3 });
      this.setState({ value: 3, isLynx: true });
      console.log('LYNX Loaded')
    });

    return (
      <Grid.Column width="3" className="wallet-menu-container">
        <Menu vertical className="vertical-wallet-menu hide-desctop">
          {!walletId && (
            <Button.Group
              color="green"
              fluid
              style={{ marginBottom: '2rem' }}
            >
              <Dropdown
                header="Select A Wallet"
                className="button icon"
                inline
                options={options}
                onChange={this.handleChange}
                value={value}
              />
              <Button
                disabled={value == 99999}
                onClick={() => {
                  !isLynx && value == 3 ? window.open('https://magic-resolver.lynxwallet.io/desktop/lynxwallet:apps/eos_trybe') : signInToScatter({ data: value });
                }}>Connect Wallet
              </Button>
            </Button.Group>
          )}
          {walletId && (
            <div>
              <Button
                fluid
                positive
                onClick={() => {
                  signOutOfScatter();
                }}> Logout Wallet
              </Button>
              <Button
                fluid
                disabled
              > {walletId}
              </Button>
            </div>
          )}
        </Menu>

        <Button.Group
          compact
          color="green"
          className="hide-tablet"
          style={{ marginTop: '2rem' }}
        >
          {!walletId && (
            <div>
              <Dropdown
                header="Select A Wallet"
                className="button icon"
                inline
                options={options}
                onChange={this.handleChange}
                value={value}
              />
              <Button
                disabled={value == 99999}
                onClick={() => {
                  !isLynx && value == 3 ? window.open('https://magic-resolver.lynxwallet.io/desktop/lynxwallet:apps/eos_trybe') : signInToScatter({ data: value });
                }}>Connect Wallet
              </Button>
            </div>
          )}
          {walletId && (
            <div>
              <Button
                compact
                positive
                onClick={() => {
                  signOutOfScatter();
                }}> Logout
              </Button>
              <Button
                compact
                disabled
              > {walletId}
              </Button>
            </div>
          )}
        </Button.Group>

        <Menu vertical className="vertical-wallet-menu hide-tablet">
          <Menu.Item>
            <p className="active bold"><b>Wallet</b></p>
          </Menu.Item>
          <Divider />
          <Menu.Item>
            <NavLink to="/wallet" exact activeClassName="active">Trybe Wallet</NavLink>
          </Menu.Item>
          <Menu.Item>
            <Link to="/wallet/powerup" exact activeClassName="active">Power up</Link>
          </Menu.Item>
          <Menu.Item>
            <NavLink to="/wallet/payout" exact activeClassName="active">Weekly Payout</NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to="/wallet/defi" exact activeClassName="active">Defi</NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to="/wallet/staking" exact activeClassName="active">Staking (legacy)</NavLink>
          </Menu.Item>
          {/*
          <Menu.Item>
            <NavLink to="/wallet/airdrops" exact activeClassName="active">Airdrop Bonuses</NavLink>
          </Menu.Item>
          <Menu.Item>
            <Link to="/wallet">Transactions</Link>
          </Menu.Item>
          {acctName == "lil2good" && (
            <Menu.Item className="account">
              <NavLink to="/wallet/portfolio" exact activeClassName="active">Portfolio</NavLink>
            </Menu.Item>
          )}
          <Menu.Item>
            <Link to="/wallet">Trade</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/wallet">Resources</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/wallet">Send/Receive</Link>
          </Menu.Item>
          <Menu.Item />
          <Menu.Item>
            <Link to="/wallet">New EOS Account</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/wallet">Settings</Link>
          </Menu.Item>*/}
          <Menu.Item />
          {acctName && (
            <Menu.Item className="account">
              <NavLink to="/profile/settings" exact activeClassName="active">Settings</NavLink>
            </Menu.Item>
          )}
          <Menu.Item />
          <Menu.Item>
            <p className="active bold"><b>Staking Tool</b></p>
          </Menu.Item>
          <Divider />
          <Menu.Item>
            <a href="https://eos.staker.one" target="_blank" rel="noopener noreferrer">Staker.One</a>
          </Menu.Item>
          {isAdmin && (isAdmin.administrator) && (
            <div>
              <Menu.Item>
                <p className="active bold"><b>Administrative Menus</b></p>
              </Menu.Item>
              <Divider />
              <Menu.Item>
                <NavLink to="/wallet/withdraws" exact activeClassName="active">Pending Withdraws</NavLink>
              </Menu.Item>
            </div>
          )}
        </Menu>
      </Grid.Column>
    );
  }
}

export default withRouter(connect(
  (state) => {
    const acctName = state.user.userInfo.username;
    const isAdmin = state.user.userInfo.extra_capabilities;
    const walletId = state.scatter.getIn(['identity', 'account_name']);
    walletId && console.log(walletId);
    return {
      acctName,
      walletId,
      isAdmin
    };
  },
  dispatch => ({
    signInToScatter: (args) => {
      dispatch(scatterActions.signInToScatterRoutine(args));
    },
    signOutOfScatter: (args) => {
      dispatch(scatterActions.signOutOfScatterRoutine(args));
    },
  })
)(WalletSidebar));
