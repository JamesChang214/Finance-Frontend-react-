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
import moment from 'moment';
import SwiperCore, { Navigation, Scrollbar, Pagination } from 'swiper';
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

class Articles extends PureComponent {
  constructor(props) {
    SwiperCore.use([Navigation, Scrollbar, Pagination]);
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
      tabName: 'Latest',
      getPromos: ''
    };
  }

  componentDidMount() {
    setPageForGoogleAnalytics('your-trybe/articles');
    const { getPromos, getPowerUpData, preChosenCategories, getPayoutData, cookies } = this.props;
    const promoCache = JSON.parse(localStorage.getItem('trybe_promos'));
    const cachedUserInfo = JSON.parse(localStorage.getItem('trybe_user'));
    const token = cookies.get('trybe_jwt', { path: '/' });

    if (token) {
      getPayoutData(token);
    }
    if (!token) {
      getPayoutData();
    }

    if (cachedUserInfo && cachedUserInfo.id) {
      getPowerUpData(cachedUserInfo.id);
    }

    if (!promoCache) {
      getPromos();
    } else {
      this.setState({ getPromos: promoCache });
      getPromos();
    }
    this.getFollowingAndFollowers();
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
  }

  componentDidUpdate = (prevProps) => {
    const { isLoadingSubscription, userInfo } = this.props;
    if (prevProps.isLoadingSubscription == isLoadingSubscription && prevProps.userInfo.id != userInfo.id) {
      this.getFollowingAndFollowers();
    }
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
    const { preChosenCategories } = this.props;
    this.setState({
      categoriesState: 'all',
      currentAuthorQuery: [],
      currentCategoryQuery: this.updateCategoriesQuery(preChosenCategories),
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
    console.log(value);
    document.querySelector('.app-body').scrollTo(0, 0);
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
    const { promos, userInfo, powerUpData, acctName, engagementData, following, followers } = this.props;
    const { currentCategoryQuery, currentAuthorQuery, orderQuery, tabName, getPromos, sidebarOpened } = this.state;
    const promoData = getPromos ? getPromos : promos;
    const { history } = this.props;
    const options = [
      { text: 'Feed', value: 'Feed', disabled: !userInfo.id },
      { text: 'Latest', value: 'Latest' },
      { text: 'Today', value: 'Today' },
      { text: 'Week', value: 'Week' },
      { text: 'Month', value: 'Month' },
    ];
    const follow_count = { following: following.length, followers: followers.length };
    return (

      <Grid className="promo cz-communityProfile avvvv">
        <Grid className="page-wrapper">
          {/* {sidebarOpened && ( */}
          <SideControl />
          {/* )} */}

          <div className="content-wrapper">
            <div className="cz-communityBack">
              <Button onClick={() => history.push('/community/')}>Back to Community</Button>
            </div>
            <Grid className="c-row">
              <GridColumn computer={11} mobile={16} tablet={16} className="bg-info cz-set-new-blog">
                <Grid.Column className="start-learning-card featured-feed-card" computer={16} mobile={16} tablet={16}>
                  {promoData && (
                    <Swiper
                      slidesPerView={3}
                      spaceBetween={30}
                      navigation
                      loop
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
                        <div>
                          <SwiperSlide>
                            <Card href={data?.article_link}>
                              <Image src={data?.article_image} wrapped ui={false} />
                              <Card.Content>
                                <Card.Header>
                                  <Truncate lines={2} ellipsis={<span>...</span>}>
                                    {data?.article_title}
                                  </Truncate>
                                </Card.Header>
                                <Card.Description>
                                  <Truncate lines={3} ellipsis={<span>...</span>}>
                                    {data?.article_description}
                                  </Truncate>
                                </Card.Description>
                              </Card.Content>
                            </Card>
                          </SwiperSlide>
                        </div>
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
                          <Button className="show-my-profile-mobile">View My Engagement</Button>
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
                  <TwitterTimelineEmbed
                    sourceType="profile"
                    screenName="TwitterDev"
                    options={{ height: 400 }}
                    theme="dark"
                    noHeader="true"
                    noBorders="true"
                    noFooter="true"
                  />
                </GridColumn>
                <Grid className="tab-article">
                  <List link inverted className="post_tabs">
                    {userInfo.id && (
                      <List.Item as="a" className="nav-link" active={tabName == 'Feed'} onClick={() => this.handleOrderChange('Feed')}>
                        <span>Your Feed</span>
                      </List.Item>
                    )}
                    <List.Item as="a" className="nav-link" active={tabName == 'Latest'} onClick={() => this.handleOrderChange('Latest')}>
                      <span>Terra News</span>
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
              <GridColumn computer={5} mobile={16} tablet={16} className="right_side">
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
                        {acctName && powerUpData.userInfo && (<p className="nxtRank"> Next Rank: {powerUpData.userInfo.next_rank}</p>)}
                        {acctName && powerUpData.userInfo && (<p className="tokenNeed"> Tokens needed: {powerUpData.userInfo.next_rank}</p>)}
                      </Grid>

                      <Grid className="loopCard engagementCard">
                        <p className="title">Engagement</p>
                        <Grid className="enga">
                          <Grid className="innerBox">
                            <p>Engagement</p>
                            <span className="number">{engagementData ? engagementData.engagement + '%' : 0 + '%'}</span>
                          </Grid>

                          <Grid className="innerBox">
                            <p>Ratings <span>({engagementData && '+' + engagementData.percent.rate_percent})</span></p>
                            <small><span className="number">{engagementData ? engagementData.rates + '/' + engagementData.rates_limit : 0}</span></small>
                          </Grid>

                          <Grid className="innerBox">
                            <p>Posts <span>({engagementData && '+' + engagementData.percent.post_percent})</span></p>
                            <small><span className="number">{engagementData ? engagementData.posts + '/' + engagementData.posts_limit : 0}</span></small>
                          </Grid>

                          <Grid className="innerBox">
                            <p>Comments <span>({engagementData && '+' + engagementData.percent.comment_percent})</span></p>
                            <small><span className="number">{engagementData ? engagementData.comments + '/' + engagementData.comments_limit : 0}</span></small>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid className="loopCard PayoutAmount">
                        <p className="title">Next payout amount</p>
                        <span className="blueTxt">{engagementData && engagementData.total_payout}</span>
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
              </GridColumn>
            </Grid>

          </div>
        </Grid>
        {/* dynamic data start here */}


        <Grid.Row>
          {/* <Responsive
            as={Grid.Column}
            width="16"
            minWidth={Responsive.onlyComputer.minWidth}
          >
            <Grid divided="vertically">
              {promoData[0] && (
                <Grid.Row columns={3} stretched>
                  <Responsive
                    as={Grid.Column}
                    minWidth={Responsive.onlyComputer.minWidth}
                  >
                    <Grid.Row>
                      <Grid.Column width={2}>
                        <Segment secondary className="promo_bg">
                          <Header as="h3">
                            <Header.Content href={promoData[0].link} style={{ color: 'var(--text-color)' }}>
                              <LazyBackground src={promoData[0].image} />
                              <Truncate lines={1} ellipsis={<span>...</span>}>
                                {promoData[0].title}
                              </Truncate>
                              <Divider />
                              <Header.Subheader className="promo_desc" style={{ color: 'var(--title-dark)', fontWeight: 'bolder' }}>
                                <Truncate lines={3} ellipsis={<span>...</span>}>
                                  {promoData[0].desc}
                                </Truncate>
                              </Header.Subheader>
                            </Header.Content>
                          </Header>
                        </Segment>
                      </Grid.Column>
                    </Grid.Row>
                  </Responsive>
                  <Responsive
                    as={Grid.Column}
                    minWidth={Responsive.onlyComputer.minWidth}
                  >
                    <Grid.Row>
                      <Grid.Column width={2}>
                        <Segment secondary className="promo_bg">
                          <Header as="h3">
                            <Header.Content href={promoData[0].more[0].link} style={{ color: 'var(--text-color)' }}>
                              <LazyBackground src={promoData[0].more[0].image} />
                              <Truncate lines={1} ellipsis={<span>...</span>}>
                                {promoData[0].more[0].title}
                              </Truncate>
                              <Divider />
                              <Header.Subheader className="promo_desc" style={{ color: 'var(--title-dark)', fontWeight: 'bolder' }}>
                                <Truncate lines={3} ellipsis={<span>...</span>}>
                                  {promoData[0].more[0].desc}
                                </Truncate>
                              </Header.Subheader>
                            </Header.Content>
                          </Header>
                        </Segment>
                      </Grid.Column>
                    </Grid.Row>
                  </Responsive>
                  <Responsive
                    as={Grid.Column}
                    minWidth={Responsive.onlyComputer.minWidth}
                  >
                    <Grid.Row>
                      <Grid.Column width={2}>
                        <Segment secondary className="promo_bg">
                          <Header as="h3">
                            <Header.Content href={promoData[0].more[1].link} style={{ color: 'var(--text-color)' }}>
                              <LazyBackground src={promoData[0].more[1].image} />
                              <Truncate lines={1} ellipsis={<span>...</span>}>
                                {promoData[0].more[1].title}
                              </Truncate>
                              <Divider />
                              <Header.Subheader className="promo_desc" style={{ color: 'var(--title-dark)', fontWeight: 'bolder' }}>
                                <Truncate lines={3} ellipsis={<span>...</span>}>
                                  {promoData[0].more[1].desc}
                                </Truncate>
                              </Header.Subheader>
                            </Header.Content>
                          </Header>
                        </Segment>
                      </Grid.Column>
                    </Grid.Row>
                  </Responsive>
                </Grid.Row>
              )}
              <Grid.Row>
                <Grid.Column width={16}>
                  <Divider />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Container className="article-sort-container">
              <Grid.Row id="row_id">
                <Grid.Column width="16">
                  <Button.Group size="large" fluid className="article-sort">
                    {userInfo.id && (
                      <Button active={tabName == 'Feed'} onClick={() => this.handleOrderChange('Feed')}>Feed</Button>
                    )}
                    <Button active={tabName == 'Newest'} onClick={() => this.handleOrderChange('Newest')}>Latest</Button>
                    <Button active={tabName == 'Today'} onClick={() => this.handleOrderChange('Today')}>Today</Button>
                    <Button active={tabName == 'Week'} onClick={() => this.handleOrderChange('Week')}>Week</Button>
                    <Button active={tabName == 'Month'} onClick={() => this.handleOrderChange('Month')}>Month</Button>
                  </Button.Group>
                </Grid.Column>
              </Grid.Row>
            </Container>
            <Feed
              tabName={
                tabName
              }
              queryParams={
                `&author=${currentAuthorQuery}` + orderQuery
              }
            />
          </Responsive>
          <Responsive
            as={Grid.Column}
            width="16"
            minWidth={Responsive.onlyMobile.minWidth}
            maxWidth={Responsive.onlyTablet.maxWidth}
            className="some-class"
          >
            <Grid.Row>
              <Grid>
                <Grid.Row>
                  <Grid.Column width="16">
                    <Dropdown
                      defaultValue={options[1].value}
                      options={options}
                      onChange={(ev, { value }) => this.handleOrderChange(value)
                      }
                      style={{ background: 'var(--background-light)', color: 'var(--text-color)' }}
                      button
                      fluid
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Column width="14">
                  <Feed
                    tabName={
                      tabName
                    }
                    queryParams={
                      `&author=${currentAuthorQuery}` + orderQuery
                    }
                  />
                </Grid.Column>
              </Grid>
            </Grid.Row>
          </Responsive> */}
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
          engagementData: state.payout.payoutStats[0],
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
        getPowerUpData: id => dispatch(powerUpActions.getPowerUpData({ id })),
        getPayoutData: token => dispatch(payoutActions.getPayoutData({ token })),
      })
    )(Articles)
  )
);
