/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Grid, Image, Icon } from 'semantic-ui-react';

import { toggleSidebar } from '../sidebar/SidebarActions';
import {
  subscribeOnRealtimeNotifications,
  newNotification,
  getNotifications
} from '../sidebar/notifications/NotificationsActions';
import { getReadonlyToken } from '../sidebar/notifications/NotificationsApi';
import { streamConnectById } from '../util/helperFunctions';
import { returnToLoginMode } from '../user/userActions';
import LoginModal from '../login/LoginModal';

class Header extends Component {
  constructor(props) {
    super(props);
    const theme = window.localStorage.getItem('trybe_theme') ? window.localStorage.getItem('trybe_theme') : 'light';
    this.state = {
      visible: false,
      openLoginModal: false,
      lightTheme: theme === 'light' ? true : false,

    };

    this.notificationFeed = null;
  }

  componentDidUpdate(prevProps) {
    const {
      getNotificationsFeed,
    } = this.props;
    const { isAuthorized, userInfo } = this.props;

    if (prevProps.isAuthorized !== isAuthorized) {
      if (isAuthorized) {
        this.closeLoginModal();
      }
    }

    if (prevProps.isAuthorized === false && isAuthorized === true) {
      this.subscribeOnRealtimeNotifications(userInfo.id);
      getNotificationsFeed({ userId: userInfo.id, markSeen: false });
    }

    if (prevProps.isAuthorized === true && isAuthorized === false) {
      this.notificationFeed.unsubscribe();
    }
  }

  showLoginModal = () => this.setState({ openLoginModal: true });

  closeLoginModal = () => {
    const { resetModal } = this.props;
    this.setState({ openLoginModal: false });
    resetModal();
  }

  reopenLogin = () => {
    const { resetModal } = this.props;
    resetModal();
  }

  subscribeOnRealtimeNotifications = (userId) => {
    return Promise.all([
      getReadonlyToken({ userId }),
      streamConnectById(userId)
    ]).then(([token, client]) => {
      this.notificationFeed = client.feed(
        'notification',
        userId.toString(),
        token
      );

      const callback = (data) => {
        const { isAuthorized, pushNewNotification } = this.props;
        if (data.new.length !== 0 && isAuthorized) pushNewNotification(data.new);
      };

      function successCallback() {
        console.log(
          'Now listening to changes in realtime. Add an activity to see how realtime works.'
        );
      }

      function failCallback(data) {
        console.log('fail callback', data);
      }

      this.notificationFeed
        .subscribe(callback)
        .then(successCallback, failCallback);
    });
  };

  openSidebar() {
    const { sidebarOpened } = this.state;
    console.log(sidebarOpened);
    this.setState({ sidebarOpened: true });
  }

  toggleMenu = () => this.setState(prevState => ({ visible: !prevState.visible }))

  render() {
    const { history, toggleSidebarAction, scrollPosition, unseen, isAdmin, loadingNotifications } = this.props;
    const { openLoginModal, sidebarOpened } = this.state;
    const pageName = window.location.pathname;
    return (
      <Grid>
        <header className={scrollPosition ? 'cz-header-fixed' : ''}>
          {/* <div className="signup-banner"><Link to="../wallet/payout" style={{textTransform: 'uppercase'}}>Click here to learn how to earn more TRYBE tokens.</Link></div> */}
          <Container>
            <nav className="navbar navbar-expand-lg navbar-light fixed-top shadow-sm" id="mainNav">
              <div className="container">
                {/* {!sidebarOpened && pageName != '/' && (
                <img className="cztoggle-menu-web" onClick={() => this.openSidebar()} src="/menu.svg" alt="menu" />
              )} */}
                <a className="navbar-brand fw-bold" href="/">
                  <img src="/img/log-loop.png" alt="" />
                </a>
                <img className="cztoggle-menu-mobile" onClick={() => toggleSidebarAction('pages')} src="/menu.svg" alt="menu" />
                {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                Menu
                <i className="bi-list">1</i>
              </button> */}
                <div className="collapse navbar-collapse" id="navbarResponsive">
                  <ul className="navbar-nav ms-auto mr-auto my-3 my-lg-0">
                    <li className="nav-item"><a className="nav-link me-lg-3" onClick={() => history.push('/')}><span className={pageName == '/' ? 'cz-sidebarActive' : ''}>Home</span></a></li>
                    <li className="nav-item"><a className="nav-link me-lg-3" onClick={() => history.push('/community/')}><span className={pageName == '/community/' || pageName == '/profile/my-articles/' || pageName == "/profile/engagement/" || pageName == '/post/editor/new/' || pageName == '/profile/following/' || pageName == '/profile/settings/' ? 'cz-sidebarActive' : ''}>Community</span></a></li>
                    <li className="nav-item"><a className="nav-link me-lg-3 exchangePageView" onClick={() => history.push('/exchange/')}><span className={pageName == '/exchange/' ? 'cz-sidebarActive' : ''}>Exchange</span></a></li>
                    <li className="nav-item"><a className="nav-link me-lg-3" onClick={() => history.push('/markets/')}><span className={pageName == '/markets/' ? 'cz-sidebarActive' : ''}>Markets</span></a></li>
                    {/*isAdmin && isAdmin.administrator && <li className="nav-item"><a className="nav-link me-lg-3" onClick={() => history.push('/wallet/')}><span className={pageName == '/wallet/' ? 'cz-sidebarActive' : ''}>Wallet</span></a></li>*/}
                  </ul>
                  <div className="cz-icons cz-onlydesktop">
                    <a href="https://t.me/loopfinance" target="_blank" className="socialLink"><Image src="/tel.png" /></a>
                    <a href="https://twitter.com/loop_finance" target="_blank" className="socialLink"><Image src="/tw.png" /></a>
                  </div>
                  {this.props.isAuthorized ? (
                    <Grid className="user-area">
                      <Grid className="user-online">
                        <Image as={Link} to="../../../profile/my-articles/" className="img-profile rounded-circle" src={this.props.userInfo.avatar_urls[96]} />
                        <Link to="../../../profile/notifications/">
                          <span>
                            {unseen.length !== 0 && loadingNotifications === false && (
                              unseen.length
                            )}
                            {unseen.length === 0 && (
                              <Icon name="bell" style={{ margin: 'auto !important', height: 'auto !important' }} />
                            )}
                          </span>
                        </Link>
                      </Grid>
                      {/**
                    <Grid className="Wallet">
                      <p className="mb-0">wallet <br /> connected</p>
                    </Grid>
                     */}
                    </Grid>
                  ) : (
                    <div className="combinedBtn">
                      <button className="btn headerBtn headerBtn--login px-3 mb-2 mb-lg-0" type="button" onClick={this.showLoginModal}>Log In</button>
                      <button className="btn headerBtn px-3 mb-2 mb-lg-0" type="button" onClick={() => history.push('/sign-up/')}>Join</button>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </Container>
        </header>
        <LoginModal
          open={openLoginModal}
          close={this.closeLoginModal}
          closePassword={this.reopenLogin}
        />
      </Grid >
    );
  }
}

export default withRouter(
  connect(
    state => ({
      userInfo: state.user.userInfo,
      isAuthorized: state.user.userIsLogged,
      loginning: state.user.loginning,
      subsribed: state.notifications.subscribed,
      realtimeNotifications: state.notifications.realtime,
      unseen: state.notifications.unseen,
      loadingNotifications: state.notifications.loading,
      acctName: state.user.userInfo.eosAccount,
      isAdmin: state.user.userInfo.extra_capabilities,
    }),

    dispatch => ({
      toggleSidebarAction: (params) => {
        console.log(params);
        dispatch(toggleSidebar(params));
      },
      subscribe: (params) => {
        dispatch(subscribeOnRealtimeNotifications(params));
      },
      pushNewNotification: (params) => {
        dispatch(newNotification(params));
      },
      getNotificationsFeed: (params) => {
        dispatch(getNotifications(params));
      },
      resetModal: () => {
        dispatch(returnToLoginMode());
      }
    })
  )(Header)
);
