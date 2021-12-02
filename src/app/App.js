import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import './all.scss';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import ReactGA from 'react-ga';
import Helmet from 'react-helmet';
import ScrollToTop from './ScrollToTop';
//import Presale from './presale/Presale';
// import Portfolio from './portfolio/Portfolio';
// import Airdrops from './airdrops/Airdrops';
import Wallet from './wallet/Wallet';
import Header from './header/Header';
import Home from './home/Home';
import About from './pages/about/About';
import Rules from './pages/rules/Rules';
import HowTrybeWorks from './pages/how-trybe-work/page';
import MostPopular from './pages/most-popular-articles/page';
import marketsPage from './pages/markets/marketsView';
import tokenPage from './pages/markets/tokenView';
import exchangePage from './pages/exchange';
import Footer from './footer/Footer';
import Feed from './util/feed/Feed';
import YourTrybe from './yourtrybe/YourTrybe';
import SignUp from './sign-up/SignUp';
import Sidebar from './sidebar/Sidebar';
import Chat from './chat/Chat';
import CreateChat from './chat/CreateChat';
import Post from './post/Post';
import VisualEditor from './post/editor/visualEditorNew';
import VisualEditorEdit from './post/editor/visualEditorEdit';
import * as userActions from './user/userActions';
import UserReview from './user-review/UserReview';
import { decodeExpirationFromToken } from './util/UtilSaga';
import UpdateArticle from './update-article/UpdateArticle';
import CreateArticle from './create-article/CreateArticle';
//import RealtimeNotification from './sidebar/notifications/RealtimeNotification';
import Articles from './yourtrybe/articles/Articles';
import Page404 from './util/404';
import Category from './pages/categories';
import Category_sigle from './pages/categories/category';
import Leaderboard from './pages/leaderboard';

import { initWithTheme } from './themes';
import preChosenCategories from './preChosenCategories';
import communityProfile from './yourtrybe/articles/communityProfile';
import BugReport from './bugreport/BugReport';
import ImageEditor from './post/editor/imageEditor';

function initializeReactGA() {
  ReactGA.initialize('UA-103677783-4');
  ReactGA.pageview('/home');
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollPosition: false,
    };
  }

  componentDidMount() {
    const { getUserData, cookies, forceUserLogin, setHeader } = this.props;

    initWithTheme();
    initializeReactGA();

    const ref = new URLSearchParams(document.location.search).get('ref');
    ref && localStorage.setItem('trybe_ref', ref);
    const token = cookies.get('trybe_jwt', {
      path: '/'
    });
    //do we have user's auth token in cookies
    if (token && token !== 'null') {
      //expiration check
      if (decodeExpirationFromToken(token) <= Date.now()) {
        // TODO: message user to relogin
        console.log(
          'token was expired',
          decodeExpirationFromToken(token),
          Date.now()
        );
        cookies.remove('trybe_jwt', {
          path: '/'
        });
        return;
      }
      //get user info from cache
      const cachedUserInfo = JSON.parse(localStorage.getItem('trybe_user'));
      if (cachedUserInfo && !isEmpty(cachedUserInfo)) {
        //show cached info to user if it exists
        forceUserLogin(cachedUserInfo);
      }
      //get a real info anyway
      getUserData(token);
    }

  }

  componentDidUpdate(prevProps) {
    //get token and cookies
    const { token, getUserData, cookies, userInfo, isAuthorized } = this.props;
    const cookie = cookies.get('trybe_jwt', {
      path: '/'
    });

    if (token !== prevProps.token && token) {
      //get user data if token is new
      getUserData(token);

      //check if cookie dont exists or should be renewed
      if (!cookie || token !== cookie || cookie === 'null') {
        cookies.set('trybe_jwt', token, {
          path: '/',
          expires: new Date(Date.now() + 10000000000)
        });
      }
      //in case we've got new user info we should update cache
      if (userInfo !== prevProps.userInfo && !isEmpty(userInfo)) {
        localStorage.setItem('trybe_user', JSON.stringify(userInfo));
        //this.setState({ userInfo });
      }
      if (prevProps.isAuthorized !== isAuthorized) {
        localStorage.setItem('trybe_user', JSON.stringify(userInfo));
      }
    }
  }

  listenScrollEvent(e) {
    const { setHeader } = this.props;
    const pageName = window.location.pathname;
    if (e.target.scrollTop > 10) {
      this.setState({ scrollPosition: true });
      setHeader(true);
    } else {
      this.setState({ scrollPosition: false });
      setHeader(false);
    }
  }

  render() {
    const { isAdmin } = this.props;
    const { scrollPosition } = this.state;
    const pageName = window.location.pathname;
    const hostName = window.location.origin;
    return (
      <Router>
        <div className="app">
          <ScrollToTop />
          <Helmet>
            <title>Loop Finance{pageName == '/profile' ? ' | Profile' : ''}{pageName == '/profile/my-articles' ? ' | My Article' : ''}{pageName == '/profile/settings' ? ' | Settings' : ''}{pageName == '/post/editor/new' ? ' | Write Article' : ''}</title>
            <meta property="og:site_name" content="Loop. The Terra Community." />
            <meta property="og:url" content="https://loop.markets/" />
            <meta property="og:image" content={`${hostName}/img/loop_the_terra_community.png`} />
            <meta property="og:type" content="business.business" />
            <meta property="og:description" content="Start Earning tokens by Joining Us." />

            <meta name="twitter:title" content="Loop. The Terra Community." />
            <meta name="twitter:description" content="Start Earning tokens by Joining Us." />
            <meta name="twitter:image" content={`${hostName}/img/loop_the_terra_community.png`} />
            <meta name="twitter:card" content={`${hostName}/img/loop_the_terra_community.png`} />
            {/* Start of loopfinance Zendesk Widget script */}
            <script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=6c0c34a0-c54f-4cfa-94d8-480e9d57cc24" />
            {/* End of loopfinance Zendesk Widget script */}
          </Helmet>
          <Sidebar>
            <Header scrollPosition={scrollPosition} />
            <div className="app-body" onScroll={this.listenScrollEvent.bind(this)}>
              <Switch>
                <Route path="/feed/" exact component={Feed} />
                <Route path="/markets/" component={marketsPage} />
                <Route path="/token/:id/" component={tokenPage} />
                <Route path="/exchange/" component={exchangePage} />
                <Route path="/categories/" component={Category} />
                <Route path="/category/:id/" component={Category_sigle} />
                <Route path="/leaderboard/" component={Leaderboard} />
                {/*isAdmin && (isAdmin.administrator) && <Route path="/wallet/" component={Wallet} />*/}
                <Route path="/profile/" component={YourTrybe} />
                <Route path="/create-article/" component={CreateArticle} />
                <Route path="/post/editor/new/" component={VisualEditor} />
                <Route path="/imageEditor" component={ImageEditor} />
                <Route path="/post/editor/edit/:id/" component={VisualEditorEdit} />
                <Route path="/chat/" component={Chat} />
                <Route path="/create-chat/" component={CreateChat} />
                <Route path="/" exact component={Home} />
                <Route path="/most-popular-articles/" component={MostPopular} />
                <Route
                  path="/how-trybe-works/"
                  exact
                  component={HowTrybeWorks}
                />
                <Route path="/about-us/" exact component={About} />
                <Route path="/rules/" exact component={Rules} />
                <Route path="/user/:id/" component={UserReview} />
                <Route path="/edit-article/:id/" component={UpdateArticle} />
                <Route path="/sign-up/" component={SignUp} />
                <Route path="/communityProfile/" component={communityProfile} />
                <Route
                  path="/community/"
                  render={() => (
                    <Container fluid className="your-trybe-wrapper">
                      <Articles preChosenCategories={preChosenCategories} />
                    </Container>
                  )}
                />
                <Route path="/404/" component={Page404} />
                {/* <Route exact path="/post/:id" component={Post} /> */}
                <Route component={Post} />
              </Switch>
              {/* <Footer /> */}
            </div>
            <BugReport />
          </Sidebar>
        </div>
      </Router>
    );
  }
}

export default withCookies(
  connect(
    (state, ownProps) => {
      return {
        userInfo: state.user.userInfo,
        isAuthorized: state.user.userIsLogged,
        token: state.user.token,
        cookies: ownProps.cookies,
        identity: state.scatter.get('identity'),
        acctName: state.user.userInfo.eosAccount,
        isAdmin: state.user.userInfo.extra_capabilities,
        scrollPosition: false,
        sidebarOpened: true
      };
    },
    dispatch => ({
      login: (params) => {
        dispatch(userActions.postLogin(params));
      },
      setHeader: (params) => {
        dispatch(userActions.setScroll(params));
      },
      getUserData: (params) => {
        dispatch(userActions.getUserData(params));
      },
      forceUserLogin: (params) => {
        dispatch(userActions.forceUserLogin(params));
      }
    })
  )(App)
);
