import React, { PureComponent } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { Loader, Container, Grid, Image, Rating, Tab, Divider, Icon, Button, Header, Pagination } from 'semantic-ui-react';
import he from 'he';
import moment from 'moment';
import Helmet from 'react-helmet';
import { Twitter, Facebook, Whatsapp, Telegram, Linkedin, Reddit } from 'react-social-sharing';
import * as api from '../user-review/userReviewActions';
import PostsList from '../util/feed/components/PostsList';
import * as actions from './postActions';
import * as feedActions from '../util/feed/feedActions';
import { follow, unfollow } from '../yourtrybe/following/FollowingActions';
import CategoriesAndTags from './components/CategoriesAndTags';
import CommentsList from './components/CommentsList';
import AddComment from './components/AddComment';

const trybeIcon = '/img/loop-logo.png';

class Post extends PureComponent {
  constructor(props) {
    super(props);
    this.publishReply = this.publishReply.bind(this);
    this.onUserClick = this.onUserClick.bind(this);
    this.defaultClickHandler = this.defaultClickHandler.bind(this);
    this.state = {
      activePage: 1,
      tipAmount: 500,
      tipHidden: true
    };
  }

  componentDidMount() {
    const { getPostInfo, getPostComments, location, info } = this.props;
    const { activePage } = this.state;
    if (!info.id) {
      const id = location.pathname;
      getPostInfo({ id });
    } else {
      const id = location.pathname;
      id && getPostInfo({ id });
      id && this.getRating(id);
      id && getPostComments({ post: info.id, page: activePage });
    }

    document.querySelector('.app-body').scrollTop = 0;
  }

  async componentDidUpdate(prevProps, prevState) {
    const { subscriptionSuccessfull, info, getPostComments, history, ratingSending, getAuthorPost, userInfo, amIFollowing } = this.props;
    const { activePage } = this.state;
    if (prevProps.info !== info && Object.keys(info).length > 0) {
      //Maybe it's not the best choice
      if (!info) {
        history.push('/404');
      } else {
        if (info.author) {
          await amIFollowing({ userId: userInfo.id, id: info.author });
          await this.getRating(info.id);
          await getAuthorPost({ post: info.id, author_id: info.author });
          await getPostComments({ post: info.id, page: activePage });
        }
      }
    }
    if (prevProps.ratingSending === true && ratingSending === false) {
      await this.getRating(info.id);
    }

    if (prevState.activePage != activePage) {
      await this.getPagedComments();
    }
    if (
      (prevProps.subscriptionSuccessfull === false
        && subscriptionSuccessfull === true)
    ) {
      await amIFollowing({ userId: userInfo.id, id: info.author });
    }
  }

  componentWillUnmount() {
    const { clearPostInfo } = this.props;
    clearPostInfo();
  }

  getPagedComments() {
    const { info, getPostComments } = this.props;
    const { activePage } = this.state;
    getPostComments({ post: info.id, page: activePage });
  }

  publishComment(text) {
    const { sendComment, cookies, info, userInfo } = this.props;
    const token = cookies.get('trybe_jwt', { path: '/' });
    sendComment({ id: info.id, text, token, authorId: info.author, userId: userInfo.id, target: info.slug });
  }

  getRating(id) {
    const { userInfo, getRating } = this.props;
    const userId = userInfo.id;
    getRating({ id, userId });
  }

  handleRate = (e, { rating }) => {
    const { cookies, sendPostRating, info, userInfo } = this.props;
    const token = cookies.get('trybe_jwt', { path: '/' });
    sendPostRating({ token, rating, id: info.id, authorId: info.author, userId: userInfo.id, target: info.slug });
  };

  publishReply = ({ text, replyId, parent }) => {
    const { cookies, sendReply, info, userInfo } = this.props;
    const token = cookies.get('trybe_jwt', { path: '/' });
    sendReply({ token, id: info.id, parent, text, authorId: info.author, userId: userInfo.id, replyId, target: info.slug, });
    window.scrollTo(0, document.body.scrollHeight);
  };

  onUserClick(userData, userId) {
    const { history, setUserInfo } = this.props;
    //sometimes WP puts "sorry, you are not allowed to list users" message to embedded data of comment
    if (userData.id) {
      setUserInfo(userData);
      history.push(`/user/${userData.id}/`);
    } else {
      history.push(`/user/${userId}/`);
    }
  }

  renderTokens(centered) {
    const { postRating } = this.props;
    const style = {
      justifyContent: centered ? 'center' : 'flex-end',
      margin: centered ? '0 auto' : 0,
      marginTop: '10px'
    };
    return (
      <div className="tokens" style={style}>
        {centered ? `${postRating.tokens ? postRating.tokens : 0}` : postRating.tokens}
        <Image src={trybeIcon} /> LOOPR
      </div>
    );
  }

  handlePaginationUp() {
    const { activePage } = this.state;
    this.setState({ activePage: activePage + 1 });
  }

  handlePaginationDown() {
    const { activePage } = this.state;
    this.setState({ activePage: activePage - 1 });
  }

  tipAmountChange = value => this.setState({ tipAmount: value });

  handleClick = async () => {
    const { userInfo, followUser, unfollowUser, info, following, amIFollowing, cookies } = this.props;
    const token = cookies.get('trybe_jwt', { path: '/' });
    if (following) {
      await unfollowUser({ userId: userInfo.id, targetId: info.author, token });
      await amIFollowing({ userId: userInfo.id, id: info.author });
    } else {
      await followUser({ userId: userInfo.id, targetId: info.author, token });
      await amIFollowing({ userId: userInfo.id, id: info.author });
    }
  };

  defaultClickHandler = async (postInfo) => {
    const { history, clearPostInfo, getPostInfo } = this.props;
    await history.push(`/${postInfo.slug}`);
    await clearPostInfo();
    await getPostInfo({ id: `/${postInfo.slug}` });
    //window.location.reload();
  }

  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage });
  }

  render() {
    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'Rating',
        action: 'click',
        label: 'rating',
        value: 1
      }
    });
    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'Follow',
        action: 'click',
        label: 'follow',
        value: 1
      }
    });
    const {
      activePage,
      tipAmount,
      tipHidden
    } = this.state;
    const {
      info,
      userInfo,
      postRating,
      ratingLoading,
      history,
      isCommentsLoading,
      isAuthorized,
      comments,
      isPostLoading,
      articlesInfo,
      moreArticlesLoading,
      following,
      isLoadingSubscription,
      gettingUserReviewData,
      clickHandler,
      commentPages
    } = this.props;
    if (!info) {
      history.push('/404');
      return <Loader active />;
    }
    const { id, title, _embedded, content, date_gmt, author } = info;

    const panes = [
      {
        menuItem: { key: 'chat', icon: 'chat', content: 'Discussion' },
        render: () => (
          <Tab.Pane>
            {isAuthorized && <AddComment />}
            <Pagination
              boundaryRange={0}
              activePage={activePage}
              defaultActivePage={1}
              siblingRange={1}
              onPageChange={this.handlePaginationChange}
              totalPages={commentPages}
            />
            {isCommentsLoading ? <Loader active intermediate /> : commentPages > 0 ? <CommentsList comments={comments} userInfo={userInfo} onReply={this.publishReply} onUserClick={this.onUserClick} /> : <h3>Be the first to start a discussion.</h3>}
          </Tab.Pane>
        )
      },
      {
        menuItem: { key: 'user', icon: 'user', content: 'About Author' },
        render: () => (
          <Tab.Pane className="article-bar">
            <div className="post-author">
              Published by
              <b style={{ marginRight: '5px', color: '#4DD4B6' }}>
                <Image
                  src={_embedded.author[0].avatar_urls[96]}
                  avatar
                  circular
                  as={Link}
                  to={`/user/${_embedded.author[0].id}/`}
                  onClick={() => this.onUserClick(_embedded.author[0])}
                />
                <Link
                  to={`/user/${_embedded.author[0].id}/`}
                  onClick={() => this.onUserClick(_embedded.author[0])}
                >
                  {_embedded.author[0].name}
                </Link>
              </b>
              {' | '}
              {moment
                .utc(date_gmt)
                .local()
                .format('DD MMMM YYYY')}

              <h4>BIO</h4>
              <Divider />
              <b style={{ marginRight: '5px' }}>
                {_embedded.author[0].description ? _embedded.author[0].description : '.....'}
              </b>
            </div>
          </Tab.Pane>
        )
      }
    ];

    return (
      <Grid className="post-container cz-single-article">
        {id && (
          <Container className="cz-back-article">
            <div className="cz-grid-center"><Button className="backarticle" onClick={() => history.push('/community/')}>Back</Button></div>
          </Container>
        )}
        <div className="cz-single-article-container">
          <Grid.Row>
            <Grid.Column>
              {id ? (
                <Grid>
                  <Helmet>
                    <title>{title ? 'Loop Finance: ' + he.decode(title.rendered) : 'Loop Finance'}</title>
                    <meta httpEquiv="ScreenOrientation" content="autoRotate:disabled" />
                    <meta name="title" content={he.decode(title.rendered).replace(/(<([^>]+)>)/ig, '')} />
                    <meta name="description" content={(info.excerpt.rendered).replace(/(<([^>]+)>)/ig, '')} />
                    <meta property="og:site_name" content="Loop" />
                    <meta property="og:url" content={'https://loop.markets/' + info.slug} />
                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={he.decode(title.rendered).replace(/(<([^>]+)>)/ig, '')} />
                    <meta property="og:description" content={(info.excerpt.rendered).replace(/(<([^>]+)>)/ig, '')} />
                    <meta property="og:image" content={_embedded['wp:featuredmedia'] && _embedded['wp:featuredmedia'][0].source_url} />
                    <meta property="og:updated_time" content={info.modified} />
                    <meta property="article:published_time" content={info.date} />
                    {/* Twitter Card Data */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content={`https://loop.markets/${info.slug}`} />
                    <meta name="twitter:title" content={he.decode(title.rendered).replace(/(<([^>]+)>)/ig, '')} />
                    <meta name="twitter:description" content={(info.excerpt.rendered).replace(/(<([^>]+)>)/ig, '')} />
                    <meta name="twitter:image" content={_embedded['wp:featuredmedia'] && _embedded['wp:featuredmedia'][0].source_url} />
                    {/* Start of loopfinance Zendesk Widget script */}
                    <script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=6c0c34a0-c54f-4cfa-94d8-480e9d57cc24" />
                    {/* End of loopfinance Zendesk Widget script */}
                    <script> window.prerenderReady = true </script>
                  </Helmet>
                  <Grid.Row className="sub-header cz-post-header-top">
                    <Grid.Column width="16">
                      <div className="post-header">
                        <h1>{he.decode(title.rendered)}</h1>
                      </div>
                      <Grid.Row>
                        <Grid.Column>
                          <CategoriesAndTags
                            tags={_embedded['wp:term'] && _embedded['wp:term'][1]}
                            categories={_embedded['wp:term'] && _embedded['wp:term'][0]}
                          />
                        </Grid.Column>
                      </Grid.Row>
                      <div className="post-date">
                        <Divider />
                        <div className="post-bar">
                          <div className="post-author">
                            <b style={{ marginRight: '5px', color: '#4DD4B6' }}>
                              <Image
                                src={_embedded.author[0].avatar_urls[96]}
                                avatar
                                circular
                                as={Link}
                                to={`/user/${_embedded.author[0].id}/`}
                                onClick={() => this.onUserClick(_embedded.author[0])}
                              />
                              <Link
                                to={`/user/${_embedded.author[0].id}/`}
                                onClick={() => this.onUserClick(_embedded.author[0])}
                              >
                                Published By {_embedded.author[0].name}
                              </Link>
                            </b>
                            {' | '}
                            <Icon style={{ marginLeft: '5px' }} name="calendar check outline" />
                            {moment
                              .utc(date_gmt)
                              .local()
                              .format('MMMM DD, YYYY')}
                            {' | '}
                            <Icon style={{ marginLeft: '5px' }} name="comment outline" /> {info.details.post_comments_number}
                            {userInfo.id === author && (' | ')}
                            {userInfo.id === author && (
                              <a href={'/post/editor/edit/' + id}>
                                <i className="fal fa-edit" />
                              </a>
                            )}
                            {userInfo.id ? (
                              <Button
                                content={<span>{following ? 'Following' : 'Follow'}</span>}
                                floated="right"
                                size="tiny"
                                disabled={userInfo.id == info.author}
                                loading={isLoadingSubscription || gettingUserReviewData}
                                className={following ? 'green-follow-button' : 'greenButton'}
                                onClick={this.handleClick}
                              />
                            ) : (
                              <Button
                                content="Register and Follow"
                                floated="right"
                                size="tiny"
                                className="green-button"
                                onClick={() => history.push('../sign-up')}
                              />
                            )}
                          </div>


                          <div className="post-author cz-post-mobile-only">
                            <b style={{ marginRight: '5px', color: '#4DD4B6' }}>
                              <Image
                                src={_embedded.author[0].avatar_urls[96]}
                                avatar
                                circular
                                as={Link}
                                to={`/user/${_embedded.author[0].id}/`}
                                onClick={() => this.onUserClick(_embedded.author[0])}
                              />
                              <Link
                                to={`/user/${_embedded.author[0].id}/`}
                                onClick={() => this.onUserClick(_embedded.author[0])}
                              >
                                Published By <i>{_embedded.author[0].name}</i>
                              </Link>
                            </b>
                            <b>
                              <Icon style={{ marginLeft: '5px' }} name="calendar check outline" />
                              {moment
                                .utc(date_gmt)
                                .local()
                                .format('MMMM DD, YYYY')}
                            </b>
                            <b>
                              <Icon style={{ marginLeft: '5px' }} name="comment outline" /> {info.details.post_comments_number}
                              {userInfo.id === author && (' | ')}
                              {userInfo.id === author && (
                                <a href={'/post/editor/edit/' + id}>
                                  <i className="fal fa-edit" />
                                </a>
                              )}
                            </b>
                            {userInfo.id ? (
                              <Button
                                content={<span>{following ? 'Following' : 'Follow'}</span>}
                                floated="right"
                                size="tiny"
                                disabled={userInfo.id == info.author}
                                loading={isLoadingSubscription || gettingUserReviewData}
                                className={following ? 'green-follow-button' : 'green-bordered-button'}
                                onClick={this.handleClick}
                              />
                            ) : (
                              <Button
                                content="Register and Follow"
                                floated="right"
                                size="tiny"
                                className="green-button"
                                onClick={() => history.push('../sign-up')}
                              />
                            )}
                          </div>
                          {/*this.renderTokens(false)*/}
                        </div>
                        <Divider />
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  {_embedded['wp:featuredmedia'] && (
                    <Grid.Row className="cz-post-header-top">
                      <Grid.Column>
                        <div className="post-featured-image">
                          <Image
                            src={`${_embedded['wp:featuredmedia'][0].source_url
                              }`}
                          />
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  )}
                  <Grid.Row className="cz-set-set">
                    <div
                      className="post"
                      dangerouslySetInnerHTML={{ __html: content.rendered }}
                    />
                  </Grid.Row>
                  <Grid.Row className="cz-set-set">
                    <div className="social-buttons-container">
                      <Facebook link={window.location.href} />
                      <Telegram link={window.location.href} />
                      <Twitter link={window.location.href} />
                      <Linkedin link={window.location.href} />
                      <Whatsapp link={window.location.href} />
                      <Reddit link={window.location.href} />
                    </div>
                  </Grid.Row>
                  <Grid.Row className="cz-set-set">
                    <div className="ratings">
                      {!ratingLoading ? (
                        <React.Fragment>
                          <Rating className="ratingTag" icon="star" disabled={postRating.user_rated || !isAuthorized} onRate={this.handleRate} defaultRating={postRating.user_rated} maxRating={5} />
                        </React.Fragment>
                      ) : (
                        <Loader active />
                      )}
                      <div>
                        {`Total Ratings: ${!postRating.total_rates ? 0 : postRating.total_rates}`} | {`Average Rating: ${!postRating.post_rating_average ? 0 : postRating.post_rating_average}`}
                        <Divider />
                        {this.renderTokens(true)}
                      </div>
                      {tipHidden != true && (
                        <div style={{ marginTop: '50px' }} className="tip">
                          <p>
                            <Grid columns="equal" divided>
                              <Grid.Row stretched>
                                <Grid.Column>
                                  <Button.Group className="amount">
                                    <Button onClick={() => { this.tipAmountChange(100); }} active={tipAmount == 100}>100 LOOP</Button>
                                    <Button onClick={() => { this.tipAmountChange(500); }} active={tipAmount == 500}>500 LOOP</Button>
                                    <Button onClick={() => { this.tipAmountChange(1000); }} active={tipAmount == 1000}>1000 LOOP</Button>
                                    <Button onClick={() => { this.tipAmountChange(2500); }} active={tipAmount == 2500}>2500 LOOP</Button>
                                    <Button onClick={() => { this.tipAmountChange(5000); }} active={tipAmount == 5000}>5000 LOOP</Button>
                                  </Button.Group>
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                            <Grid columns="equal" divided>
                              <Grid.Row>
                                <Grid.Column>
                                  <Button
                                    icon="send"
                                    content={`TIP ${tipAmount} LOOP`}
                                    size="massive"
                                    color="green"
                                    fluid
                                  />
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          </p>
                        </div>
                      )}
                    </div>
                  </Grid.Row>
                  {!isAuthorized && (
                    <Grid.Row className="loopCard tokenCard">
                      <p className="title">Why Join Loop? </p>
                      <br />
                      <span className="text-light" style={{ margin: '20px;' }}>Join Loop and immediately start earning LOOPR tokens for your participation in our community! Write articles, rate articles, comment, invite friends, or make new ones! Everything you do will help you to earn more of our tokens!
                        <br />
                        <br />
                        By owning LOOPR tokens you can earn LOOP tokens - the core token powering our DEX (Decentralized Exchange). With LOOP tokens, you can earn a share of the revenue from every transaction that is made on our platform!
                        <br />
                        <br />
                        Become a member TODAY and start EARNING!
                      </span>
                      <button className="btn headerBtn px-3 mb-2 mb-lg-0 joinBtn" type="button" onClick={() => history.push('/sign-up')}>Join</button>
                      <Divider />
                    </Grid.Row>
                  )}
                  <Grid.Row className="cz-post-comments">
                    <div className="comments-container">
                      <Tab menu={{ attached: true }} panes={panes} />
                    </div>
                  </Grid.Row>
                  <Grid.Row className="cz-post-header-top-enter">
                    <div
                      className="post"
                    >
                      {!moreArticlesLoading && articlesInfo[0] && (
                        <div>
                          <Header
                            content="YOU MIGHT ALSO LIKE"
                          />
                          <div className="author-post">
                            <PostsList
                              className="posts-list"
                              posts={articlesInfo}
                              isLoaderActive={false}
                              clickHandler={
                                clickHandler
                                  ? clickHandler
                                  : this.defaultClickHandler
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Grid.Row>
                </Grid>
              ) : (
                <Loader active={isPostLoading} />
              )}
            </Grid.Column>
          </Grid.Row>
        </div>
      </Grid>
    );
  }
}
export default withCookies(
  withRouter(
    connect(
      (state, ownProps) => {
        return {
          cookies: ownProps.cookies,
          userInfo: state.user.userInfo,
          postRating: state.post.postRating,
          ratingLoading: state.post.ratingLoading,
          isAuthorized: state.user.userIsLogged,
          comments: state.post.postComments,
          commentPages: state.post.commentPages,
          isCommentsLoading: state.post.commentsLoading,
          isPostLoading: state.post.postLoading,
          moreArticlesLoading: state.post.moreArticlesLoading,
          info: state.post.postInfo,
          articlesInfo: state.post.moreArticles,
          ratingSending: state.post.ratingSending,
          following: state.userReview.amIFollowing,
          isLoadingSubscription: state.following.loadingSubscribe,
          gettingUserReviewData: state.userReview.loading,
          subscriptionSuccessfull: state.following.subscriptionSuccessfull,
        };
      },
      dispatch => ({
        getPostInfo: (params) => {
          dispatch(actions.getPostInfo(params));
        },
        getAuthorPost: (params) => {
          dispatch(actions.getAuthorPost(params));
        },
        getPostComments: (params) => {
          dispatch(actions.getPostComments(params));
        },
        sendPostRating: (params) => {
          dispatch(actions.sendPostRating(params));
        },
        clearPostInfo: () => {
          dispatch(actions.clearPostInfo());
        },
        sendReply: (params) => {
          dispatch(actions.replyToPostComment(params));
        },
        getRating: (params) => {
          dispatch(actions.getPostRating(params));
        },
        ratePost: (params) => {
          dispatch(actions.ratePost(params));
        },
        amIFollowing: (params) => {
          dispatch(api.amIFollowing(params));
        },
        followUser: (params) => {
          dispatch(follow(params));
        },
        unfollowUser: (params) => {
          dispatch(unfollow(params));
        },
        clearPosts: () => {
          dispatch(feedActions.clearPostsRoutine());
        },
        setPost: (postInfo) => {
          dispatch(actions.setPostInfo(postInfo));
        }
      })
    )(Post)
  )
);
