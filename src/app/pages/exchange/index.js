import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Container, Button, Header, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { setPageForGoogleAnalytics } from '../../util/helperFunctions';

class ExchangePage extends Component {
  componentDidMount() {
    setPageForGoogleAnalytics('exchange');
  }

  render() {
    const { history, userInfo } = this.props;
    window.dataLayer.push({
      event: 'pageview',
      page: {
        url: '/exchange',
        title: 'Exchange'
      }
    });
    return (
      <main className="homepage exchangeBg">
        <Helmet>
          <title>Loop Finance | Exchange</title>
        </Helmet>
        {/* ================   Hero section   =============== */}
        <div className="hero_banner_area cz-exchange exchange_banner_area">
          <Container>
            <Grid className="hero_section">
              <Grid.Row textAlign="center">
                <Grid.Column width={16}>
                  <Header as="h1" className="headerContent">Loop DEX is coming soon but in the meantime, join our community and we'll keep you in the LOOP!</Header>
                  <Image className="line" src="../img/headingLine.svg" alt="" />
                  <div className="headerBtnBox position-relative">
                    {!userInfo?.id && (
                      <Button className="btn headerBtn px-3 mb-2 mb-lg-0" onClick={() => history.push('/sign-up')}>Join Now</Button>
                    )}
                    {/* href="https://loopfinance.zendesk.com/hc/en-us/articles/4404148931353-Getting-Started-Loop-Intro" */}
                    <a style={userInfo?.id ? { minWidth: '100%' } : {}} onClick={() => history.push('/community/')} target="_blank" className="tutorialLink">
                      <Button style={userInfo?.id ? { minWidth: '100%' } : {}} className="btn headerBtn px-3 mb-2 mb-lg-0">Learn More</Button>
                    </a>
                  </div>
                  {/* <div className="cz-icons">
                    <a href="https://twitter.com/loop_finance?s=08" target="_blank" className="socialLink"><Image src="/twitter.webp" /></a>
                    <a href="https://t.me/loopfinance" target="_blank" className="socialLink"><Image src="/telegram.webp" /></a>
                  </div> */}
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Image className="homebg" src="../img/bg_home.svg" alt="homebg" />
          </Container>
        </div>
        {/* ================   Hero Section End  =============== */}
        {/* ================   Loop Screen Section  =============== */}
        <div className="bg-gradient-loop loop_screen">
          <Container style={{ marginBottom: '400px' }}>
            <Grid className="hero_section">
              <Grid.Row textAlign="center">
                <Grid.Column width={16}>
                  <Image style={{ filter: 'blur(8px)' }} className="img-fluid screen_one" src="../img/screenOne.svg" alt="" />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
        {/* ================   Loop Screen Section End =============== */}
      </main>
    );
  }
}
export default withRouter(
  connect(
    state => ({
      isAdmin: state.user.userInfo.extra_capabilities,
      userInfo: state.user.userInfo,
    }),
    // state => ({
    //   isAuthorized: state.user.userIsLogged
    // }),
    null
  )(ExchangePage)
);
