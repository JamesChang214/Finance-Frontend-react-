import React, { Component } from 'react';
import { Grid, Responsive, List, Button, Image } from 'semantic-ui-react';
import {
  NavLink,
  Link,
  withRouter
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { userSignOut } from '../../user/userActions';
// import { setUserData } from '../../user-review/userReviewActions';

class SideControl extends Component {
  constructor(props) {
    super(props);
    const theme = window.localStorage.getItem('trybe_theme') ? window.localStorage.getItem('trybe_theme') : 'light';
    this.state = {
      lightTheme: theme === 'light' ? true : false
    };
  }

  componentDidUpdate() { }

  signOut() {
    const { cookies, signOut } = this.props;
    localStorage.clear();
    cookies.remove('trybe_jwt', {
      path: '/'
    });
    signOut();
  }

  closeSidebar() {
    const { sidebarOpened } = this.state;
    console.log(sidebarOpened);
    this.setState({ sidebarOpened: !sidebarOpened });
  }


  // const SideControl = ({ url, navigator, pageName }) => {
  //   const BaseComponent = navigator ? NavLink : Link;
  //   function signOut() {
  //     // { ...state, userIsLogged: false, userInfo: {}, token: null }
  //     // setUserData({ userIsLogged: false, userInfo: {}, token: null })
  //     console.log('signout')
  //     // this.setState({
  //     //   token: null,
  //     //   userIsLogged: false,
  //     //   userInfo: {}
  //     // })
  //   }
  render() {
    const { userInfo } = this.props;
    const { sidebarOpened } = this.state;
    // const { lightTheme } = this.state;
    const pageName = window.location.pathname;
    return (
      <Grid className={sidebarOpened ? 'page-sidebar cztoggle-menu-web cz-sidebar-expanded' : 'page-sidebar cztoggle-menu-web'}>
        <React.Fragment>
          <a className="navbar-brand fw-bold cz-sidebar-logo" href="/">
            <img src="/img/logo.svg" alt="" />
          </a>
          <Grid.Row>
            {/* <Grid className="page-sidebar"> */}
            <List link inverted className="sidebar-list">
              <List.Item>
                <Link to="/">
                  <Image src="/img/logo-header.png" alt="" className="sidebarLogo" />
                </Link>
              </List.Item>
              <List.Item as="a" className="nav-link">
                <Link to="/community/">
                  <Image src="/img/newsFeed.svg" /><span className={pageName == '/community/' ? 'cz-sidebarActive' : ''}>News Feed</span>
                </Link>
              </List.Item>
              <List.Item as="a" className="nav-link">
                <Link to="/categories/">
                  <Image src="/img/categories.svg" /><span className={pageName == '/categories/' ? 'cz-sidebarActive' : ''}>Categories</span>
                </Link>
              </List.Item>
              <List.Item as="a" className="nav-link">
                <Link to="/leaderboard/">
                  <Image src="/img/leaderboard.svg" /><span className={pageName == '/leaderboard/' ? 'cz-sidebarActive' : ''}>Leaderboard</span>
                </Link>
              </List.Item>
              {userInfo && userInfo.id && (
                <div>
                  <hr className="sidebar-divider" />
                  <List.Item as="a" className="nav-link">
                    <Link to="/post/editor/new/">
                      <Image src="/img/writeArticle.svg" /><span className={pageName == '/post/editor/new/' ? 'cz-sidebarActive' : ''}>Write Article</span>
                    </Link>
                  </List.Item>
                  <List.Item as="a" className="nav-link" fluid>
                    <Link to="/profile/engagement/">
                      <Image src="/img/myArtical.svg" /><span className={pageName == '/profile/engagement/' ? 'cz-sidebarActive' : ''}>Engagement</span>
                    </Link>
                  </List.Item>
                  <List.Item as="a" className="nav-link">
                    <Link to="/profile/my-articles/">
                      <Image src="/img/myProfile.svg" /><span className={pageName == '/profile/my-articles/' ? 'cz-sidebarActive' : ''}>My Profile</span>
                    </Link>
                  </List.Item>
                  <hr className="sidebar-divider" />
                  <List.Item as="a" className="nav-link">
                    <Link to="/profile/settings/">
                      <Image src="/img/settings.svg" /><span className={pageName == '/profile/settings/' ? 'cz-sidebarActive' : ''}>Settings</span>
                    </Link>
                  </List.Item>
                  <List.Item as="a" className="nav-link" onClick={() => this.signOut()}>
                    <Link to="">
                      <Image src="/img/logout.svg" /><span>Log Out</span>
                    </Link>
                  </List.Item>
                </div>
              )}
            </List>
            <Button className="sidebarToggle" onClick={() => this.closeSidebar()}><Image src="/collapse.svg" /></Button>
          </Grid.Row>
        </React.Fragment>
      </Grid>
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
      }),
      dispatch => ({
        signOut: () => {
          dispatch(userSignOut());
        },
      })
    )(SideControl)
  )
);