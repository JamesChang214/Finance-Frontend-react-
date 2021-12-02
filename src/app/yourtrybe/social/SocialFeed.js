import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { Container, Grid, Loader, Button } from 'semantic-ui-react';
import { setPageForGoogleAnalytics } from '../../util/helperFunctions';
import { getSocialFeed } from './SocialFeedActions';

import SocialPost from './SocialPost';


class SocialFeed extends Component {
  componentDidMount = () => {
    setPageForGoogleAnalytics('your-trybe/social-feed');
    this.fetchPosts();
  }

  componentDidUpdate = (prevProps) => {
    const { isPostSended, isLikeSending } = this.props;
    if( ( prevProps.isPostSended === false && isPostSended === true)
      || (prevProps.isLikeSending === true && isLikeSending === false)
    ) {
      this.fetchPosts();
      //TODO clear form
    }
  }

  fetchPosts = (more) => {
    const { getFeed, userInfo } = this.props;
    getFeed({
      userId: userInfo.id,
      more: more? true : false
    });
  }

  render() {
    const { isLoading, posts } = this.props;
    return (
      <Container fluid className="feed">
        <Grid>
          {
            posts.map( post => (
              <Grid.Row
                key={post.id}
                className="post"
              >
                <SocialPost {...post} />
              </Grid.Row>
            ))
          }
          <Grid.Row>
            <Loader active={isLoading} />
          </Grid.Row>
          <Grid.Row>
            { !isLoading
              && (
                <Button
                  className="load-more"
                  onClick={() => this.fetchPosts(true)}
                >Load More
                </Button>
              )
            }
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
export default withCookies(
  withRouter(
    connect(
      (state, ownProps) => {
        return {
          isLoading: state.socialFeed.loading,
          posts: state.socialFeed.posts,
          userInfo: state.user.userInfo,
          cookies: ownProps.cookies,
          isPostSended: state.socialFeed.postSuccessfullSended,
          isLikeSending: state.socialFeed.likeSending,
          latestId: state.socialFeed.latestId
        };
      },
      dispatch => ({
        getFeed: (params) => {
          dispatch( getSocialFeed(params) );
        }
      })
    )(SocialFeed)
  )
);
