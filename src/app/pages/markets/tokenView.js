import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Responsive, Button, Container, Image, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setPageForGoogleAnalytics } from '../../util/helperFunctions';
import * as api from './Api';
import Helmet from 'react-helmet';
import SideControl from '../../yourtrybe/components/SideControl';
import Feed from '../../util/feed/Feed'
import { Line } from 'react-chartjs-2';

// import parslLogo from '../../staticAssets/images/parsl-logo.png';
// import chainceLogo from '../../staticAssets/images/chaince-logo.png';
// import worbliLogo from '../../staticAssets/images/worbli-logo.jpg';
// import eosphereLogo from '../../staticAssets/images/eosphere-logo.png';
// import triangles from '../../staticAssets/images/triangles.png';
// import blockchain from '../../staticAssets/images/blockchain.png';
// import arrowRight from '../../staticAssets/images/arrow-right.svg';
// import playImage from '../../staticAssets/images/play-circle.svg';
// import teamImage from '../../staticAssets/images/team.png';

class TokensPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acfData: null
    };
  }

  componentDidMount() {
    setPageForGoogleAnalytics('defi');
    //api.getAcfInfo().then(acfData => this.setState({ acfData }));
  }

  render() {
    const { acfData } = this.state;
    const { match } = this.props;
    const tokenName = window.location.pathname;
    const { id } = match.params;
    const state = {
      labels: ['May 8', 'May 9', 'May 10',
        'May 11', 'May 12'],
      datasets: [
        {
          label: '',
          fill: false,
          lineTension: 1,
          backgroundColor: 'rgba(42, 132, 155, 255)',
          borderColor: 'rgba(42, 132, 155, 255)',
          borderWidth: 3,
          data: [65, 59, 80, 81, 56]
        }
      ]
    }

    return (
      <Grid>
        <Helmet>
          <title>Loop Finance | Token View</title>
        </Helmet>
        <Grid className="page-wrapper cz-new-edit">
          <SideControl />
          <Grid className="cz-new-js">
            <div className="cz-feedSection tokenGraph person-detialing">
              <Grid>
                <Grid.Row>
                  <Grid.Column width="4" className="avatar cz-profile-avtar">
                    <div className="circle-border">
                      <div
                        className="circle"
                      // style={{ backgroundImage: `url(${avatarURL})` }}
                      />
                      <Image src="../../pp-profile.png"></Image>
                      <div className="online-mark" />
                    </div>
                  </Grid.Column>
                  <Grid.Column width="12" className="description cz-decription">
                    <span className="name">'Terra'</span>

                    <span className="nick"></span>
                    <div className="rank">
                      <span>Rank:</span> <span>Trybe Apprentice</span>
                    </div>

                    <div className="two-butons-folder">
                      <Button><Image src="../../f-plus-folder.svg"></Image></Button>
                      <Button>TRADE</Button>
                    </div>
                    <div class="all-cz-socials">
                      <span><Image src="../../wwwp.svg" />Website</span>
                      <span><Image src="../../twitterp.svg" />Twitter</span>
                      <span><Image src="../../telegramp.svg" />Telegram</span>
                    </div>
                    <div className="cz-dummy-text-profile"><p>Terra is a blockchain protocol that uses fiat-pegged stablecoins to power price-stable global payments systems. According to its white paper, Terra combines the price stability and wide adoption of fiat currencies with the censorship-resistance of Bitcoin (BTC) and offers fast and affordable settlements.</p></div>
                    <div className="total-events-cz">
                      <Grid>
                        <Grid><span className="title">Price:</span> <span className="value">$6.68</span></Grid>
                        <Grid><span className="title">Market Cap:</span> <span className="value">$62,041,108,123</span></Grid>
                        <Grid><span className="title cz-up-down-green">2.15%</span></Grid>
                      </Grid>
                    </div>
                    <div className="total-events-cz cz-new-tokens-set">
                      <Grid>
                        <Grid><span className="title">Daily Deluted Market Cap:</span> <span className="value">$183,041,108,123</span></Grid>
                        <Grid><span className="title cz-up-down-green">8.78%</span></Grid>
                      </Grid>
                    </div>
                  </Grid.Column>
                  <div className="cz-folow-counts">
                    <div className="cz-set-p"><div className="cz-follow-part"><b><Image src="/following.svg" />234 Following</b> <b><Image src="/followers.svg" />76 Followers</b></div>
                      <Button>TRADE</Button>
                    </div>
                    <p>1234</p>
                  </div>
                  <div className="total-events-cz cz-mob-new-follow">
                    <Grid>
                      <Grid><span className="title">Posts:</span> <span className="value">12</span></Grid>
                      <Grid><span className="title">Comments:</span> <span className="value">56</span></Grid>
                      <Grid><span className="title">Views:</span> <span className="value">98</span></Grid>
                      <Grid><span className="title">Token balance:</span> <span className="value">2345</span></Grid>
                    </Grid>
                  </div>
                  <div>
                  </div>
                </Grid.Row>
              </Grid>
            </div>
            <div className="cz-feedSection tokenGraph person-detialing only-mobile-small">
              <Grid>
                <Grid.Row>
                  <Grid.Column width="4" className="avatar cz-profile-avtar">
                    <div className="circle-border">
                      <div
                        className="circle"
                      // style={{ backgroundImage: `url(${avatarURL})` }}
                      />
                      <Image src="../../pp-profile.png"></Image>
                      <div className="online-mark" />
                    </div>
                  </Grid.Column>
                  <Grid.Column width="12" className="description cz-decription">
                    <span className="name">'Terra'</span>

                    <span className="nick"></span>
                    <div className="rank">
                      <span>Rank:</span> <span>Trybe Apprentice</span>
                    </div>

                    <div className="two-butons-folder">
                      <Button><Image src="/f-plus-folder.svg"></Image></Button>
                      <Button>TRADE</Button>
                    </div>
                    <div className="cz-dummy-text-profile"><p>Terra is a blockchain protocol that uses fiat-pegged stablecoins to power price-stable global payments systems. According to its white paper, Terra combines the price stability and wide adoption of fiat currencies with the censorship-resistance of Bitcoin (BTC) and offers fast and affordable settlements.</p></div>

                    <div class="all-cz-socials">
                      <span><Image src="../../wwwp.svg" />Website</span>
                      <span><Image src="../../twitterp.svg" />Twitter</span>
                      <span><Image src="../../telegramp.svg" />Telegram</span>
                    </div>
                    <div className="total-events-cz">
                      <Grid>
                        <Grid><span className="title">Price:</span> <span className="value">$6.68</span></Grid>
                        <div className="empty-mobile"></div>
                        <div className="cz-flex-set"><Grid><span className="title">Market Cap:</span> <span className="value">$62,041,108,123</span></Grid>
                          <Grid><span className="title cz-up-down-green">2.15%</span></Grid></div>
                      </Grid>
                    </div>
                    <div className="total-events-cz cz-new-tokens-set">
                      <Grid>
                        <div className="cz-flex-set"><Grid><span className="title">Daily Deluted Market Cap:</span> <span className="value">$183,041,108,123</span></Grid>
                          <Grid><span className="title cz-up-down-green">8.78%</span></Grid></div>
                      </Grid>
                    </div>
                  </Grid.Column>
                  <div className="cz-folow-counts">
                    <div className="cz-set-p"><div className="cz-follow-part"><b><Image src="/following.svg" />234 Following</b> <b><Image src="/followers.svg" />76 Followers</b></div>
                      <Button>TRADE</Button>
                    </div>
                    <p>1234</p>
                  </div>
                  <div>
                  </div>
                </Grid.Row>
              </Grid>
            </div>
            <div className="cz-feedSection tokenGraph">
              <Line
                data={state}
                options={{
                  title: {
                    display: true,
                    text: 'Luna Live Price',
                    fontSize: 20
                  },
                  legend: {
                    display: true,
                    position: 'right'
                  }
                }}
              />
            </div>
            <div className="cz-feedSection cz-feedSection-padding official_news">
              <h1>Official News</h1>
              <Feed
                tabName='Latest'
              // queryParams={
              //   `&author=${currentAuthorQuery}${currentCategoryQuery && `&categories=${currentCategoryQuery}`}`
              //   + orderQuery
              // }
              />
            </div>
            <div className="cz-feedSection cz-feedSection-padding">
              <h1>Community News</h1>
              <Feed
                tabName='Today'
              // queryParams={
              //   `&author=${currentAuthorQuery}${currentCategoryQuery && `&categories=${currentCategoryQuery}`}`
              //   + orderQuery
              // }
              />
            </div>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
export default withRouter(
  connect(
    state => ({
      isAdmin: state.user.userInfo.extra_capabilities,
    }),
    // state => ({
    //   isAuthorized: state.user.userIsLogged
    // }),
    null
  )(TokensPage)
);
