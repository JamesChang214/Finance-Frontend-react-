import React, { PureComponent } from 'react';
import {
  Grid,
  Tab,
  List,
  Button,
  Image,
  Menu,
  Responsive
} from 'semantic-ui-react';

import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import * as actions from './FriendsActions';
import * as followingActions from '../following/FollowingActions';
import * as chatActions from '../../chat/ChatActions';
import { amIFollowing, setPageForGoogleAnalytics } from '../../util/helperFunctions';

class Friends extends PureComponent {
  componentDidMount() {
    setPageForGoogleAnalytics('your-trybe/friends');
    const { getFriends, userInfo, cookies, getRequests } = this.props;
    const token = cookies.get('trybe_jwt', {
      path: '/'
    });
    this.getFollowingAndFollowers();
    getFriends({ targetId: userInfo.id, token });
    getRequests({ targetId: userInfo.id, token });
  }

  componentDidUpdate = (prevProps) => {
    const { getFriends, cookies, userInfo, isLoadingSubscription } = this.props;
    if (
      prevProps.isLoadingSubscription === true
      && isLoadingSubscription === false
    ) {
      this.getFollowingAndFollowers();
      getFriends({
        targetId: userInfo.id,
        token: cookies.get('trybe_jwt', { path: '/' })
      });
    }

    const { client, getChannels, channelsLoaded } = this.props;
    if (client && !channelsLoaded) {
      getChannels({ client, userId: userInfo.id });
    }
  };

  getFollowingAndFollowers = () => {
    const { getFollowers, getFollowing, userInfo } = this.props;
    getFollowing({
      userId: userInfo.id,
      page: 1
    });

    getFollowers({
      userId: userInfo.id,
      page: 1
    });
  };

  followUnfollowClick = (isFollow, userId, targetId, i) => {
    const { follow, unfollow } = this.props;
    isFollow
      ? follow({ userId, targetId, index: i })
      : unfollow({ userId, targetId, index: i });
  };

  unfriendOrCancelClick = (areFriends, initiatorId, targetId) => {
    const { removeFriend, cookies, rejectFriendshipRequest } = this.props;
    const token = cookies.get('trybe_jwt', {
      path: '/'
    });
    areFriends
      ? removeFriend({ initiatorId, targetId, token })
      : rejectFriendshipRequest({ initiatorId, targetId, token });
  };

  acceptFriendshipClick = (initiatorId, targetId) => {
    const { cookies, acceptFriendshipRequest } = this.props;
    const token = cookies.get('trybe_jwt');
    acceptFriendshipRequest({ initiatorId, targetId, token });
  };

  writeMessageClick = (targetId) => {
    const { userInfo, loadTargetChannel, channels } = this.props;
    //loadTargetChannel
    loadTargetChannel({ userId: userInfo.id, targetId, channels });
    //changeChannel( getChatId(userInfo.id, targetId, channels) );
  };

  listOfUsers = (areFriends) => {
    const {
      userInfo,
      loadingIndexes,
      friends,
      requests,
      following
    } = this.props;
    const list = areFriends ? friends : requests;

    return (
      <List divided relaxed inverted>
        {list.map((item, i) => {
          const { avatar, id } = item;
          const slug = item.name;
          const name = item['display name'];
          const amIFollowingVar = amIFollowing(id, following);
          return (
            <List.Item key={slug}>
              <List.Content floated="right">
                {areFriends ? (
                  <Button
                    onClick={() => this.followUnfollowClick(
                      !amIFollowingVar,
                      userInfo.id,
                      id,
                      i
                    )
                    }
                    className={amIFollowingVar ? 'unfollow' : 'follow'}
                    loading={loadingIndexes[i]}
                  >
                    {amIFollowingVar ? 'Unfollow' : 'Follow'}
                  </Button>
                ) : (
                  <Button
                    onClick={() => this.acceptFriendshipClick(userInfo.id, id)}
                    className="unfollow"
                    loading={item.acceptFriendshipButtonLoading}
                  >
                    Accept Request
                  </Button>
                )}
                <Button
                  onClick={() => this.unfriendOrCancelClick(areFriends, userInfo.id, id)
                  }
                  className={areFriends ? 'unfriend' : 'cancel-request'}
                  loading={item.friendButtonLoading}
                >
                  {areFriends ? 'Unfriend' : 'Reject request'}
                </Button>
              </List.Content>
              <Image
                src={avatar}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'http://guidancegroup.co.in/img/mentors/default.jpg';
                }}
              />
              <List.Content>
                <List.Header>
                  <Link to={`/user/${id}/`}>{name}</Link> @ {slug}
                </List.Header>
                {/*<List.Description>N mutual friends</List.Description>*/}
              </List.Content>
            </List.Item>
          );
        })}
      </List>
    );
  };

  render() {
    const panes = [
      {
        menuItem: (
          <Menu.Item key="friends">
            <i className="fal fa-user-friends" />
            Friends
          </Menu.Item>
        ),
        render: () => {
          return (
            <Tab.Pane attached={false} loading={false}>
              {this.listOfUsers(true)}
            </Tab.Pane>
          );
        }
      },
      {
        menuItem: (
          <Menu.Item key="following">
            <i className="fal fa-handshake" />
            Pending
          </Menu.Item>
        ),
        render: () => {
          return (
            <Tab.Pane attached={false} loading={false}>
              {this.listOfUsers(false)}
            </Tab.Pane>
          );
        }
      }
    ];

    return (
      <Grid className="following-content">
        <Grid.Row>
          <Responsive
            maxWidth={Responsive.onlyTablet.maxWidth}
            as={Grid.Column}
            width="16"
            className="following-wrapper"
          >
            <Grid.Row className="tabs-panel">
              <Tab menu={{ text: true }} panes={panes} />
            </Grid.Row>
          </Responsive>

          <Responsive
            minWidth={Responsive.onlyComputer.minWidth}
            as={Grid.Column}
            width="12"
            className="following-wrapper"
          >
            <Grid.Row className="tabs-panel">
              <Tab menu={{ text: true }} panes={panes} />
            </Grid.Row>
          </Responsive>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withCookies(
  withRouter(
    connect(
      (state, ownProps) => {
        return {
          followers: state.following.followers,
          following: state.following.following,
          isLoadingSubscription: state.following.loadingSubscribe,
          loadingIndexes: state.following.loadingIndexes,
          friendsCount: state.friends.friendsCount,
          friends: state.friends.friends,
          requests: state.friends.requests,
          requestsCount: state.friends.requestsCount,
          userInfo: state.user.userInfo,
          cookies: ownProps.cookies,
          client: state.chat.client,
          channels: state.chat.channels,
          channelsLoaded: state.chat.channelsLoaded
        };
      },
      dispatch => ({
        getFriends: (params) => {
          dispatch(actions.getFriends(params));
        },
        getRequests: (params) => {
          dispatch(actions.getRequests(params));
        },
        requestFriendship: (params) => {
          dispatch(actions.requestFriendship(params));
        },
        rejectFriendshipRequest: (params) => {
          dispatch(actions.rejectFriendshipRequest(params));
        },
        cancelFriendshipRequest: (params) => {
          dispatch(actions.cancelFriendshipRequest(params));
        },
        acceptFriendshipRequest: (params) => {
          dispatch(actions.acceptFriendshipRequest(params));
        },
        removeFriend: (params) => {
          dispatch(actions.removeFriend(params));
        },
        getFollowing: (params) => {
          dispatch(followingActions.getFollowing(params));
        },
        getFollowers: (params) => {
          dispatch(followingActions.getFollowers(params));
        },
        follow: (params) => {
          dispatch(followingActions.follow(params));
        },
        unfollow: (params) => {
          dispatch(followingActions.unfollow(params));
        },
        getChannels: (params) => {
          dispatch(chatActions.getChannels(params));
        },
        changeChannel: (params) => {
          dispatch(chatActions.changeChannel(params));
        },
        loadTargetChannel: (params) => {
          dispatch(chatActions.loadTargetChannel(params));
        }
      })
    )(Friends)
  )
);
