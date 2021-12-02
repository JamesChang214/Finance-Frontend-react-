import React, { Component } from 'react';
import { Container, Grid, Card } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setPageForGoogleAnalytics } from '../../util/helperFunctions';
import * as api from './Api';

class Rules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acfData: null
    };
  }

  componentDidMount() {
    setPageForGoogleAnalytics('rules');
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
            <Grid columns={1} stackable>
              {acfData.rules.map((rules) => {
                console.log('Entered');
                // Return the element. Also pass key
                return (
                  <Grid.Column>
                    <Card>
                      <Card.Content>
                        <Card.Header>{rules.title}</Card.Header>
                        <Card.Description>
                          {rules.content}
                        </Card.Description>
                      </Card.Content>
                      <Card.Content extra>

                        <a className="section-about__link" href={rules.link}>
                          {rules.link_text}
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
  )(Rules)
);
