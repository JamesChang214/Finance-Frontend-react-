import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Container, Grid, Loader } from 'semantic-ui-react';
import { withCookies } from 'react-cookie';
import Helmet from 'react-helmet';
import * as actions from './userReviewActions';
import PersonSummary from './components/PersonSummary';
import * as followActions from '../yourtrybe/following/FollowingActions';
import Feed from '../util/feed/Feed';

class UserReview extends Component {
  componentDidMount() {
    const {
      match,
      getUserData,
      selfUserInfo,
      history,
      isAuthorized,
      cookies
    } = this.props;
    const { id } = match.params;
    const token = cookies.get('trybe_jwt');
    id == selfUserInfo.id && history.push('/profile');

    if (isAuthorized) {
      getUserData({ id, token, userId: selfUserInfo.id });
    }
      this.getFollowingAndFollowers();
    document.querySelector('.app-body').scrollTop = 0;
  }

  componentDidUpdate(prevProps) {
    const {
      selfUserInfo,
      isAuthorized,
      cookies,
      subscriptionSuccessfull,
      match,
      getUserData,
      history
    } = this.props;
    const { id } = match.params;
    id == selfUserInfo.id && history.push('/profile');
    const token = cookies.get('trybe_jwt');

    if (
      (isAuthorized && isAuthorized !== prevProps.isAuthorized)
      || (prevProps.subscriptionSuccessfull === false
        && subscriptionSuccessfull === true)
    ) {
      getUserData({ id, token, userId: selfUserInfo.id });
    }
  }

  componentWillUnmount() {
    const { clearUserData } = this.props;
    clearUserData();
  }

  getFollowingAndFollowers = () => {
    const { getFollowing, getFollowers, match } = this.props;
    const { id } = match.params;
    getFollowing({
      userId: id,
      page: 1
    });

    getFollowers({
      userId: id,
      page: 1
    });
  }

  //если нажать "назад" в браузере и вернуться на этот компонент, то вызывается только render() поэтому нужен этот метод
  updateState() {
    const { setUserData, getUserData, selfUserInfo, cookies, userInfo, match } = this.props;
    const { id } = userInfo;
    if (!id) {
      const token = cookies.get('trybe_jwt');
      const cachedInfo = JSON.parse(localStorage.getItem('trybe_user_review'));
      //console.log(cachedInfo.id, this.props.match.params.id);
      if (cachedInfo && cachedInfo.id == match.params.id) {
        setUserData(cachedInfo);
      } else {
        getUserData({
          id: match.params.id,
          token,
          userId: selfUserInfo.id
        });
      }
    }
  }

  friendshipRequestClick() {
    const { userInfo, selfUserInfo, requestFriendship, cookies } = this.props;
    const token = cookies.get('trybe_jwt');
    requestFriendship({
      initiatorId: selfUserInfo.id,
      targetId: userInfo.id,
      token
    });
  }

  render() {
    const { isAuthorized, userInfo, followers, following } = this.props;
    const {
      id,
      avatar_urls,
      details,
      name,
      slug,
      description
    } = userInfo;
    
    const refUrl = `${window.location.protocol}//${window.location.hostname}?ref=${id}`;
    const follow_count = {following: following.length, followers: followers.length}
    this.updateState();
    return (
      <Container fluid className="user-review-wrapper cz-user-review-wrapper">
        <Grid>
          {id ? (
            <Grid.Row>
              <Helmet>
                <title>{name ? 'Loop: ' + name : 'Loop:'}</title>
                <meta httpEquiv="ScreenOrientation" content="autoRotate:disabled" />
                <meta name="title" content={(name).replace(/(<([^>]+)>)/ig, '')} />
                <meta name="description" content={(description).replace(/(<([^>]+)>)/ig, '')} />
                <meta property="og:site_name" content="Loop" />
                <meta property="og:url" content={`https://www.loop.markets/user/${id}/`} />
                <meta property="og:type" content="profile" />
                <meta property="og:title" content={(name).replace(/(<([^>]+)>)/ig, '')} />
                <meta property="og:description" content={(description).replace(/(<([^>]+)>)/ig, '')} />
                <meta property="og:image" content={avatar_urls[96]} />
                {/* Twitter Card Data */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content={`https://www.loop.markets/user/${id}/`} />
                <meta name="twitter:title" content={(name).replace(/(<([^>]+)>)/ig, '')} />
                <meta name="twitter:description" content={(description).replace(/(<([^>]+)>)/ig, '')} />
                <meta name="twitter:image" content={avatar_urls[96]} />
                {/* Start of loopfinance Zendesk Widget script */}
                <script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=6c0c34a0-c54f-4cfa-94d8-480e9d57cc24" />
                {/* End of loopfinance Zendesk Widget script */}
              </Helmet>
              <Grid.Column width="16">
                <PersonSummary
                  avatarURL={avatar_urls[96]}
                  details={details}
                  name={name}
                  slug={slug}
                  refUrl={refUrl}
                  description={description}
                  isAuthorized={isAuthorized}
                  followers={follow_count?.followers}
                  following={follow_count?.following}
                />
              </Grid.Column>
              <Grid.Column width="16">
                <Feed queryParams={`&author=${id}&cache=false`} />
              </Grid.Column>
            </Grid.Row>
          ) : (
            <Loader active />
          )}
        </Grid>
        {/* {" " + this.props.match.params.id} */}
      </Container>
    );
  }
}
export default withCookies(
  withRouter(
    connect(
      (state, ownProps) => {
        return {
          userInfo: state.userReview.userInfo,
          selfUserInfo: state.user.userInfo,
          isAuthorized: state.user.userIsLogged,
          token: state.user.token,
          cookies: ownProps.cookies,
          subscriptionSuccessfull: state.following.subscriptionSuccessfull,
          followers: state.following.followers,
          following: state.following.following
        };
      },
      dispatch => ({
        getUserData: (params) => {
          dispatch(actions.getUserData(params));
        },
        clearUserData: () => {
          dispatch(actions.clearUserData());
        },
        setUserData: (params) => {
          dispatch(actions.setUserData(params));
        },
        getFollowing: (params) => {
          dispatch(followActions.getFollowing(params));
        },
        getFollowers: (params) => {
          dispatch(followActions.getFollowers(params));
        }
      })
    )(UserReview)
  )
);
