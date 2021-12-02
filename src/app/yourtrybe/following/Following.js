import React, { PureComponent } from 'react';
import { Grid, Tab, List, Icon, Button, Image, Menu, Responsive } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import * as actions from './FollowingActions';
import { amIFollowing, setPageForGoogleAnalytics } from '../../util/helperFunctions';

class Following extends PureComponent {
  componentDidMount = () => {
    setPageForGoogleAnalytics('your-trybe/following');
    this.getFollowingAndFollowers();
  }

  componentDidUpdate = (prevProps) => {
    const { isLoadingSubscription } = this.props;
    if( prevProps.isLoadingSubscription === true && isLoadingSubscription === false ) {
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

  listOfUsers = (areFollowers) => {
    const { userInfo, loadingIndexes, followers, following } = this.props;
    const list = areFollowers? followers : following;

    return (
      <List divided relaxed inverted>
        {
          list.map( (item, i) => {
            const { slug, avatarUrl, name, id } = item.person;
            return (
              <List.Item key={slug}>
                
                <Image
                  src={avatarUrl}
                  onError={(e) => { e.target.onerror = null; e.target.src='http://guidancegroup.co.in/img/mentors/default.jpg'; }}
                />
                <List.Content>
                  <List.Header>
                    <Link to={`/user/${id}/`}>{name}</Link>
                  </List.Header>
                  {/*<List.Description>N mutual friends</List.Description>*/}
                </List.Content>
                <List.Content floated="right">
                  <Button
                    onClick={() => this.followUnfollowClick( areFollowers, userInfo.id, id, i )}
                    className={areFollowers? 'follow' : 'unfollow'}
                    loading={loadingIndexes[i]}
                    disabled={areFollowers? amIFollowing(id, following) : false}
                  >
                    {areFollowers? 'Follow' : 'Unfollow'}
                  </Button>
                </List.Content>
              </List.Item>
            );
          })
        }
      </List>
    );
  }

  followUnfollowClick = (isFollow, userId, targetId, i) => {
    const { follow, unfollow, cookies } = this.props;
    const token = cookies.get('trybe_jwt', { path: '/' });
    if(isFollow) follow({ userId, targetId, index: i, token: token  });
    else unfollow({ userId, targetId, index: i, token: token });
  }

  render() {
    const panes = [
      {
        menuItem: (
          <Menu.Item key="following" className="cz-key-follow">
            <Image src="/following.svg" alt=""/><Image className="cz-img-act" src="/following-act.svg" alt=""/>I’m following
          </Menu.Item>
        ),
        render: () => {
          return (
            <Tab.Pane
              attached={false}
              loading={false}
            >{this.listOfUsers(false)}
            </Tab.Pane>
          );
        }
      },
      {
        menuItem: (
          <Menu.Item key="followers" className="cz-key-follow">
            <Image src="/followers.svg" alt=""/><Image className="cz-img-act" src="/followers-act.svg" alt=""/>My followers
          </Menu.Item>
        ),
        render: () => {
          return (
            <Tab.Pane
              attached={false}
              loading={false}
            >{this.listOfUsers(true)}
            </Tab.Pane>
          );
        }
      }
    ];

    return (
      <Grid className="following-content cz-following-content">
        <Grid.Row>
          {/* <Responsive
            maxWidth={Responsive.onlyTablet.maxWidth}
            as={Grid.Column}
            width="16"
            className="following-wrapper"
          >
            <Grid.Row className="tabs-panel">
              <Tab
                menu={{ text: true }}
                panes={panes}
              />
            </Grid.Row>

          </Responsive> */}

          <Responsive
            
            as={Grid.Column}
            width="16"
            className="following-wrapper"
          >
            <Grid.Row className="tabs-panel">
              <Tab
                menu={{ text: true }}
                panes={panes}
              />
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
          isLoadingFollowers: state.following.loadingList,
          isLoadingSubscription: state.following.loadingSubscribe,
          loadingIndexes: state.following.loadingIndexes,
          userInfo: state.user.userInfo,
          cookies: ownProps.cookies,
        };
      },
      dispatch => ({
        getFollowing: (params) => {
          dispatch( actions.getFollowing(params) );
        },
        getFollowers: (params) => {
          dispatch( actions.getFollowers(params) );
        },
        follow: (params) => {
          dispatch( actions.follow(params) );
        },
        unfollow: (params) => {
          dispatch( actions.unfollow(params) );
        }
      })
    )(Following)
  )
);