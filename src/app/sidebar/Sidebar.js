/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import {
  List,
  Grid,
  Menu,
  Segment,
  Sidebar,
  Header,
  Checkbox,
  Responsive,
  Icon,
  Image
} from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import * as actions from './SidebarActions';
import * as chatActions from '../chat/ChatActions';
import { returnToLoginMode, userSignOut } from '../user/userActions';

import ControlsPanel from '../util/ControlsPanel';
import NotificationList from './notifications/NotificationList';
import { changeTheme } from '../themes';
import logo from '../trybe-beta.png';
import LoginModal from '../login/LoginModal';
//import SidebarChat from '../chat/SidebarChat';


class SidebarCustom extends Component {
  constructor(props) {
    super(props);
    const theme = window.localStorage.getItem('trybe_theme') ? window.localStorage.getItem('trybe_theme') : 'light';
    this.state = {
      lightTheme: theme === 'light' ? true : false,
      openLoginModal: false,
      communityToggle: false
    };
  }


  componentDidUpdate = (prevProps) => {
    const { chatClient, getChannels, mode, visible, userInfo, isAuthorized } = this.props;
    if (prevProps.isAuthorized !== isAuthorized) {
      if (isAuthorized) {
        this.closeLoginModal();
      }
    }
    if (
      chatClient
      && mode === 'chat-summary'
      && !prevProps.visible
      && visible
    ) {
      getChannels({ client: chatClient, userId: userInfo.id });
    }
  };

  showLoginModal = () => this.setState({ openLoginModal: true });

  joinNow = () => {
    const {history, closeSidebar} = this.props;
    history.push('/sign-up');
    closeSidebar();
  }

  loginUser = () => {
    const {closeSidebar} = this.props;
    this.setState({ openLoginModal: true });
    closeSidebar();
  }

  closeLoginModal = () => {
    const { resetModal } = this.props;
    this.setState({ openLoginModal: false });
    resetModal();
  }

  signOut = () => {
    const { cookies, closeSidebar, signOut } = this.props;
    localStorage.clear();
    cookies.remove('trybe_jwt', { path: '/' });
    signOut();
    closeSidebar();
  }

  scrollChannelList = ({ target }) => {
    const { mode } = this.props;
    if (mode === 'chat-summary') {
      const { loadingChannels, getChannels, chatClient, userInfo } = this.props;
      if (
        window.innerHeight + target.scrollTop >= target.scrollHeight
        && !loadingChannels
      ) {
        getChannels({ client: chatClient, userId: userInfo.id, more: true });
      }
    }
  }

  onScroll = ({ target }) => {
    const { loadingChannels, getChannels, client, userInfo } = this.props;
    if (
      window.innerHeight + target.scrollTop >= target.scrollHeight
      && !loadingChannels
    ) {
      getChannels({ client, userId: userInfo.id, more: true });
    }
  }

  toggleTheme = () => {
    const { lightTheme } = this.state;
    lightTheme ? changeTheme('dark') : changeTheme('light');
    this.setState({ lightTheme: !lightTheme });
  };

  communityToggle = () => {
    const { communityToggle } = this.state;
    this.setState({ communityToggle: !communityToggle });
  }

  render() {
    const { visible, closeSidebar, userInfo, children, isAdmin } = this.props;
    const { openLoginModal, communityToggle } = this.state;
    const pageName = window.location.pathname;

    return (
      <div className={visible ? 'sidebarVisible sidebar-wrapper cz-mobile-menu' : 'sidebarVisible sidebar-wrapper'}>
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation="overlay"
            icon="labeled"
            inverted
            onHide={this.handleSidebarHide}
            vertical
            direction="left"
            visible={visible}
            width="wide"
            onScroll={this.scrollChannelList}
          >

            <Segment inverted className="sidebar-main">
              <Segment inverted className="controls-panel-wrapper">
                <Grid.Row>
                  {/* <span className="menuText">Menu</span> */}
                  <Image src="/img/logo-header.png" alt="" className="sideLogo" />
                  <p className="closeBtn" onClick={closeSidebar}>X</p>
                </Grid.Row>
                <Grid.Row>
                  <List link inverted>

                    <List.Item as="a" className="nav-link" onClick={closeSidebar}>
                      <Link to="/">
                        <span className={pageName == '/' ? 'cz-sidebarActive' : ''}>Home</span>
                      </Link>
                    </List.Item>
                    <List.Item as="a" className="nav-link" onClick={closeSidebar}>
                      <Link to="/exchange/">
                        <span className={pageName == '/exchange/' ? 'cz-sidebarActive' : ''}>Exchange</span>
                      </Link>
                    </List.Item>
                    <div className="cz-expamd-main">
                      <List.Item as="a" className="nav-link" onClick={closeSidebar}>
                        <Link to="/community/">
                          <span className={pageName == '/community/' || communityToggle == true ? 'cz-sidebarActive' : ''}>Community</span>
                        </Link>
                      </List.Item>
                      <div className="cz-expand">
                        {communityToggle == false ? (
                          <span onClick={this.communityToggle}><Image src="/expand-svg.svg" /></span>
                        ) : (
                          <span className="cz-expand-cut" onClick={this.communityToggle}><Image src="/expand-active.svg" /></span>
                        )}
                      </div>
                    </div>
                    {/* {communityToggle */}
                    {/* // && ( */}
                    <div className={communityToggle ? ' cz-expanded-items cz-expanded-itemsActive' : 'cz-expanded-items'}>
                      <List.Item>
                        <Link to="/community/" onClick={closeSidebar}>
                          <Image src="/img/newsFeed.svg" /><span className={pageName == '/community/' ? 'cz-sidebarActive' : ''}>News Feed</span>
                        </Link>
                      </List.Item>
                      <List.Item as="a" className="nav-link">
                        <Link to="/categories/" onClick={closeSidebar}>
                          <Image src="/img/categories.svg" /><span className={pageName == '/categories/' ? 'cz-sidebarActive' : ''}>Categories</span>
                        </Link>
                      </List.Item>
                      <List.Item as="a" className="nav-link">
                        <Link to="/leaderboard/" onClick={closeSidebar}>
                          <Image src="/img/leaderboard.svg" /><span className={pageName == '/leaderboard/' ? 'cz-sidebarActive' : ''}>Leaderboard</span>
                        </Link>
                      </List.Item>
                      {userInfo && userInfo.id
                            && (
                              <div>
                                <List.Item as="a" className="nav-link">
                                  <Link to="/post/editor/new/" onClick={closeSidebar}>
                                    <Image src="/img/writeArticle.svg" /><span className={pageName == '/post/editor/new/' ? 'cz-sidebarActive' : ''}>Write article</span>
                                  </Link>
                                </List.Item>
                                <List.Item as="a" className="nav-link">
                                  <Link to="/profile/engagement/" onClick={closeSidebar}>
                                    <Image src="/img/myArtical.svg" /><span className={pageName == '/profile/engagement/' ? 'cz-sidebarActive' : ''}>Engagement</span>
                                  </Link>
                                </List.Item>
                                <List.Item as="a" className="nav-link">
                                  <Link to="/profile/my-articles/" onClick={closeSidebar}>
                                    <Image src="/img/myProfile.svg" /><span className={pageName == '/profile/my-articles/' ? 'cz-sidebarActive' : ''}>My Profile</span>
                                  </Link>
                                </List.Item>
                              </div>
                            )
                      }
                    </div>
                    {/* // ) */}
                    {/* } */}

                    <List.Item as="a" className="nav-link" onClick={closeSidebar}>
                      <Link to="/markets/">
                        <span className={pageName == '/markets/' ? 'cz-sidebarActive' : ''}>Markets</span>
                      </Link>
                    </List.Item>

                    {isAdmin && isAdmin.administrator
                      && (
                        <List.Item as="a" className="nav-link">
                          <Link to="/wallet/" onClick={closeSidebar}>
                            <span className={pageName == '/wallet/' ? 'cz-sidebarActive' : ''}>Wallet</span>
                          </Link>
                        </List.Item>
                      )}


                    <hr className="sidebar-divider" />
                    {userInfo && userInfo.id ? (
                      <div className="cz-sidebar-login">
                        <List.Item as="a" className="nav-link">
                          <Link to="/profile/settings/" onClick={closeSidebar}>
                            <Image src="/img/settings.svg" /><span className={pageName == '/profile/settings/' ? 'cz-sidebarActive' : ''}>Settings</span>
                          </Link>
                        </List.Item>
                        <List.Item as="a" className="nav-link" onClick={this.signOut}>
                          <Link to="" onClick={closeSidebar}>
                            <Image src="/img/logout.svg" /><span>Log Out</span>
                          </Link>
                        </List.Item>
                      </div>
                    ) : (
                      <div className="combinedBtn">
                        <button className="btn headerBtn headerBtn--login px-3 mb-2 mb-lg-0" type="button" onClick={this.loginUser}>Log In</button>
                        <button className="btn headerBtn px-3 mb-2 mb-lg-0" type="button" onClick={this.joinNow}>Join</button>
                      </div>
                    )
                    }
                    <LoginModal
                      open={openLoginModal}
                      close={this.closeLoginModal}
                    />
                  </List>
                </Grid.Row>
              </Segment>
            </Segment>

          </Sidebar>

          <Sidebar.Pusher
            onClick={() => {
              if (visible) closeSidebar();
            }}
            dimmed={visible}
          >
            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default withCookies(
  withRouter(
    connect(
      (state, ownProps) => ({
        visible: state.sidebar.visible,
        mode: state.sidebar.mode,
        userInfo: state.user.userInfo,
        cookies: ownProps.cookies,
        chatClient: state.chat.client,
        loadingChannels: state.chat.loadingChannels,
        isAdmin: state.user.userInfo.extra_capabilities,
        isAuthorized: state.user.userIsLogged
      }),
      dispatch => ({
        closeSidebar: () => {
          dispatch(actions.closeSidebar());
        },
        signOut: () => {
          dispatch(userSignOut());
        },
        getChannels: (params) => {
          dispatch(chatActions.getChannels(params));
        },
        clearChannels: () => {
          dispatch(chatActions.clearChannels());
        },
        resetModal: () => {
          dispatch(returnToLoginMode());
        }
      })
    )(SidebarCustom)
  )
);
