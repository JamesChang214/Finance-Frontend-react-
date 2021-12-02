import React, { Component } from 'react';
import { Container, Grid, Button, Image, Header, Card, List, Form, Tab, Menu } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';
import SwiperCore, { Navigation, Scrollbar, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import 'swiper/components/pagination/pagination.min.css';
import { connect } from 'react-redux';
import TextTruncate from 'react-text-truncate';
import Helmet from 'react-helmet';
import Feed from '../util/feed/Feed';
import { setPageForGoogleAnalytics } from '../util/helperFunctions';
import * as actions from '../yourtrybe/articles/articlesActions';
import * as api from './homeApi';
import MailchimpFormContainer from './mailChimpSubscribe';

// import parslLogo from '../../staticAssets/images/parsl-logo.png';
// import chainceLogo from '../../staticAssets/images/chaince-logo.png';
// import worbliLogo from '../../staticAssets/images/worbli-logo.jpg';
// import eosphereLogo from '../../staticAssets/images/eosphere-logo.png';
// import triangles from '../../staticAssets/images/triangles.png';
// import blockchain from '../../staticAssets/images/blockchain.png';
// import playImage from '../../staticAssets/images/play-circle.svg';
// import teamImage from '../../staticAssets/images/team.png';

class Home extends Component {
  constructor(props) {
    SwiperCore.use([Navigation, Scrollbar, Pagination]);
    super(props);
    this.updateCategoriesQuery = Home.updateCategoriesQuery;
    this.state = {
      acfData: null,
      getPromos: '',
      currentAuthorQuery: [],
      currentCategoryQuery: [],
      accordinValue: 'accordionLoop',
      email: ''
    };
  }

  componentDidMount() {
    setPageForGoogleAnalytics('home');
    const { getPromos, preChosenCategories } = this.props;
    const homeCache = JSON.parse(localStorage.getItem('trybe_home'));
    const promoCache = JSON.parse(localStorage.getItem('trybe_promos'));
    if (!homeCache) {
      //Fetch and save cache
      api.getAcfInfo().then((acfData) => {
        this.setState({ acfData });
        localStorage.setItem('trybe_home', JSON.stringify(acfData));
      });
    } else {
      this.setState({ acfData: homeCache });
      //Fetch new data in background
      api.getAcfInfo().then((acfData) => {
        this.setState({ acfData });
        localStorage.setItem('trybe_home', JSON.stringify(acfData));
      });
    }
    if (!promoCache) {
      getPromos();
    } else {
      this.setState({ getPromos: promoCache });
      getPromos();
    }
    api.getAuthors().then(acfData => this.setState({ acfData }));
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { acfData, currentAuthorQuery } = this.state;
    if (acfData?.authors && currentAuthorQuery?.length === 0) {
      this.sortOfficalAuthor();
    }
  }

  sortOfficalAuthor() {
    const { acfData } = this.state;
    const query = acfData.authors.map(({ id }) => [id]);
    this.setState({ currentAuthorQuery: query });
  }

  handleOnChangeEmail = email => {
    this.setState({
      email: email
    })
  }

  handleSendEmail = email => {
    console.log(email)
  }

  static updateCategoriesQuery(chosenCategories) {
    const query = chosenCategories[0]
      ? chosenCategories.map(({ id }) => id).join(',')
      : null;
    return query;
  }

  activeAccordin(value) {
    const { accordinValue } = this.state
    if (accordinValue == value) {
      this.setState({ accordinValue: '' })
    } else {
      this.setState({ accordinValue: value })
    }
  };


  render() {
    const { currentCategoryQuery, currentAuthorQuery, orderQuery, acfData, getPromos, accordinValue } = this.state;
    const { promos, history } = this.props;
    const promoData = getPromos ? getPromos : promos;
    const panes = [
      { menuItem: <Menu.Item><span>1</span>Tokenized Rewards</Menu.Item>, render: () => <Tab.Pane><span>Unlike existing social networks, who keep all the money for themselves – we reward you for your contribution to Loop!</span><span>By creating amazing content on Loop you will be rewarded by the community in the LOOP token - our very own cryptocurrency that can be exchanged for any other currency that you choose.</span><span>The better your content the higher the reward! Start sharing your knowledge and earning today!</span></Tab.Pane> },
      { menuItem: <Menu.Item><span>2</span>Great Articles</Menu.Item>, render: () => <Tab.Pane><span>Find great articles on a whole range of interesting topics and learn something new!</span><span>Keep up to date with topics of interest as our community scours the web for the most recent and relevant information and creates great content about it.</span></Tab.Pane> },
      { menuItem: <Menu.Item><span>3</span>Crypto Exchange</Menu.Item>, render: () => <Tab.Pane><span>Use our decentralised exchange to swap all of your Terra assets.</span><span>Provide liquidity to our exchange and start earning fees from trades and from yield farming.</span><span>Stake your LOOP tokens and start earning staking rewards today!</span></Tab.Pane> },
      { menuItem: <Menu.Item><span>4</span>Great Community</Menu.Item>, render: () => <Tab.Pane><span>Once upon a time, humans shared their knowledge, skills, and resources with their loop - that is what helped them to thrive.</span><span>In this day and age, it's more important than ever to be surrounded by the right people in order to succeed.</span><span>Join our rapidly growing network of forward thinking entrepreneurs, solopreneurs, cryptocurrency investors, ratbags, geniuses, and people who want to build a better life for ourselves and the world around us.</span></Tab.Pane> },
      { menuItem: <Menu.Item><span>5</span>Our Own Economy</Menu.Item>, render: () => <Tab.Pane><span>By incentivizing sharing of knowledge, skills, and resources through cryptocurrency rewards, we are not just building a community but our very own global, peer to peer economy-decentralized, and free from the tyranny and corruption of established governments and corporations.</span></Tab.Pane> },
      // { menuItem: `${6} Build Your Own Trybe`, render: () => <Tab.Pane><span>Would you like to start building your own community using our gamification and incentivized reward systems?</span><span>You choose the rules, and the rewards, based on the actions you want your users to make.</span><span>You can either use points and create reward tiers like a traditional loyalty program, or you can introduce your very own cryptocurrency token into the mix. TRVBE</span><span>Either way - we will help you get set up and started.</span></Tab.Pane> },
    ];

    if (!acfData) return null;
    // const panes = acfData.Tabs.map((pane) => {
    //   return {
    //     menuItem: pane.title,
    //     render: () => (
    //       <Tab.Pane>
    //         <img className="img-responsive" alt="dads" src={pane.image} key={pane.image} />
    //       </Tab.Pane>
    //     )
    //   };
    // });

    // const TabExampleVerticalTabular = () => (
    //   <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={panes} />
    // );

    // const Modalbutton = () => (
    //   <Modal
    //     trigger={(
    //       <Button className="tr-primary-button white play">
    //         <Image src={playImage} />
    //         Watch our video
    //       </Button>)}
    //     basic
    //     size="small">
    //     <Modal.Content>
    //       <Embed
    //         autoplay
    //         brandedUI
    //         color="white"
    //         hd
    //         iframe={{
    //           allowFullScreen: true,
    //           style: {
    //             padding: 10
    //           }
    //         }}
    //         placeholder={acfData.hero_video_cover}
    //         id={acfData.hero_video_link}
    //         source="vimeo"
    //       />
    //     </Modal.Content>
    //   </Modal>
    // );
    window.dataLayer.push({
      event: 'pageview',
      page: {
        url: '/',
        title: 'Homepage'
      }
    });
    return (

      <main className="homepage">
        {/* ================   Hero section   =============== */}
        <div className="homebg_section">

          <div className="hero_banner_area">
            <Container>
              <Grid className="hero_section">
                <Grid.Row textAlign="center">
                  <Grid.Column width={16}>
                    <Header as="h1" className="headerContent"><span>Loop</span>The Tokenized <br /> Community </Header>
                    <Image className="line" src="img/headingLine.svg" alt="img" />
                    <div class="ui list">
                      <div class="item"><a>Earn</a></div>
                      <div class="item"><a>Exchange</a></div>
                      <div class="item"><a>Create</a></div>
                      <div class="item"><a>on Terra</a></div>
                    </div>
                  </Grid.Column>

                  <Grid.Column width={16}>
                    <div className="main_action_btn cz-home-set-icons">
                      <div className="headerBtnBox position-relative">
                        <Button className="btn headerBtn px-3 mb-2 mb-lg-0" onClick={() => history.push('/sign-up')}>Join Now</Button>
                      </div>
                      <div className="cz-icons">
                        <a href="https://t.me/loopfinance" target="_blank" className="socialLink"><Image src="/img/tel-icon.png" /></a>
                        <a href="https://twitter.com/loop_finance?s=08" target="_blank" className="socialLink"><Image src="/img/twitter-icon.png" /></a>
                      </div>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>

              {/* <Grid>
              <Grid className="hero_features">
                <div className="innerBox">
                  <Header as="h6">1.3B</Header>
                  <p className="mb-0">LIQUIDITY</p>
                </div>
                <span>deco</span>
                <div className="innerBox">
                  <Header as="h6">203%</Header>
                  <p className="mb-0">COLLATERAL</p>
                </div>
                <span>deco</span>
                <div className="innerBox">
                  <Header as="h6">23</Header>
                  <p className="mb-0">INSTRUMENTS</p>
                </div>
                <span>deco</span>
                <div className="d-flex align-items-center innerBox">
                  <Header as="h6">55,000+</Header>
                  <p className="mb-0">USERS</p>
                </div>
              </Grid>
            </Grid> */}
              <Image className="homebg" src="img/bg_home.svg" alt="homebg" />
            </Container>
          </div>


          {/* ================   Hero Section End  =============== */}



          <div className="community_wrap">
            <div className="community_slider">
              <Swiper
                className="swiper-container-initialized swiper-container-horizontal"
                spaceBetween={70}
                slidesPerView={3}
                loop
                breakpoints={{
                  1199: {
                    freemode: true,
                    slidesPerView: 3,
                    spaceBetween: 70,
                  },
                  768: {
                    freemode: true,
                    slidesPerView: 2,
                    spaceBetween: 70,
                  },
                  320: {
                    freemode: true,
                    slidesPerView: 1,
                    spaceBetween: 20,
                  }
                }}
                keyboard={{
                  enabled: true,
                  onlyInViewport: true,
                }}
              //onSwiper={swiper => console.log(swiper)}
              //onSlideChange={() => console.log('slide change')}
              >
                <SwiperSlide>
                  <img src="/img/people.png" alt="" />
                  <h4>Community</h4>
                  <p>Join our community of Lunatics and earn LOOPR tokens for creating great content, engaging with others, and learning about the Terra ecosystem at the same time!</p>
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/img/dex-icon.png" alt="" />
                  <h4>DEX</h4>
                  <p>Trade a range of tokens on our DEX or provide liquidity to start earning swap fees and bonus LOOP tokens from our yield farms</p>
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/img/wallet-2.png" alt="" />
                  <h4>Wallet</h4>
                  <p>Our Chrome extension wallet and mobile wallets are coming soon, where you'll be able to see both your tokens and NFTs as well as trade directly on our DEX.</p>
                </SwiperSlide>

              </Swiper>

            </div>
          </div>
        </div>










        {/* ================   Loop Screen Section  =============== */}

        <div className="bg-gradient-loop loop_screen_home ">
          <Container>
            <Grid className="hero_section">
              <Grid.Row textAlign="center">
                <Grid.Column width={16} as={Link} to="/community/">
                  <Image className="img-fluid screen_one" src="img/screenTwo.svg" alt="" />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>

        {/* ================   Loop Screen Section End =============== */}

        {/* ================   Our Partner Section =============== */}

        <div className="bg-gradient-loop community_Tab partners community_partners">
          <Container>
            <Grid>
              <Grid.Row className="our_partner our_partner_main">
                <Grid.Column computer={8} mobile={16} tablet={9} className="innerboxx">
                  <Header as="h6" className="textGradient h6">OUR PARTNERS</Header>
                  <Header as="h2">Working with the community</Header>
                  <p>We&apos;re working with some of the best Terra community projects such as StarTerra, Pylon, Angel, Harpoon, Orion, Spar, Levana, and more!</p>
                </Grid.Column>
                <Grid.Column computer={8} mobile={16} tablet={7} className="innerboxx_image">
                  <Image className="img-fluid" src="img/icons.svg" alt="" />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>

        {/* ================   Our Partner Section End  =============== */}



        {/* ================   Our Partner Section =============== */}

        {/* <div className="bg-gradient-loop community_Tab partners performers_wrap">
          <Container>
            <Grid>
              <Grid.Row className="our_partner our_partner_main">
                <Grid.Column computer={8} mobile={16} tablet={7} className="innerboxx_image">
                  <Image className="img-fluid" src="img/performers_img.png" alt="" />
                </Grid.Column>
                <Grid.Column computer={8} mobile={16} tablet={9} className="innerboxx">
                  <Header as="h6" className="textGradient h6">TOP PERFORMERS</Header>
                  <Header as="h2">Please provide title here</Header>
                  <p>We're creating incentivised liquidity pools for the best Terra community projects such as Angel, Harpoon, Orion, Spar, Levana, and more!</p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div> */}

        {/* ================   Our Partner Section End  =============== */}


        {/* ================   Join Community Section  =============== */}
        <div className="bg-gradient-loop cz-join-community">
          <Container>
            <Grid>
              <Grid.Row className="join-community">
                <Grid.Column computer={16} mobile={16} tablet={16} className="innerboxx">
                  <Header as="h2"><b>Earn tokens<Image src="border-shadow.svg" /></b> for creating great content!</Header>
                  <p>Join our community of awesome lunatic content creators and start earning token just by writing about your favorite projects! Lear more NOW</p>
                  <div className="headerBtnBox">
                    <Button className="btn headerBtn px-3 mb-2 mb-lg-0" onClick={() => history.push('/sign-up')}>Join Our Community</Button>
                  </div>
                </Grid.Column>

                <Grid.Column className="join-community-card join-community-card-home" computer={16} mobile={16} tablet={16}>
                  <Feed
                    tabName="Latest"
                    queryParams={
                      `&author=${currentAuthorQuery}${currentCategoryQuery.length > 0 ? `&categories=${currentCategoryQuery}` : ``}&cache=false`
                    }
                  />
                </Grid.Column>

                {/* {postsData[0] ?
                  <Grid.Column className="join-community-card" computer={16} mobile={16} tablet={16}>
                    <Card>
                      <Image src="img/new-technology.png" wrapped ui={false} />
                      <Card.Content>
                        <Card.Header>Matthew</Card.Header>
                        <Card.Description>
                          Matthew is a musician living in Nashville.
                        </Card.Description>
                        <Card.Meta>
                          <Image src="img/pp.jpg" alt="" />
                          <span className="date">Joined in 2015</span>
                        </Card.Meta>
                      </Card.Content>
                    </Card>
                    <Card>
                      <Image src="img/ethereum.png" wrapped ui={false} />
                      <Card.Content>
                        <Card.Header>Ethereum</Card.Header>
                        <Card.Description>
                          Matthew is a musician living in Nashville.
                        </Card.Description>
                        <Card.Meta>
                          <Image src="img/pp.jpg" alt="" />
                          <span className="date">Joined in 2015</span>
                        </Card.Meta>
                      </Card.Content>
                    </Card>
                    <Card>
                      <Image src="img/gaming-future.png" wrapped ui={false} />
                      <Card.Content>
                        <Card.Header>Gaming Future</Card.Header>
                        <Card.Description>
                          Matthew is a musician living in Nashville.
                        </Card.Description>
                        <Card.Meta>
                          <Image src="img/pp.jpg" alt="" />
                          <span className="date">Joined in 2015</span>
                        </Card.Meta>
                      </Card.Content>
                    </Card></Grid.Column> : ''} */}
              </Grid.Row>
            </Grid>
          </Container>
        </div>

        {/* ================   Join Community Section End  =============== */}


        {/* ========================== Support Section ====================== */}

        {/* <div className="bg-gradient-loop">
          <Container className="cz-support">
            <Grid>
              <Grid.Row className="support-section">

                <Grid.Column className="support-img" computer={8} mobile={16} tablet={16}>
                  <Image className="img-fluid" src="img/support.jpg" alt="" />
                </Grid.Column>
                <Grid.Column computer={8} mobile={16} tablet={16} className="innerboxx">
                  <div className="support-text">
                    <Header as="h2">Support Exciting New Projects</Header>
                    <p>Get in from the ground up on some of the most exciting new projects in the crypto space!</p>
                    <p>We are collaborating with many other projects building Terra ecosystem to launch their own tokens on Loop!</p>
                    <p>By supporting these projects early, you can not only have satisfaction from helping build the financial system of the future, but you can also potentially gain access to the outsized returns                     that are often only reserved for VCs and other large investors</p>
                    <p>Crypto is bringing startup investing to the people!</p>
                    <a href="/exchange" className="mb-0 d-flex align-items-center learnMore">
                      Discover <Image src="img/learnMore.svg" alt="" />
                    </a>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div> */}

        {/* ========================== Support Section End ====================== */}



        {/*============= Basic features section =========*/}

        <div className="bg-gradient-loop community_Tab partners">
          <Container>
            <Grid>
              <Grid.Row className="our_partner">
                <Grid.Column computer={9} mobile={16} tablet={7} className="">
                  <Image className="img-fluid" src="/mob.svg" alt="" />
                </Grid.Column>
                <Grid.Column className="yield" computer={7} mobile={16} tablet={9}>
                  <Header as="h2" className="Farming">Community DEX</Header>
                  <p>Trade any tokens in the Terra Ecosystem</p>
                  <div className="accordion position-relative" id="accordionLoop">
                    <div className={accordinValue == 'accordionLoop' ? 'accordion-itemActive accordion-item' : 'accordion-item'}>
                      <h2 className="accordion-header" id="headingOne">
                        <button className="" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" onClick={() => { this.activeAccordin('accordionLoop'); }}>
                          <span>1</span> Earn
                        </button>
                      </h2>
                      <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionLoop">
                        <div className="accordion-body">
                          By providing liquidity, you earn a percentage of the trading fees every time someone makes a trade
                        </div>
                      </div>
                    </div>
                    <div className={accordinValue == 'headingTwo' ? 'accordion-itemActive accordion-item' : 'accordion-item'}>
                      <h2 className="accordion-header" id="headingTwo">
                        <button className="collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" onClick={() => { this.activeAccordin('headingTwo'); }}>
                          <span>2</span> Yield Farming
                        </button>
                      </h2>
                      <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionLoop">
                        <div className="accordion-body">
                          By providing liquidity, you earn a percentage of the trading fees every time someone makes a trade
                        </div>
                      </div>
                    </div>
                    <div className={accordinValue == 'headingThree' ? 'accordion-itemActive accordion-item' : 'accordion-item'}>
                      <h2 className="accordion-header" id="headingThree">
                        <button className="collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree" onClick={() => { this.activeAccordin('headingThree'); }}>
                          <span>3</span> Withdraw
                        </button>
                      </h2>
                      <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionLoop">
                        <div className="accordion-body">
                          By providing liquidity, you earn a percentage of the trading fees every time someone makes a trade
                        </div>
                      </div>
                    </div>
                    <div className={accordinValue == 'headingFour' ? 'accordion-itemActive accordion-item' : 'accordion-item'}>
                      <h2 className="accordion-header" id="headingFour">
                        <button className="collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour" onClick={() => { this.activeAccordin('headingFour'); }}>
                          <span>4</span> Liquidity Pools
                        </button>
                      </h2>
                      <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionLoop">
                        <div className="accordion-body">
                          By providing liquidity, you earn a percentage of the trading fees every time someone makes a trade
                        </div>
                      </div>
                    </div>

                    <img className="accordianLine" src="img/accordianLine.svg" alt="" />

                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>


        {/* Basic features section */}
        <div className="bg-gradient-loop cz-mobi-screens">
          <Container>
            <Grid>
              <Grid.Row className="appDownload">
                <Grid.Column computer={16} mobile={16} tablet={16} className="appDownload_box">
                  <h2>Mobile App</h2>
                  <p>We are building a mobile terra wallet where you can access our AMM as well as other great Defi protocols on Terra such as Mirror, Levana, Angel, Anchor, and others</p>
                  <div className="download_btns">
                    <a href="#"><Image src="img/ios.svg" alt="" /></a>
                    <a href="#"><Image src="img/playstore.svg" alt="" /></a>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>

        {/* ========================== TRUE SLIDER ====================== */}

        <Swiper
          className="cz-all-screens mobileApp swiper-full-mobile swiper-container-initialized swiper-container-horizontal"
          spaceBetween={50}
          slidesPerView={5}
          navigation
          loop
          centeredSlides
          slideToClickedSlide
          breakpoints={{
            768: {
              freemode: true,
              slidesPerView: 5,
              spaceBetween: 50,
            },
            640: {
              freemode: true,
              slidesPerView: 3,
              spaceBetween: 20,
            },
            320: {
              freemode: true,
              slidesPerView: 3,
              spaceBetween: 20,
            }
          }}
          keyboard={{
            enabled: true,
            onlyInViewport: true,
          }}
        //onSwiper={swiper => console.log(swiper)}
        //onSlideChange={() => console.log('slide change')}
        >
          <SwiperSlide><img src="/img/loop_m6.png" alt="" /></SwiperSlide>
          <SwiperSlide><img src="/img/loop_m7.png" alt="" /></SwiperSlide>
          <SwiperSlide><img src="/img/loop_m5.png" alt="" /></SwiperSlide>
          <SwiperSlide><img src="/img/loop_m1.png" alt="" /></SwiperSlide>
          <SwiperSlide><img src="/img/loop_m2.png" alt="" /></SwiperSlide>
          <SwiperSlide><img src="/img/loop_m3.png" alt="" /></SwiperSlide>
          <SwiperSlide><img src="/img/loop_m4.png" alt="" /></SwiperSlide>
        </Swiper>

        {/* ========================== TRUE FINANCIAL FREEDOM ====================== */}

        <div className="bg-gradient-loop integrationTab community_Tab">
          <Container>
            <Grid className="financial_freedom">
              <Grid.Row>
                <Grid.Column computer={10} mobile={16} tablet={16} className="appDownload_box">
                  <Header as="h6" className="textGradient integrationTabH6">TRUE FINANCIAL FREEDOM</Header>
                  <Header as="h2" className="integrationTabH2">Terra Station Apps</Header>
                  <p className="">The Loop DEX will be integrated natively inside the Terra Station apps! Whenever you make a trade inside Terra Station, if the price is better on Loop than Terra Swap then the trade will be made automatically through Loop.</p>
                  <Image src="/img/terraStation.jpeg" alt="" className="terraImg" />
                  {/* <div className="community_Tab">
                    <div className="accordion position-relative" id="accordionLoop1">
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                          <button className="" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            <span>1</span> Earn
                          </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionLoop1">
                          <div className="accordion-body">
                            By providing liquidity, you earn a percentage of the trading fees every time someone makes a trade
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingTwo">
                          <button className="collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            <span>2</span> Yield Farming
                          </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionLoop1">
                          <div className="accordion-body">
                            By providing liquidity, you earn a percentage of the trading fees every time someone makes a trade
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingThree">
                          <button className="collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                            <span>3</span> Withdraw
                          </button>
                        </h2>
                        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionLoop1">
                          <div className="accordion-body">
                            By providing liquidity, you earn a percentage of the trading fees every time someone makes a trade
                          </div>
                        </div>
                      </di3
                      v>
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingFour">
                          <button className="collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                            <span>4</span> Liquidity Pools
                          </button>
                        </h2>
                        <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionLoop1">
                          <div className="accordion-body">
                            By providing liquidity, you earn a percentage of the trading fees every time someone makes a trade
                          </div>
                        </div>
                      </div>
                      <img className="accordianLine" src="img/accordianLine.svg" alt="" />
                    </div>
                  </div> */}
                </Grid.Column>
                <Grid.Column computer={6} mobile={16} tablet={16} className="appDownload_box">
                  <Image className="integrationImg" src="img/integration.svg" alt="" />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>

        {/* ========================== Support Section ====================== */}

        <div className="bg-gradient-loop">
          <Container className="cz-support">
            <Grid>
              <Grid.Row className="support-section">

                <Grid.Column className="support-img" computer={8} mobile={16} tablet={16}>
                  <Image className="img-fluid" src="img/support.jpg" alt="" />
                </Grid.Column>
                <Grid.Column computer={8} mobile={16} tablet={16} className="innerboxx">
                  <div className="support-text">
                    <Header as="h2">Support Exciting New Projects</Header>
                    <p>Get in from the ground up on some of the most exciting new projects in the crypto space!</p>
                    <p>We are collaborating with many other projects building Terra ecosystem to launch their own tokens on Loop!</p>
                    <p>By supporting these projects early, you can not only have satisfaction from helping build the financial system of the future, but you can also potentially gain access to the outsized returns                     that are often only reserved for VCs and other large investors</p>
                    <p>Crypto is bringing startup investing to the people!</p>
                    <a href="/exchange" className="mb-0 d-flex align-items-center learnMore">
                      Discover <Image src="img/learnMore.svg" alt="" />
                    </a>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>

        {/* ========================== Support Section End ====================== */}

        {/* ========================== Exchange Section ====================== */}

        <div className="bg-gradient-loop decentralized_wrap">
          <Container className="cz-support">
            <Grid>
              <Grid.Row className="exchange-section">
                <Grid.Column computer={8} mobile={16} tablet={16} className="innerboxx">
                  <Header as="h2">Why a <b>Decentralized<Image src="border-shadow.svg" /></b> Exchange?</Header>
                  <p>Decentralized exchanges (DEX's) like Loop work totally differently from a centralized exchange like Coinbase or Binance</p>
                  <p>You may have heard of "DeFi" or Decentralized Finance? A DEX like Loop is part of this technology - built totally on the blockchain.</p>
                  <p>You retain control of your cryptocurrencies at all times - They're stored in your wallet (the TerraStation extension) which means you can never get banned or blocked and never lose access to your assets.</p>
                  <p>Learn more about why and how to create your own crypto wallet like Terra Station here.</p>
                  <div className="headerBtnBox">
                    <a href="https://loopfinance.zendesk.com/hc/en-us" className="tutorialLink" target="_blank"><Button className="btn headerBtn px-3 mb-2 mb-lg-0">Tutorials</Button></a>
                  </div>
                </Grid.Column>
                <Grid.Column className="exchange-img" computer={8} mobile={16} tablet={16}>
                  <Image className="img-fluid" src="img/icons-dots.svg" alt="" />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>

        {/* ========================== Exchange Section End ====================== */}


        {/* ========================== loop Section ====================== */}

        <div className="bg-gradient-loop feedback_wrap">
          <Grid className="loop-grid">
            <Grid.Row className="loop-section">
              <Grid.Column className="loop-img" computer={8} mobile={16} tablet={12}>
                <Image className="img-fluid" src="img/loop.jpg" alt="" />
              </Grid.Column>
              <Grid.Column computer={8} mobile={16} tablet={16} className="innerboxx">
                <div className="loop-text">
                  <Header as="h6" className="textGradient integrationTabH6">BRINGING START-UP INVESTING TO PEOPLE</Header>
                  <Header as="h2">Loop Positive Feedback Fund</Header>
                  <p><b>10% of the LOOP token</b> supply will be put into a special fund called the Loop Positive Feedback Fund, managed by Angel Protocol! (LINK).</p>
                  <p>Income from this pool will go towards projects which are aimed at improving the world we live in.</p>
                  <p>These can be environmental or social projects, and can be voted on by the whole community!</p>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>

        {/* ========================== Loop Section End ====================== */}

        {/* ========================== Team Section ====================== */}

        <div className="bg-gradient-loop testimonial_slider">
          <Grid>
            <Grid.Row className="appDownload">
              <Grid.Column computer={16} mobile={16} tablet={16} className="appDownload_box">
                <h2>Team Members</h2>
                <p>We have an awesome team working hard to bring you one of the best protocols in the Terra ecosystem!</p>
              </Grid.Column>
              <Grid.Column computer={16} mobile={16} tablet={16} className="team-slider">
                <Swiper
                  className="swiper-full-mobile swiper-container-initialized swiper-container-horizontal"
                  spaceBetween={30}
                  slidesPerView={5}
                  navigation
                  loop
                  centeredSlides
                  slideToClickedSlide
                  breakpoints={{
                    768: {
                      freemode: true,
                      slidesPerView: 5,
                      spaceBetween: 30,
                    },
                    640: {
                      freemode: true,
                      slidesPerView: 1,
                      spaceBetween: 20,
                    },
                    320: {
                      freemode: true,
                      slidesPerView: 1,
                      spaceBetween: 20,
                    }
                  }}
                  keyboard={{
                    enabled: true,
                    onlyInViewport: true,
                  }}
                //onSwiper={swiper => console.log(swiper)}
                //onSlideChange={() => console.log('slide change')}
                >
                  <SwiperSlide>
                    <Card className="team_member">
                      <Image src="/img/thomas.png" className="memberImg" wrapped ui={false} />
                      <Card.Content>
                        <Card.Header>THOMAS NORWOOD <small>Business entrepreneur</small></Card.Header>
                        <p>Tom is the head honcho at Loop Finance. He’s a serial entrepreneur with experience across multiple industries. He’s been building software for 20 years and blockchain products for five (and likes to write fiction novels on the side).</p>
                        <Card.Meta className="social-menu-image">
                          <a href="https://www.linkedin.com/in/tom-norwood-64380ab3/" target="_blank">
                            <Image src="/linked.webp" alt="" />
                          </a>
                          {/* <Image src="img/be.png" alt="" />
                          <Image src="img/facebook.png" alt="" />
                          <Image src="img/apple.png" alt="" />
                          <Image src="img/twitter.png" alt="" /> */}
                        </Card.Meta>
                      </Card.Content>
                    </Card>
                  </SwiperSlide>

                  <SwiperSlide>
                    <Card className="team_member">
                      <Image src="img/marcela.png" wrapped ui={false} />
                      <Card.Content>
                        <Card.Header>MARCELA RODRIGUEZ <small>Portfolio Management</small></Card.Header>
                        <p>Marcela is in-charge of Loop’s financial plan. She has worked as a portfolio manager for government funds in the past and is highly knowledgeable at running businesses in different industries. She’s a natural entrepreneur.</p>
                        <Card.Meta className="social-menu-image">
                          <a href="https://www.linkedin.com/in/marcelarodriguezd/" target="_blank">
                            <Image src="/linked.webp" alt="" />
                          </a>
                          {/* <Image src="img/be.png" alt="" />
                          <Image src="img/facebook.png" alt="" />
                          <Image src="img/apple.png" alt="" />
                          <Image src="img/twitter.png" alt="" /> */}
                        </Card.Meta>
                      </Card.Content>
                    </Card>
                  </SwiperSlide>
                  <SwiperSlide>
                    <Card className="team_member">
                      <Image src="img/simon.png" wrapped ui={false} />
                      <Card.Content>
                        <Card.Header>SIMON RAHME<small>App Developer</small></Card.Header>
                        <p>Simon is the co-Founder of Loop. He is a mastermind at bringing the blockchain to the real world. He has helped carry many projects to the finish line in addition to consulting Fortune 100 & FTSE 100 companies.</p>
                        <Card.Meta className="social-menu-image">
                          <a href="https://www.linkedin.com/in/smartercryptoapps/" target="_blank">
                            <Image src="/linked.webp" alt="" />
                          </a>
                          {/* <Image src="img/be.png" alt="" />
                          <Image src="img/facebook.png" alt="" />
                          <Image src="img/apple.png" alt="" />
                          <Image src="img/twitter.png" alt="" /> */}
                        </Card.Meta>
                      </Card.Content>
                    </Card>
                  </SwiperSlide>
                  <SwiperSlide>
                    <Card className="team_member">
                      <Image src="img/marco.png" wrapped ui={false} />
                      <Card.Content>
                        <Card.Header>MARCO TEBALDI<small>Product Manager</small></Card.Header>
                        <p>Marco prides himself in bringing a product to the customer that provides real value. He’s responsible for leading the build of Loop Markets; the first AMM DEX on Terra, a fully decentralised exchange on the blockchain.</p>
                        <Card.Meta className="social-menu-image">
                          <a href="https://www.linkedin.com/in/mtebaldi/" target="_blank">
                            <Image src="/linked.webp" alt="" />
                          </a>
                          {/* <Image src="img/be.png" alt="" />
                          <Image src="img/facebook.png" alt="" />
                          <Image src="img/apple.png" alt="" />
                          <Image src="img/twitter.png" alt="" /> */}
                        </Card.Meta>
                      </Card.Content>
                    </Card>
                  </SwiperSlide>
                  <SwiperSlide>
                    <Card className="team_member">
                      <Image src="/img/chad.jpeg" wrapped ui={false} />
                      <Card.Content>
                        <Card.Header>CHAD STEPHENS<small>Co-founder</small></Card.Header>
                        <p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>
                        <Card.Meta className="social-menu-image">
                          <a href="https://www.linkedin.com/in/chadstephens1/" target="_blank">
                            <Image src="/linked.webp" alt="" />
                          </a>
                          {/* <Image src="img/be.png" alt="" />
                          <Image src="img/facebook.png" alt="" />
                          <Image src="img/apple.png" alt="" />
                          <Image src="img/twitter.png" alt="" /> */}
                        </Card.Meta>
                      </Card.Content>
                    </Card>
                  </SwiperSlide>
                  <SwiperSlide>
                    <Card className="team_member">
                      <Image src="/img/eric.png" wrapped ui={false} />
                      <Card.Content>
                        <Card.Header>Eric East<small>Lead Developer</small></Card.Header>
                        <p>Eric is a senior full stack blockchain developer. He helps businesses and agencies achieve high-quality websites and services through Blockchain.</p>
                        <Card.Meta className="social-menu-image">
                          <a href="https://www.linkedin.com/in/ericeastco" target="_blank">
                            <Image src="/linked.webp" alt="" />
                          </a>
                        </Card.Meta>
                      </Card.Content>
                    </Card>
                  </SwiperSlide>
                  <SwiperSlide>
                    <Card className="team_member">
                      <Image src="/img/alex.jpg" wrapped ui={false} />
                      <Card.Content>
                        <Card.Header>Alex Bezen<small>Lead Mathematician</small></Card.Header>
                        <p>Alex is a brilliant mathematician focused on some of the most complex algorithms behind Loop’s product. He’s a consultant in mathematics, statistics, and IT.</p>
                        <Card.Meta className="social-menu-image">
                          <a href="https://www.linkedin.com/in/alex-bezen-700a1b60/" target="_blank">
                            <Image src="/linked.webp" alt="" />
                          </a>
                        </Card.Meta>
                      </Card.Content>
                    </Card>
                  </SwiperSlide>
                  <SwiperSlide>
                    <Card className="team_member">
                      <Image src="/img/tristan.jpg" wrapped ui={false} />
                      <Card.Content>
                        <Card.Header>Tristan Pollock<small>Head of Marketing</small></Card.Header>
                        <p>Tristan is a tech entrepreneur, community builder, and startup investor who's directed $30M in venture capital into 200 companies as a Silicon Valley VC and accelerator director. Oh, yeah -- and he has worked with Kanye West, Google, and Nike.</p>
                        <Card.Meta className="social-menu-image">
                          <a href="https://www.linkedin.com/in/tristanpollock/" target="_blank">
                            <Image src="/linked.webp" alt="" />
                          </a>
                        </Card.Meta>
                      </Card.Content>
                    </Card>
                  </SwiperSlide>
                  <SwiperSlide>
                    <Card className="team_member">
                      <Image src="/img/adam.jpg" wrapped ui={false} />
                      <Card.Content>
                        <Card.Header>Adam Cheshier<small>Head of Content and Social Media</small></Card.Header>
                        <p>Adam leads the content strategy for Loop’s thriving community of creators and users. He’s a prolific writer (part-time author) focused on impact-driven content for a number of nonprofit organizations.</p>
                        <Card.Meta className="social-menu-image">
                          <a href="https://www.linkedin.com/in/adamcheshier/" target="_blank">
                            <Image src="/linked.webp" alt="" />
                          </a>
                        </Card.Meta>
                      </Card.Content>
                    </Card>
                  </SwiperSlide>
                </Swiper>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>

        {/* ========================== Team Section End ====================== */}


        {/* ================   Join Community Section  =============== */}
        <div className="bg-gradient-loop start-learning">
          <Container className="cz-support cz-support-set">
            <Grid>
              <Grid.Row className="join-community start-learning">
                <Grid.Column computer={16} mobile={16} tablet={16} className="innerboxx">
                  <Header as="h2">Start learning today</Header>
                  <p>Begin your learning journey today about crypto and start earning while doing so. Crypto has a huge potential, you dont want to miss these amazing articles on it</p>
                  <a href="/community" className="mb-0 d-flex align-items-center learnMore">
                    View all <Image src="img/learnMore.svg" alt="" />
                  </a>
                </Grid.Column>
                <Grid.Column className="start-learning-card" computer={16} mobile={16} tablet={16}>

                  <Swiper
                    slidesPerView={3}
                    spaceBetween={30}
                    navigation
                    loop
                    className="mySwiper"
                    slideToClickedSlide
                    breakpoints={{
                      1200: {
                        freemode: true,
                        slidesPerView: 3,
                        spaceBetween: 20,
                      },
                      768: {
                        freemode: true,
                        slidesPerView: 2,
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
                  //onSwiper={swiper => console.log(swiper)}
                  //onSlideChange={() => console.log('slide change')}
                  >
                    {promoData?.map(data => (
                      <div>
                        <SwiperSlide>
                          <Card href={data?.article_link}>
                            <Image src={data?.article_image} wrapped ui={false} />
                            <Card.Content>
                              <Card.Header>
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
                              </Card.Description>
                            </Card.Content>
                          </Card>
                        </SwiperSlide>
                      </div>
                    ))}
                  </Swiper>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>

        {/* ================   Join Community Section End  =============== */}

        {/* ========================== rewards Section ====================== */}

        <div className="bg-gradient-loop cz-rewards-hub">
          <Container>
            <Grid className="loop-grid">
              <Grid.Row className="rewards-section cz-rewards">
                <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={panes} />
                <Image src="img/reward.png" className="rewa-bg" wrapped ui={false} />
                {/* <Grid.Column className="rewards-list" computer={7} mobile={16} tablet={7}>
                  <List link inverted>
                    <List.Item as="a"><b>1</b>Tokenized Reward</List.Item>
                    <List.Item as="a"><b>2</b>Great Articles</List.Item>
                    <List.Item as="a"><b>3</b>Crypto Exchange</List.Item>
                    <List.Item as="a"><b>4</b>Great Community</List.Item>
                    <List.Item as="a"><b>5</b>Our Own Economy</List.Item>
                    <List.Item as="a"><b>6</b>Build your own Loop</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column computer={9} mobile={16} tablet={9} className="innerboxx reward-bg">
                  <Image src="img/reward.png" className="rewa-bg" wrapped ui={false} />
                  <div className="rewards-text">
                    <p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequa.</p>
                    <p>You may have heard of DeFi or Decentralized Finance? A DEX like Loop is part of this technology - built totally on the blockchain.</p>
                    <p>You retain control of your cryptocurrencies at all times - they are stored in your wallet (the TerraStation extension) which means you can never get banned or blocked and never lose access to your assets.</p>
                  </div>
                </Grid.Column> */}
              </Grid.Row>
            </Grid>
          </Container>
        </div>

        {/* ========================== Loop Section End ====================== */}

        {/* ========================== Newsletter Section ====================== */}

        <div className="bg-gradient-loop newsletter-wrap">
          <Container>
            <Grid className="loop-grid">
              <Grid.Row className="newsletter-section">
                <Grid.Column className="newsletter-form" computer={7} mobile={16} tablet={10}>
                  <Header as="h2">Subscribe to our newsletter</Header>
                  <p>Never miss a 10xer</p>
                  <MailchimpFormContainer email={this.state.email} handleOnChangeEmail={this.handleOnChangeEmail} handleSendEmail={this.handleSendEmail} />
                </Grid.Column>
                <Grid.Column computer={9} mobile={16} tablet={6} className="innerboxx newsletter-img">
                  <Image src="img/newsletter.png" wrapped ui={false} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>

        {/* ========================== Newsletter Section End ====================== */}





        {/* ========================== Exchange Section ====================== */}

        <div className="bg-gradient-loop team-section">
          <Container className="cz-support">
            <Grid>
              <Grid.Row className="team-section">
                <Grid.Column computer={8} mobile={16} tablet={8} className="innerboxx">
                  <Header as="h6" className="textGradient h6">JOIN THE TEAM</Header>
                  <Header as="h2">We’re Expanding!</Header>
                </Grid.Column>

                <Grid.Column className="view_more" computer={8} mobile={16} tablet={8}>
                  <a href="mailto:jointheteam@loop.markets">Email us <Image src="img/go-icon.png" /></a>
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <Grid columns={3} divided>
              <Grid.Row className="team-box">
                <Grid.Column className="innerboxx">
                  <div className="content">
                    <Header as="h4">Product Manager</Header>
                    <p className="description">We’re listening to the community and constantly adding more exciting products and features into the loop</p>
                    <List>
                      <List.Item>Full time</List.Item>
                    </List>
                  </div>
                </Grid.Column>

                <Grid.Column className="innerboxx">
                  <div className="content">
                    <Header as="h4">PR & Partnerships</Header>
                    <p className="description">Loop strives to partner with amazing projects and people - not reinvent the wheel & copy paste. Let’s work together!</p>
                    <List>
                      <List.Item>Full time</List.Item>
                    </List>
                  </div>
                </Grid.Column>

                <Grid.Column className="innerboxx">
                  <div className="content">
                    <Header as="h4">NFT Specialist</Header>
                    <p className="description">Exciting times ahead on how we’re integrating with everything NFT, we need a bit more devpower here</p>
                    <List>
                      <List.Item>Full time</List.Item>
                    </List>
                  </div>
                </Grid.Column>

                <Grid.Column className="innerboxx">
                  <div className="content">
                    <Header as="h4">DevOps Engineer</Header>
                    <p className="description">We’re growing quickly - we cant let our users down by being offline or not overdelivering on what we promise</p>
                    <List>
                      <List.Item>Full time</List.Item>
                      <List.Item>2 Positions</List.Item>
                    </List>
                  </div>
                </Grid.Column>

                <Grid.Column className="innerboxx">
                  <div className="content">
                    <Header as="h4">Rust Developers</Header>
                    <p className="description">We have many ground breaking features on the way & even more incredible projects we help develop</p>
                    <List>
                      <List.Item>Full time</List.Item>
                      <List.Item>3 Positions</List.Item>
                    </List>
                  </div>
                </Grid.Column>

                <Grid.Column className="innerboxx">
                  <div className="content">
                    <Header as="h4">Full Stack Developer</Header>
                    <p className="description">You’re a rare breed if you have solid Blockchain experience. We’d love to know what you’ve done on Terra</p>
                    <List>
                      <List.Item>Full time</List.Item>
                      <List.Item>2 Positions</List.Item>
                    </List>
                  </div>
                </Grid.Column>
              </Grid.Row>

            </Grid>
          </Container>
        </div >







        {/* ========================== Exchange Section End ====================== */}












        {/* ========================== Footer ====================== */}

        <div className="bg-gradient-loop">
          <Container>
            <Grid className="loop-grid">
              <Grid.Row className="footer-section">
                <Grid.Column className="about-company" computer={5} mobile={16} tablet={7}>
                  <Image src="/img/logo-header.png" wrapped ui={false} alt="loop-Logo" className="footerLogo" />
                  <p>The first AMM DEX on Terra with incentivised liquidity pools!</p>
                  <small>© Loop Finance 2021 All Rights Reserved</small>
                </Grid.Column>
                <Grid.Column className="link-design" computer={3} mobile={16} tablet={7}>
                  <Header as="h2">Quick Links</Header>
                  <List link inverted>
                    <List.Item as="a">Privacy Policy</List.Item>
                    <List.Item as="a">Features</List.Item>
                    <List.Item as="a">How it works</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column className="address-design" computer={3} mobile={16} tablet={7}>
                  <Header as="h2">Contact Info</Header>
                  <p><span><Image src="img/mail.svg" wrapped ui={false} className="mail-icon" /></span><a href="mailto: info@loop.do">info@loop.do</a></p>
                  <p><span><Image src="img/loc.svg" wrapped ui={false} className="loc-icon" /></span><a href="https://www.google.com/maps/place/Atrium+Tower/@8.9846348,-79.5237687,17z/data=!3m1!4b1!4m5!3m4!1s0x8faca8fb537b46a7:0xed03d8f6c25c5b22!8m2!3d8.9846348!4d-79.52158" target="_blank">27th floor, Atrium Tower, Obarrio, Panama City, Republic of Panama</a></p>
                </Grid.Column>


                {/* <Grid.Column computer={5} mobile={16} tablet={9} className="innerboxx newsletter-img">
                  <Swiper pagination className="mySwiper">
                    <SwiperSlide>
                      <div className="tesi-design">
                        <p><Image src="img/q.svg" wrapped ui={false} className="q-icon" /><Image src="img/q.svg" wrapped ui={false} className="q-icon q-icon1" /><span>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</span></p>
                        <Image src="img/twitter.svg" wrapped ui={false} className="twitter-icon" />
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="tesi-design">
                        <p><Image src="img/q.svg" wrapped ui={false} className="q-icon" /><Image src="img/q.svg" wrapped ui={false} className="q-icon q-icon1" /><span>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</span></p>
                        <Image src="img/twitter.svg" wrapped ui={false} className="twitter-icon" />
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="tesi-design">
                        <p><Image src="img/q.svg" wrapped ui={false} className="q-icon" /><Image src="img/q.svg" wrapped ui={false} className="q-icon q-icon1" /><span>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</span></p>
                        <Image src="img/twitter.svg" wrapped ui={false} className="twitter-icon" />
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="tesi-design">
                        <p><Image src="img/q.svg" wrapped ui={false} className="q-icon" /><Image src="img/q.svg" wrapped ui={false} className="q-icon q-icon1" /><span>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</span></p>
                        <Image src="img/twitter.svg" wrapped ui={false} className="twitter-icon" />
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </Grid.Column> */}
              </Grid.Row>
            </Grid>
          </Container>
        </div>

        {/* ========================== Footer End ====================== */}


      </main >
    );
  }
}
export default withRouter(
  connect(
    (state, ownProps) => {
      return {
        promos: state.articles.promos,
      };
    },
    dispatch => ({
      getPromos: () => dispatch(actions.getAllPromos())
    })
  )(Home)
);