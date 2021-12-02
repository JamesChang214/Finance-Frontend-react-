import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Grid, Image, Container, Header, List, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { setPageForGoogleAnalytics } from '../../util/helperFunctions';
import * as api from './Api';
import SideControl from '../../yourtrybe/components/SideControl';

// import parslLogo from '../../staticAssets/images/parsl-logo.png';
// import chainceLogo from '../../staticAssets/images/chaince-logo.png';
// import worbliLogo from '../../staticAssets/images/worbli-logo.jpg';
// import eosphereLogo from '../../staticAssets/images/eosphere-logo.png';
// import triangles from '../../staticAssets/images/triangles.png';
// import blockchain from '../../staticAssets/images/blockchain.png';
// import arrowRight from '../../staticAssets/images/arrow-right.svg';
// import playImage from '../../staticAssets/images/play-circle.svg';
// import teamImage from '../../staticAssets/images/team.png';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acfData: null,
      engagements: null,
      authors: null,
      comments: null,
      rates: null,
    };
  }

  componentDidMount() {
    setPageForGoogleAnalytics('leaderboards');
    const cache = JSON.parse(localStorage.getItem('trybe_leaderboard'));
    const authors_cache = JSON.parse(localStorage.getItem('trybe_engagement_authors'));
    const comments_cache = JSON.parse(localStorage.getItem('trybe_engagement_comments'));
    const rates_cache = JSON.parse(localStorage.getItem('trybe_engagement_rates'));
    if (!cache || !authors_cache || !comments_cache || !rates_cache) {
      //Fetch and save cache
      api.getAuthorInfo().then((authors) => {
        this.setState({ authors });
        localStorage.setItem('trybe_engagement_authors', JSON.stringify(authors));
      });
      api.getCommentInfo().then((comments) => {
        this.setState({ comments });
        localStorage.setItem('trybe_engagement_comments', JSON.stringify(comments));
      });
      api.getRatingsInfo().then((rates) => {
        this.setState({ rates });
        localStorage.setItem('trybe_engagement_rates', JSON.stringify(rates));
      });
    } else {
      this.setState({ acfData: cache, authors: authors_cache, comments: comments_cache, rates: rates_cache });
      //Fetch new data in background
      api.getCommentInfo().then((comments) => {
        localStorage.setItem('trybe_engagement_comments', JSON.stringify(comments));
      });
      api.getAuthorInfo().then((authors) => {
        localStorage.setItem('trybe_engagement_authors', JSON.stringify(authors));
      });
      api.getRatingsInfo().then((rates) => {
        localStorage.setItem('trybe_engagement_rates', JSON.stringify(rates));
      });
    }
  }

  render() {
    const { rates, authors, comments } = this.state;
    comments && comments.sort((a, b) => { return b.comments - a.comments; });
    authors && authors.sort((a, b) => { return b.posts - a.posts; });
    rates && rates.sort((a, b) => { return b.rates - a.rates; });
    window.dataLayer.push({
      event: 'pageview',
      page: {
        url: '/leaderboard',
        title: 'Leaderboard'
      }
    });
    return (
      <Grid className="page-wrapper">
        <Helmet>
          <title>Loop Finance | Leaderboard</title>
        </Helmet>
        {/* {sidebarOpened && ( */}
        <SideControl />
        {/* )} */}
        <div className="leaderboard cz-leaderboard">
          <Container className="cz-leaderboard-table" fluid style={{ marginTop: '50px', marginBottom: '200px' }}>

            <Grid>
              <Grid.Row columns={3}>
                <Grid.Column>
                  <div className="leaderboard_header cz-leaderboard_header">
                    <Header as="h2">
                      <i><Image src="../top-rank.svg" /></i>
                      <Header.Content>
                        Top Commenter
                        <Header.Subheader>Weekly Comments</Header.Subheader>
                      </Header.Content>
                    </Header>
                  </div>
                  <div className="leaderboard_body">
                    {!comments && (<Loader active />)}
                    {comments && comments.map((data) => {
                      return (
                        <List celled as={Link} to={`../user/${data.user_id}/`}>
                          <List.Item>
                            <Image avatar src={data.avatar} className="leaderboard_body__picture" />
                            <List.Content>
                              <List.Header>{data.display_name}</List.Header>
                              <List.Description>@{data.rank}</List.Description>
                            </List.Content>
                            <List.Content floated="right">
                              <span className="percent_stat">{data.comments}</span>
                            </List.Content>
                          </List.Item>
                        </List>
                      );
                    })}
                  </div>
                </Grid.Column>

                <Grid.Column>
                  <div className="leaderboard_header">
                    <Header as="h2">
                      <i><Image src="../top-authors.svg" /></i>
                      <Header.Content>
                        Top Raters
                        <Header.Subheader>Weekly Ratings</Header.Subheader>
                      </Header.Content>
                    </Header>
                  </div>
                  <div className="leaderboard_body">
                    {!rates && (<Loader active />)}
                    {rates && rates.map((data) => {
                      return (
                        <List celled as={Link} to={`../user/${data.user_id}/`}>
                          <List.Item>
                            <Image avatar src={data.avatar} className="leaderboard_body__picture" />
                            <List.Content>
                              <List.Header>{data.display_name}</List.Header>
                              <List.Description>@{data.rank}</List.Description>
                            </List.Content>
                            <List.Content floated="right">
                              <span className="percent_stat">{data.rates}</span>
                            </List.Content>
                          </List.Item>
                        </List>
                      );
                    })}
                  </div>
                </Grid.Column>

                <Grid.Column>
                  <div className="leaderboard_header">
                    <Header as="h2">
                      <i><Image src="../top-authors.svg" /></i>
                      <Header.Content>
                        Top Authors
                        <Header.Subheader>Weekly Articles</Header.Subheader>
                      </Header.Content>
                    </Header>
                  </div>
                  <div className="leaderboard_body">
                    {!authors && (<Loader active />)}
                    {authors && authors.map((data) => {
                      return (
                        <List celled as={Link} to={`../user/${data.user_id}/`}>
                          <List.Item>
                            <Image avatar src={data.avatar} className="leaderboard_body__picture" />
                            <List.Content>
                              <List.Header>{data.display_name}</List.Header>
                              <List.Description>@{data.rank}</List.Description>
                            </List.Content>
                            <List.Content floated="right">
                              <span className="percent_stat">{data.posts}</span>
                            </List.Content>
                          </List.Item>
                        </List>
                      );
                    })}
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
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
  )(About)
);
