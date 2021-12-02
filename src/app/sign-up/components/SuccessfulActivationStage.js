import React from 'react';
import { Grid, Image, Divider, Button } from 'semantic-ui-react';
import LoginModal from '../../login/LoginModal';

const SuccessfulActivationStage = () => (
  window.dataLayer.push({
    event: 'event',
    eventProps: {
      category: 'Signup',
      action: 'click',
      label: 'sucess',
      value: 1
    }
  }),
  <Grid className="loopsignup" style={{ marginTop: '150px', color: '#fff', textAlign: 'center' }}>
    <Grid.Row>
      <Image centered size="small" src="/img/logo-header.png" alt="logo" />
      <Divider />
      <h3>Email Confirmation Successful</h3>
      <p>
        Feel free to use your email and
        password to login and start browsing the Loop community.
      </p>
      <Divider />
      <a href="../../community/" className="btn communityBtn" style={{ margin: 'auto' }}>Community News</a>
    </Grid.Row>
  </Grid>
);
export default SuccessfulActivationStage;
