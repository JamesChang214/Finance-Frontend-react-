import React, { Component } from 'react';
import { Container, Grid, List } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setPageForGoogleAnalytics } from '../../util/helperFunctions';
import * as api from './Api';

// import parslLogo from '../../staticAssets/images/parsl-logo.png';
// import chainceLogo from '../../staticAssets/images/chaince-logo.png';
// import worbliLogo from '../../staticAssets/images/worbli-logo.jpg';
// import eosphereLogo from '../../staticAssets/images/eosphere-logo.png';
// import triangles from '../../staticAssets/images/triangles.png';
// import blockchain from '../../staticAssets/images/blockchain.png';
// import arrowRight from '../../staticAssets/images/arrow-right.svg';
// import playImage from '../../staticAssets/images/play-circle.svg';
// import teamImage from '../../staticAssets/images/team.png';

class MostPopular extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acfData: null
    };
  }

  componentDidMount() {
    setPageForGoogleAnalytics('most-popular-articles');
    api.getAcfInfo().then(acfData => this.setState({acfData}));
  }

  render() {
    const { acfData } = this.state;
    console.log(acfData);

    if(!acfData) return null;

    const panes = acfData.links.map((pane) => {
      return { menuItem: pane.title,
      };
    });

    console.log(panes);

    return (
      <main className="homepage">
        <Container>
          <Grid columns={2} stackable className="section-about-hero">
            <Grid.Column>
              <h1 className="section-about-hero__title" dangerouslySetInnerHTML={{ __html: acfData.hero_title }} />
            </Grid.Column>
          </Grid>
        </Container>

        <Grid.Row className="section-about">
          <Container>
            <List>
              {acfData.links.map((links) => {
                console.log('Entered');
                // Return the element. Also pass key
                return (
                  <List.Item>
                    <List.Content>
                      <List.Header as="a" href={links.link}>{links.link}</List.Header>
                    </List.Content>
                  </List.Item>
                );
              })}
            </List>
          </Container>

          {/* <div className="section-posts__row-colored">

          </div> */}
        </Grid.Row>

      </main>
    );
  }
}
export default withRouter(
  connect(
    // state => ({
    //   isAuthorized: state.user.userIsLogged
    // }),
    null
  )(MostPopular)
);
