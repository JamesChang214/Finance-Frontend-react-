import React, { Component } from 'react';
import { Container, Grid, Responsive, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { setPageForGoogleAnalytics } from '../util/helperFunctions';
import * as followActions from './following/FollowingActions';
import Articles from './articles/Articles';
import Following from './following/Following';
import PersonSummary from './components/PersonSummary';
import MyArticles from './my-articles/MyArticles';
import Settings from './settings/Settings';

class YourTrybe extends Component {
  componentDidMount() {
    setPageForGoogleAnalytics('your-trybe');
    this.getFollowingAndFollowers();
  }

  componentDidUpdate = (prevProps) => {
    const { userIsLogged } = this.props;
    if( prevProps.userIsLogged !== userIsLogged ) {
      this.getFollowingAndFollowers();
    }
  }

  getFollowingAndFollowers = () => {
    const { getFollowing, getFollowers, userInfo } = this.props;
    getFollowing({
      userId: userInfo.id,
      page: 1
    });

    getFollowers({
      userId: userInfo.id,
      page: 1
    });
  }

  render() {
    const { userInfo, userIsLogged, following, followers } = this.props;
    const follow_count = {following: following.length, followers: followers.length}
    const { description, id } = userInfo;
    const refUrl = `${window.location.protocol}//${window.location.hostname}?ref=${id}`;
    /*
    const userHelper = (
      <div>
        <div className="ui divider" />
        <Image src="../../../binance.jpg" href="http://bit.ly/2JT0vLD" size="large" className="trybe_runner" />
        <Image src="../../../coinbase.jpg" href="http://bit.ly/2wzJxcE" size="large" className="trybe_runner" />
        <div className="ui divider" />
      </div>
    );
    */

    return (
      <Container fluid className="your-trybe-wrapper">
        {userIsLogged && userInfo ? (
          <Grid>
            <PersonSummary
              avatarURL={userInfo.avatar_urls[96]}
              name={userInfo.name}
              slug={userInfo.slug}
              details={userInfo.details}
              refUrl={refUrl}
              description={description}
              followers={follow_count?.followers}
              following={follow_count?.following}
            />
            {/* <Grid.Row className="content">

              <Responsive
                maxWidth={992}
                as={Grid.Column}
                width="16"
                className="main-wrapper"
              >
                <Switch>
                  <Route path="/profile/articles" component={Articles} />
                  <Route path="/profile/my-articles" component={MyArticles} />
                  <Route path="/profile/following" component={Following} />
                  <Route path="/profile/settings" component={Settings} />
                </Switch>
              </Responsive>

              <Responsive
                minWidth={992}
                as={Grid.Column}
                width="16"
                className="main-wrapper"
              >
                <Switch>
                  <Route path="/profile/articles" component={Articles} />
                  <Route path="/profile/my-articles" component={MyArticles} />
                  <Route path="/profile/following" component={Following} />
                  <Route path="/profile/settings" component={Settings} />
                </Switch>
              </Responsive>


            </Grid.Row> */}
          </Grid>
        ) : (
          <Loader />
        )}
      </Container>
    );
  }
}

export default withRouter(
  connect((state) => {
    return {
      userInfo: state.user.userInfo,
      userIsLogged: state.user.userIsLogged,
      followers: state.following.followers,
      following: state.following.following
    };
  },
  dispatch => ({
    getFollowing: (params) => {
      dispatch(followActions.getFollowing(params));
    },
    getFollowers: (params) => {
      dispatch(followActions.getFollowers(params));
    }
  }))(YourTrybe)
);
