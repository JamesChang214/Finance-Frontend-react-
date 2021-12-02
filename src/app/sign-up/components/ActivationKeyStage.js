import React, { PureComponent } from 'react';
import { Grid, Form, Button, Divider } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../signUpActions';

class ActivationKeyStage extends PureComponent {
  state = { activationKey: '' };

  componentDidMount() {
    console.log('mounted', this);
    const { location, signUpStatus } = this.props;
    const { activateUser } = this.props;
    const params = new URLSearchParams(location.search);
    const activationKey = params.get('key');
    if (activationKey && signUpStatus === 'initial') {
      activateUser({ activate_key: activationKey });
    }
  }

  onSubmit = () => {
    const { activationKey } = this.state;
    const { activateUser } = this.props;
    activationKey && activateUser({ activate_key: activationKey });
  };

  render() {
    window.dataLayer.push({
      event: 'event',
      eventProps: {
          category: 'Signup',
          action: 'click',
          label: 'Activate',
          value: 1
      }
    });
    return (
      <Grid className="loopsignup" style={{marginTop: '150px'}}>
        <Grid.Row>
          {
            <Form onSubmit={this.onSubmit}>
              <label htmlFor="activation_key_input"> Paste activation key that you have recieved in email:</label>
              <Divider />
              <Form.Input
                id="activation_key_input"
                onChange={(e, { value }) => this.setState({ activationKey: value })
                }
                type="text"
                spellcheck="false"
              />
              <Divider />
              <Button type="submit" disabled={!this.state.activationKey} className="btn px-3 mb-2 mb-lg-0 proceedBtn">Activate</Button>
            </Form>
          }
        </Grid.Row>
      </Grid>
    );
  }
}

export default withRouter(
  connect(
    (state) => {
      return {
        signUpStatus: state.signUp.signUpStatus
      };
    },
    dispatch => ({
      activateUser: (params) => {
        dispatch(actions.activateUser(params));
      }
    })
  )(ActivationKeyStage)
);
