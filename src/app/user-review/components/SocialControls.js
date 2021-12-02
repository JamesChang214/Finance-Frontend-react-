import React, { PureComponent } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { follow, unfollow } from '../../yourtrybe/following/FollowingActions';

class SocialControls extends PureComponent {
  handleClick = () => {
    const { cookies, userInfo, selfUserInfo, followUser, unfollowUser } = this.props;
    const token = cookies.get('trybe_jwt');
    if (userInfo.amIFollowing) {
      unfollowUser({ userId: selfUserInfo.id, targetId: userInfo.id, token });
    } else {
      followUser({ userId: selfUserInfo.id, targetId: userInfo.id, token });
    }
  };

  render() {
    const { userInfo, isLoadingSubscription, gettingUserReviewData } = this.props;
    const followLabel = !userInfo.amIFollowing ? <span><b>+</b> Follow</span> : <span>Following</span>;
    const followClass = !userInfo.amIFollowing ? 'social-controls-red' : 'social-controls-following';
    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'FollowByUserPage',
        action: 'click',
        label: 'follow',
        value: 1
      }
    });
    return (
      <div className={followClass} cz-circular>
        <Button
          className="userFollowTag"
          icon
          circular
          floated="right"
          loading={isLoadingSubscription || gettingUserReviewData}
          onClick={this.handleClick}
        >
          {followLabel}
        </Button>
      </div>
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
          isLoadingSubscription: state.following.loadingSubscribe,
          cookies: ownProps.cookies,
          gettingUserReviewData: state.userReview.loading
        };
      },
      dispatch => ({
        followUser: (params) => {
          dispatch(follow(params));
        },
        unfollowUser: (params) => {
          dispatch(unfollow(params));
        }
      })
    )(SocialControls)
  )
);
