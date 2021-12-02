import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Grid, Image } from 'semantic-ui-react';
import { withCookies } from 'react-cookie';
import { setPageForGoogleAnalytics } from '../helperFunctions';
import * as feedActions from './feedActions';
import { setPostInfo } from '../../post/postActions';
import PostsList from './components/PostsList';

class Feed extends PureComponent {
  constructor(props) {
    super(props);
    this.defaultClickHandler = this.defaultClickHandler.bind(this);
    this.state = {
      currentPage: 0,
      tabNameSame: '',
      listener: false
    };
  }

  componentDidMount() {
    const { tabName } = this.props;
    setPageForGoogleAnalytics('articles');
    const el = document.querySelector('.app-body');
    el.addEventListener('scroll', this.onScroll);
    this.uploadNewPosts();
    this.setState({ tabNameSame: tabName, listener: true });
  }

  componentDidUpdate(props) {
    const { queryParams, isEnd, loadmore } = this.props;
    const { listener } = this.state;
    if (props.queryParams != queryParams) {
      this.queryParamsChanged();
    }
    if (loadmore === false) {
      const el = document.querySelector('.app-body');
      el.removeEventListener('scroll', this.onScroll);
    }
    if (isEnd && listener) {
      const el = document.querySelector('.app-body');
      el.removeEventListener('scroll', this.onScroll);
    }
    if (!isEnd && !listener) {
      const el = document.querySelector('.app-body');
      el.addEventListener('scroll', this.onScroll);
    }
  }

  componentWillUnmount() {
    const { clearPosts } = this.props;
    clearPosts();
    const el = document.querySelector('.app-body');
    el.removeEventListener('scroll', this.onScroll);
  }

  onScroll = ({ target }) => {
    const { isLoading } = this.props;
    // localStorage.setItem('communityScroll', target.scrollTop)
    if (
      window.innerHeight + target.scrollTop >= target.scrollHeight - 4000
      && !isLoading
    ) {
      this.uploadNewPosts();
    }
  };

  queryParamsChanged() {
    const { clearPosts } = this.props;
    clearPosts();
    this.uploadNewPosts(1);
  }

  uploadNewPosts(page) {
    const { getPosts, cookies, queryParams, tabName, isEnd, isAuthorized } = this.props;
    const { tabNameSame, currentPage } = this.state;
    const pageName = window.location.pathname;
    const newPage = page ? page : tabNameSame != tabName ? 1 : currentPage + 1;

    isEnd ? this.setState({ listener: false }) : this.setState({ listener: true });

    this.setState({ currentPage: newPage, tabNameSame: tabName });
    //getPosts({ page: newPage, queryParams }, cookies.get('trybe_jwt'));
    getPosts({ page: newPage, queryParams }, pageName == '/profile/my-articles/' ? cookies.get('trybe_jwt') : null);

    // const pageName = window.location.pathname;
    // if (pageName == '/community/') {
    //   let feedScroll = localStorage.getItem('communityScroll')
    //   console.log(feedScroll);
    //   console.log('helo wordl')
    //   if (feedScroll) {
    //     document.querySelector(".app-body").scrollTo(0, feedScroll)
    //   }
    // }
  }

  defaultClickHandler(postInfo) {
    const { setPost } = this.props;
    setPost(postInfo);
    //history.push(`/${postInfo.slug}`);
  }

  render() {
    const { postsData, clickHandler, isLoading, isEnd, noAuthor } = this.props;
    const pageName = window.location.pathname;
    return (
      <Container className="feed cz-con-new">
        {pageName == '/'
          ? (
            <PostsList
              className="posts-list"
              posts={postsData}
              isLoaderActive={isLoading}
              noAuthor={noAuthor}
              clickHandler={
                clickHandler
                  ? clickHandler
                  : this.defaultClickHandler
              }
            />
          )
          : (
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Container>
                    {postsData[0] ? (
                      <PostsList
                        className="posts-list"
                        posts={postsData}
                        isLoaderActive={isLoading}
                        noAuthor={noAuthor}
                        clickHandler={
                          clickHandler
                            ? clickHandler
                            : this.defaultClickHandler
                        }
                      />
                    ) : (
                      !isEnd && (
                        <div class="ui segment my-feeds-loader">
                          <div class="ui active dimmer">
                            <div class="ui indeterminate text loader"></div>
                          </div>
                          <p></p>
                        </div>
                      )
                    )}
                    {isLoading && (
                      <div class="ui segment my-feeds-loader">
                        <div class="ui active dimmer">
                          <div class="ui indeterminate text loader"></div>
                        </div>
                        <p></p>
                      </div>
                    )}
                    {noAuthor && (
                      <div style={{ textAlign: 'center', color: '#fff', padding: '20px' }}>
                        <h4>Error Loading Feed</h4>
                        <p>Sorry we seem to be having an issue loading your feed right now, please try again in a little while. <br /> If you feel this is a bug, please report the problem here - <a href="https://loopfinance.zendesk.com/hc/en-us/community/topics" target="_blank" style={{ color: "var(--pink)", fontWeight: "bolder" }}>Bugs &amp; Feedback</a></p>
                      </div>
                    )}
                  </Container>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          )}
      </Container>
    );
  }
}
export default withCookies(
  withRouter(
    connect(
      (state, ownProps) => ({
        isLoading: state.feed.loading,
        isEnd: state.feed.isEnd,
        noAuthor: state.feed.noAuthor,
        postsData: state.feed.posts,
        isAuthorized: state.user.userIsLogged,
        cookies: ownProps.cookies
      }),
      dispatch => ({
        getPosts: (params, token) => {
          dispatch(feedActions.getPostsRoutine({ params, token }));
        },
        clearPosts: () => {
          dispatch(feedActions.clearPostsRoutine());
        },
        setPost: (postInfo) => {
          dispatch(setPostInfo(postInfo));
        }
      })
    )(Feed)
  )
);
