import React, { Component } from 'react';
import { Container, Grid, Image } from 'semantic-ui-react';
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

class HowTrybeWorks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acfData: null
    };
  }

  componentDidMount() {
    setPageForGoogleAnalytics('how-trybe-work');
    api.getAcfInfo().then(acfData => this.setState({acfData}));
  }

  render() {
    const { acfData } = this.state;
    console.log(acfData);

    if(!acfData) return null;

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
            <Grid divided>
              {acfData.info.map((info) => {
                console.log('Entered');
                // Return the element. Also pass key
                return (
                  <Grid.Row>
                    <Grid.Column width={4} only="computer">
                      <Image src={info.image} />
                    </Grid.Column>
                    <Grid.Column width={12} only="computer">
                      <h2 className="p40">{info.title}</h2>
                      <p className="p40" style={{fontWeight: 'bolder'}}>{info.description}</p>
                    </Grid.Column>
                    <Grid.Column width={6} only="tablet">
                      <Image src={info.image} />
                    </Grid.Column>
                    <Grid.Column width={10} only="tablet">
                      <h2 className="p40">{info.title}</h2>
                      <p className="p40" style={{fontWeight: 'bolder'}}>{info.description}</p>
                    </Grid.Column>
                    <Grid.Column width={15} only="mobile">
                      <Image src={info.image} />
                    </Grid.Column>
                    <Grid.Column width={15} only="mobile">
                      <h2 className="p40">{info.title}</h2>
                      <p className="p40" style={{fontWeight: 'bolder'}}>{info.description}</p>
                    </Grid.Column>
                  </Grid.Row>
                );
              })}
            </Grid>
          </Container>


          <Container>
            <Grid columns={2} stackable className="section-about-hero">
              <Grid.Column>
                <h1 className="section-about-hero__title" dangerouslySetInnerHTML={{ __html: acfData.hero_title_earnings }} />
              </Grid.Column>
            </Grid>
          </Container>

          <Container>
            <Grid divided>
              {acfData.earnings_info.map((earnings_info) => {
                console.log('Entered');
                // Return the element. Also pass key
                return (
                  <Grid.Row>
                    <Grid.Column width={4} only="computer">
                      <Image src={earnings_info.image} />
                    </Grid.Column>
                    <Grid.Column width={12} only="computer">
                      <h2 className="p40">{earnings_info.title}</h2>
                      <p className="p40" style={{fontWeight: 'bolder'}}>{earnings_info.description}</p>
                    </Grid.Column>
                    <Grid.Column width={6} only="tablet">
                      <Image src={earnings_info.image} />
                    </Grid.Column>
                    <Grid.Column width={10} only="tablet">
                      <h2 className="p40">{earnings_info.title}</h2>
                      <p className="p40" style={{fontWeight: 'bolder'}}>{earnings_info.description}</p>
                    </Grid.Column>
                    <Grid.Column width={15} only="mobile">
                      <Image src={earnings_info.image} />
                    </Grid.Column>
                    <Grid.Column width={15} only="mobile">
                      <h2 className="p40">{earnings_info.title}</h2>
                      <p className="p40" style={{fontWeight: 'bolder'}}>{earnings_info.description}</p>
                    </Grid.Column>
                  </Grid.Row>
                );
              })}
            </Grid>
          </Container>
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
  )(HowTrybeWorks)
);
