import React, { Component } from 'react';
import { Container, Grid, Card } from 'semantic-ui-react';
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

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acfData: null
    };
  }

  componentDidMount() {
    setPageForGoogleAnalytics('about');
    api.getAcfInfo().then(acfData => this.setState({ acfData }));
  }

  render() {
    const { acfData } = this.state;
    console.log(acfData);

    if (!acfData) return null;

    const panes = acfData.Tabs.map((pane) => {
      return {
        menuItem: pane.title,
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
            <Grid columns={4} stackable>
              {acfData.about.map((about) => {
                // Return the element. Also pass key
                return (
                  <Grid.Column>
                    <Card>
                      <div
                        className="section-about__image"
                        style={{ backgroundImage: 'url(' + about.image + ')' }} />
                      <Card.Content>
                        <Card.Header>{about.name}</Card.Header>
                        <Card.Description>
                          {about.about}
                        </Card.Description>
                      </Card.Content>
                      <Card.Content extra>

                        <a className="section-about__link" href={about.link}>
                          {about.link_text}
                        </a>
                      </Card.Content>
                    </Card>
                  </Grid.Column>
                );
              })}
            </Grid>
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
  )(About)
);
