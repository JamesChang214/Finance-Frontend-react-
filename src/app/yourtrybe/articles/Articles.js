import React, { PureComponent } from 'react';
import './Articles.scss';
import {
  Grid,
  Dropdown,
  Responsive,
  List,
  Image,
  GridColumn,
  Card,
  Button
} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import Truncate from 'react-truncate';
import TextTruncate from 'react-text-truncate';
import moment from 'moment';
import Helmet from 'react-helmet';
import SwiperCore, { Navigation, Scrollbar, Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import 'swiper/components/pagination/pagination.min.css';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import { setPageForGoogleAnalytics } from '../../util/helperFunctions';
import Feed from '../../util/feed/Feed';
import * as actions from './articlesActions';
import * as powerUpActions from '../../powerup/powerUpActions';
import * as followActions from '../following/FollowingActions';
import * as payoutActions from '../../pages/payout/weeklyPayoutActions';
import PayoutCountdown from '../../pages/payout/components/Countdown';
import SideControl from '../components/SideControl';
import * as api from './articlesApi';

class Articles extends PureComponent {
  constructor(props) {
    SwiperCore.use([Navigation, Scrollbar, Pagination, Autoplay]);
    super(props);
    this.addCategory = this.addCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.selectFavourites = this.selectFavourites.bind(this);
    this.selectTerraNews = this.selectTerraNews.bind(this);
    this.updateCategoriesQuery = Articles.updateCategoriesQuery;
    this.state = {
      currentAuthorQuery: [],
      currentCategoryQuery: [],
      orderQuery: '',
      categoriesState: 'all',
      // tabName: 'Latest',
      getPromos: '',
      acfData: null
    };
  }

  componentDidMount() {
    setPageForGoogleAnalytics('your-trybe/articles');
    const { getPromos } = this.props;
    const promoCache = JSON.parse(localStorage.getItem('trybe_promos'));
    const pageName = window.location.pathname;
    if (!promoCache && pageName == '/community/') {
      getPromos();
    } else if (promoCache && pageName == '/community/') {
      this.setState({ getPromos: promoCache });
      getPromos();
    }
    api.getAcfInfo().then(acfData => this.setState({ acfData }));
    this.getFollowingAndFollowers();
    /*
    if (preChosenCategories) {
      this.setState(() => {
        const newCategories = [...preChosenCategories];
        const query = this.updateCategoriesQuery(newCategories);
        return {
          chosenCategories: newCategories,
          currentCategoryQuery: query
        };
      });
    }
    */
    let tabStatus = localStorage.getItem('tabName')
    if (tabStatus) {
      this.handleOrderChange(tabStatus)
    } else {
      this.handleOrderChange('Latest')
    }
    // setTimeout(() => {
    //   let feedScroll = localStorage.getItem('communityScroll')
    //   console.log(feedScroll);
    //   console.log('helo wordl')
    //   if (feedScroll) {
    //     document.querySelector(".app-body").scrollTo(0, feedScroll)
    //   }
    // }, 10000)
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { isLoadingSubscription, userInfo } = this.props;
    const { acfData, currentAuthorQuery, tabName } = this.state;
    if (prevProps.isLoadingSubscription == isLoadingSubscription && prevProps.userInfo.id != userInfo.id) {
      this.getFollowingAndFollowers();
    }
    if (acfData && currentAuthorQuery?.length === 0 && tabName == 'Latest') {
      this.sortOfficalAuthor();
    }
  }

  sortOfficalAuthor() {
    const { acfData } = this.state;
    const query = acfData.authors.map(({ id }) => [id]);
    this.setState({ currentAuthorQuery: query });
  }

  getFollowingAndFollowers = () => {
    const { getFollowing, getFollowers, userInfo } = this.props;
    userInfo.id && getFollowing({
      userId: userInfo.id,
      page: 1
    });
    userInfo.id && getFollowers({
      userId: userInfo.id,
      page: 1
    });
  }

  addCategory(category) {
    const { categoriesState } = this.state;
    categoriesState === 'favorites'
      && this.addFavoriteCategory(category.id);
    this.setState((state) => {
      const { chosenCategories } = state;
      const newCategories = [...chosenCategories, category];
      const query = this.updateCategoriesQuery(newCategories);
      return {
        chosenCategories: newCategories,
        currentAuthorQuery: query
      };
    });
  }

  addFavoriteCategory = (categoryId) => {
    const { cookies, addFavoriteCategory } = this.props;
    const token = cookies.get('trybe_jwt');
    addFavoriteCategory({ category: categoryId, token });
  };

  deleteFavoriteCategory = (categoryId) => {
    const { cookies, deleteFavoriteCategory } = this.props;
    const token = cookies.get('trybe_jwt');
    deleteFavoriteCategory({ category: categoryId, token });
  };

  deleteCategory(category) {
    const { categoriesState } = this.state;
    categoriesState === 'favorites'
      && this.deleteFavoriteCategory(category.id);
    this.setState((state) => {
      const { chosenCategories } = state;
      const newChosenCategories = chosenCategories.filter(
        ({ id }) => id != category.id
      );
      const query = this.updateCategoriesQuery(newChosenCategories);
      return {
        chosenCategories: newChosenCategories,
        currentAuthorQuery: query
      };
    });
  }

  selectFavourites() {
    const { following } = this.props;
    const newChosenCategories = following.map(data => (data.person));
    this.setState({
      categoriesState: 'favorites',
      currentAuthorQuery: this.updateCategoriesQuery(newChosenCategories),
      currentCategoryQuery: []
    });
  }

  selectTerraNews() {
    this.setState({
      categoriesState: 'all',
      currentAuthorQuery: [],
      //currentCategoryQuery: this.updateCategoriesQuery(preChosenCategories),
      currentCategoryQuery: []
    });
  }

  selectAll() {
    this.setState({
      categoriesState: 'all',
      currentAuthorQuery: [],
      currentCategoryQuery: []
    });
  }

  static updateCategoriesQuery(chosenCategories) {
    const query = chosenCategories[0]
      ? chosenCategories.map(({ id }) => id).join(',')
      : null;
    return query;
  }


  // _extractPreChosenCategories(categories = []) {
  //   const {preChosenCategories, categories} = this.props;
  //   preChosenCategories.forEach((category) => {
  //     categories.push(category);
  //     if (category.subCategories[0] ) {
  //       this._extractPreChosenCategories(category.subCategories);
  //     }
  //   });
  //   return categories;
  // }

  handleOrderChange(value) {
    localStorage.setItem('tabName', value);
    //document.querySelector('.app-body').scrollTo(0, 0);
    // 30 Days
    const month = moment().subtract(30, 'days').toString();
    const month_date = new Date(month);

    // Week
    const week = moment().subtract(7, 'days').toString();
    const week_date = new Date(week);

    // Today
    const today = moment().subtract(1, 'day').toString();
    //const today_date = new Date(today);
    this.setState({ tabName: value });
    if (value === 'Feed') {
      this.selectFavourites();
      this.setState({ orderQuery: '' });
    } else if (value === 'Latest') {
      this.selectTerraNews();
      this.setState({ orderQuery: '' });
    } else if (value === 'Today') {
      this.setState({ orderQuery: '' });
      this.selectAll();
    } else if (value === 'Week') {
      this.setState({ orderQuery: `&after=${week_date.toISOString()}&orderby=token_score_average` });
      this.selectAll();
    } else if (value === 'Month') {
      this.setState({ orderQuery: `&after=${month_date.toISOString()}&orderby=token_score_average` });
      this.selectAll();
    } else if (!value) {
      this.setState({ orderQuery: '' });
      this.selectAll();
    }
  }

  render() {
    const { promos, userInfo, acctName, following, followers } = this.props;
    const { currentCategoryQuery, currentAuthorQuery, orderQuery, tabName, getPromos } = this.state;
    const promoData = getPromos ? getPromos : promos;
    const { history } = this.props;
    const follow_count = { following: following.length, followers: followers.length };
    window.dataLayer.push({
      event: 'pageview',
      page: {
        url: '/community',
        title: 'Community'
      }
    });
    return (
      <Grid className="promo">
        <Helmet>
          <title>Loop Finance | Community</title>
        </Helmet>
        <Grid className="page-wrapper">
          <SideControl />
          <div className="content-wrapper">
            <Grid className="c-row">
              <GridColumn computer={11} mobile={16} tablet={16} className="bg-info cz-set-new-blog">
                <Grid.Column className="start-learning-card featured-feed-card" computer={16} mobile={16} tablet={16}>
                  {promoData && (
                    <Swiper
                      slidesPerView={3}
                      spaceBetween={30}
                      navigation
                      loop
                      autoplay={{ delay: 7000 }}
                      className="feedSwiper"
                      slideToClickedSlide
                      breakpoints={{
                        1200: {
                          freemode: true,
                          slidesPerView: 3,
                          spaceBetween: 20,
                        },
                        768: {
                          freemode: true,
                          slidesPerView: 3,
                          spaceBetween: 20,
                        },
                        640: {
                          freemode: true,
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        320: {
                          freemode: true,
                          slidesPerView: 1,
                          spaceBetween: 20,
                        }
                      }}
                    >
                      {promoData.map(data => (
                        <SwiperSlide>
                          <Card href={data?.article_link}>
                            <Image src={data?.article_image} wrapped ui={false} />
                            <Card.Content>
                              <Card.Header>
                                {/* <Truncate lines={2} ellipsis={<span>...</span>}>
                                  {data?.article_title}
                                </Truncate> */}
                                <TextTruncate
                                  line={2}
                                  truncateText="..."
                                  text={data?.article_title}
                                />
                              </Card.Header>
                              <Card.Description>
                                <TextTruncate
                                  line={3}
                                  truncateText="..."
                                  text={data?.article_description}
                                />
                                {/* <Truncate lines={3} ellipsis={<span>...</span>}>
                                  {data?.article_description}
                                </Truncate> */}
                              </Card.Description>
                            </Card.Content>
                          </Card>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </Grid.Column>

                <GridColumn computer={5} mobile={16} tablet={16} className="right_side only-for-mobile">
                  {this.props.isAuthorized
                    ? (
                      <div>
                        <Grid className="loopCard userProfileCard">
                          <Grid className="profileInner">
                            <Grid className="profilePic position-relative">
                              <Image className="profileImg" src={userInfo.avatar_urls?.['96']} />
                              <span className="online" />
                            </Grid>
                          </Grid>
                          <Grid className="profilePic-details">
                            <p className="name">{userInfo.name}</p>
                            <p className="username">@{userInfo.username}</p>
                            <Button className="show-my-profile-mobile" onClick={() => history.push('/communityProfile')}>View My Engagement</Button>
                          </Grid>
                        </Grid>
                      </div>
                    )
                    : (
                      <Grid className="loopCard tokenCard">
                        <p className="tokenBal">Why Join Loop? </p>
                        <br />
                        <span className="text-light">Join Loop and immediately start earning LOOPR tokens for your participation in our community! Write articles, rate articles, comment, invite friends, or make new ones! Everything you do will help you to earn more of our tokens!
                          <br />
                          <br />
                          By owning LOOPR tokens you can earn LOOP tokens - the core token powering our DEX (Decentralized Exchange). With LOOP tokens, you can earn a share of the revenue from every transaction that is made on our platform!
                          <br />
                          <br />
                          Become a member TODAY and start EARNING!
                        </span>
                        <button className="btn headerBtn px-3 mb-2 mb-lg-0 joinBtn" type="button" onClick={() => history.push('/sign-up')}>Join</button>
                      </Grid>
                    )

                  }
                </GridColumn>
                <Grid className="tab-article">
                  <List link inverted className="post_tabs">
                    {userInfo.id && (
                      <List.Item as="a" className="nav-link" active={tabName == 'Feed'} onClick={() => this.handleOrderChange('Feed')}>
                        <span>Your Feed</span>
                      </List.Item>
                    )}
                    <List.Item as="a" className="nav-link" active={tabName == 'Latest'} onClick={() => this.handleOrderChange('Latest')}>
                      <span>Official News</span>
                    </List.Item>
                    <List.Item as="a" className="nav-link" active={tabName == 'Today'} onClick={() => this.handleOrderChange('Today')}>
                      <span>Community News</span>
                    </List.Item>
                    <List.Item as="a" className="nav-link" active={tabName == 'Week'} onClick={() => this.handleOrderChange('Week')}>
                      <span>Weekly Best</span>
                    </List.Item>
                    <List.Item as="a" className="nav-link" active={tabName == 'Month'} onClick={() => this.handleOrderChange('Month')}>
                      <span>Monthly Best</span>
                    </List.Item>
                  </List>
                </Grid>

                <Feed
                  tabName={
                    tabName
                  }
                  queryParams={
                    `&author=${currentAuthorQuery}${currentCategoryQuery.length > 0 ? `&categories=${currentCategoryQuery}` : ``}&cache=true`
                    + orderQuery
                  }
                />
              </GridColumn>
              <GridColumn computer={5} mobile={16} tablet={16} className="right_side cz-com-page-profile">
                {this.props.isAuthorized
                  ? (
                    <div>
                      <Grid className="loopCard userProfileCard">
                        <Grid className="profileInner">
                          <p>
                            <Image src="../img/binoculars.svg" />{follow_count?.following}
                          </p>
                          <Grid className="profilePic position-relative">
                            <Image className="profileImg" src={userInfo.avatar_urls?.['96']} />
                            <span className="online" />
                          </Grid>
                          <p>
                            <Image src="../img/userTick.svg" />{follow_count?.followers}
                          </p>
                        </Grid>
                        <p className="name">{userInfo.name}</p>
                        <p className="username">@{userInfo.username}</p>
                        <p className="rank">Rank: {userInfo.details?.rank}</p>
                      </Grid>
                      <Grid className="loopCard tokenCard">
                        <p className="tokenBal">tokens balance</p>
                        <p className="count">{userInfo.details?.balance.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                        {acctName && (<p className="nxtRank"> Next Rank: {userInfo.details.engagement?.next_rank}</p>)}
                        {acctName && (<p className="tokenNeed"> Tokens needed: {userInfo.details.engagement?.next_rank}</p>)}
                      </Grid>

                      <Grid className="loopCard engagementCard">
                        <p className="title">Engagement</p>
                        <span style={{ textAlign: 'center', fontSize: '12px' }}>Reach all the engagement goals <br /> ({userInfo.details.engagement.limit?.rates_limit} ratings, {userInfo.details.engagement.limit?.comments_limit} comments, and {userInfo.details.engagement.limit?.posts_limit} posts) to get 100% engagement and receive your full payout!</span>
                        <Grid className="enga">
                          <Grid className="innerBox">
                            <p>Engagement</p>
                            <span className="number">{userInfo.details.engagement?.engagement + '%'}</span>
                          </Grid>

                          <Grid className="innerBox">
                            <p>Ratings <span>({userInfo.details.engagement.percent?.rate_percent})</span></p>
                            <small><span className="number">{userInfo.details.engagement.limit?.rates_count + '/' + userInfo.details.engagement.limit?.rates_limit}</span></small>
                          </Grid>

                          <Grid className="innerBox">
                            <p>Posts <span>({userInfo.details.engagement.percent?.post_percent})</span></p>
                            <small><span className="number">{userInfo.details.engagement.limit?.posts_count + '/' + userInfo.details.engagement.limit?.posts_limit}</span></small>
                          </Grid>

                          <Grid className="innerBox">
                            <p>Comments <span>({userInfo.details.engagement.percent?.comment_percent})</span></p>
                            <small><span className="number">{userInfo.details.engagement.limit?.comments_count + '/' + userInfo.details.engagement.limit?.comments_limit}</span></small>
                          </Grid>
                        </Grid>
                        <Button className="show-my-profile" onClick={() => history.push('/profile/engagement/')}>View More</Button>
                      </Grid>

                      <Grid className="loopCard PayoutAmount">
                        <p className="title">Next payout amount</p>
                        <span className="blueTxt">{userInfo.details.engagement?.total_payout}</span>
                        <p className="line">Will be paid out in:</p>
                        <Grid className="d-flex align-items-center justify-content-between timeBox">
                          <PayoutCountdown />
                        </Grid>
                      </Grid>
                    </div>
                  )
                  : (
                    <Grid className="loopCard tokenCard">
                      <p className="tokenBal">Why Join Loop? </p>
                      <br />
                      <span className="text-light">Join Loop and immediately start earning LOOPR tokens for your participation in our community! Write articles, rate articles, comment, invite friends, or make new ones! Everything you do will help you to earn more of our tokens!
                        <br />
                        <br />
                        By owning LOOPR tokens you can earn LOOP tokens - the core token powering our DEX (Decentralized Exchange). With LOOP tokens, you can earn a share of the revenue from every transaction that is made on our platform!
                        <br />
                        <br />
                        Become a member TODAY and start EARNING!
                      </span>
                      <button className="btn headerBtn px-3 mb-2 mb-lg-0 joinBtn" type="button" onClick={() => history.push('/sign-up')}>Join</button>
                    </Grid>
                  )

                }
                {/* <TwitterTimelineEmbed
                  sourceType="profile"
                  screenName="TwitterDev"
                  options={{ height: 400 }}
                  theme="dark"
                  noHeader="true"
                  noBorders="true"
                  noFooter="true"
                /> */}
              </GridColumn>
            </Grid>

          </div>
        </Grid>
      </Grid>
    );
  }
}

export default withCookies(
  withRouter(
    connect(
      (state, ownProps) => {
        return {
          acctName: state.user.userInfo.eosAccount,
          currentCategory: state.articles.currentCategory,
          isAuthorized: state.user.userIsLogged,
          userInfo: state.user.userInfo,
          followers: state.following.followers,
          following: state.following.following,
          isLoadingFollowers: state.following.loadingList,
          isLoadingSubscription: state.following.loadingSubscribe,
          loadingIndexes: state.following.loadingIndexes,
          promosAreLoading: state.articles.promosAreLoading,
          categories: state.articles.categories,
          promos: state.articles.promos,
          powerUpData: state.powerUp,
          postsData: state.feed.posts,
          cookies: ownProps.cookies
        };
      },
      dispatch => ({
        getPromos: () => dispatch(actions.getAllPromos()),
        addFavoriteCategory: params => dispatch(actions.addFavoriteCategory(params)),
        deleteFavoriteCategory: params => dispatch(actions.deleteFavoriteCategory(params)),
        getFollowing: (params) => {
          dispatch(followActions.getFollowing(params));
        },
        getFollowers: (params) => {
          dispatch(followActions.getFollowers(params));
        },
      })
    )(Articles)
  )
);

