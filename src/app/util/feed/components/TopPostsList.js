import React, { Component } from 'react';
import './TopPostsList.scss';
import { Grid } from 'semantic-ui-react';

export default class TopPostsList extends Component {
  render() {
    return (
      <Grid.Row>
        <Grid.Column>top posts here</Grid.Column>
      </Grid.Row>
    );
  }
}
