import React, { PureComponent } from 'react';
import { Grid, Button, Form, Divider } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import * as actions from '../signUpActions';

class EmailAndPasswordStage extends PureComponent {
  state = {
    username: '',
    email: '',
    display_name: '',
    password: '',
    referal_id: '',
    fake_username: '',
    fake_display_name: '',
    checked: true,
    recaptcha: false,
    showPassword: 'password'
  };

  handleChange = (e, { id, value }) => this.setState({ [id]: value });

  handleCheckbox = (e, { checked }) => this.setState({ checked });

  handleSubmit = () => {
    const {
      username,
      email,
      password,
      display_name,
      checked,
      referal_id,
      recaptcha
    } = this.state;
    const { signUp } = this.props;

    if (checked && recaptcha) {
      signUp({ username, email, password, display_name, referal_id });
    }
  };

  componentDidMount() {
    const ref = localStorage.getItem('trybe_ref');
    const { userInfo } = this.props
    console.log(userInfo);
    if (ref) {
      this.setState({ referal_id: ref });
    }
  }

  showPassword(value) {
    this.setState({ showPassword: value });
  }

  render() {
    const { referal_id, recaptcha, checked, showPassword, fake_display_name, fake_username } = this.state;
    const { signUpMessage, userInfo } = this.props;
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column className="signupBox" padded computer={6} mobile={16} tablet={9}>
            <Grid className="loopsignup mobileSignUpBox">
              <Grid.Row className="loopCard tokenCard signupText">
                <p className="title">Why Join Loop? </p>
                <br />
                <span className="text-light" style={{ textAlign: 'center' }}>Join Loop and immediately start earning LOOPR tokens for your participation in our community! Write articles, rate articles, comment, invite friends, or make new ones! Everything you do will help you to earn more of our tokens!
                  <br />
                  <br />
                  By owning LOOPR tokens you can earn LOOP tokens - the core token powering our DEX (Decentralized Exchange). With LOOP tokens, you can earn a share of the revenue from every transaction that is made on our platform!
                  <br />
                  <br />
                  Become a member TODAY and start EARNING!
                </span>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column className="signupBox" computer={10} mobile={16} tablet={9}>
            <Grid className="loopsignup mobileSignUpBox">
              <p className="title">Please Fill Out the Form Below:</p>
              <Divider />
              {signUpMessage && (
                <span>
                  <p className="error">{signUpMessage}</p>
                  <Divider />
                </span>
              )}
              <Form onSubmit={this.handleSubmit}>
                <Form.Field required>
                  <label htmlFor="display_name">Display name</label>
                  <Form.Input
                    onChange={this.handleChange}
                    id="display_name"
                    type="text"
                  />
                </Form.Field>
                <Form.Field required>
                  <label htmlFor="username">Username</label>
                  <Form.Input
                    id="username"
                    onChange={this.handleChange}
                    type="text"
                  />
                </Form.Field>
                <Form.Field required>
                  <label htmlFor="email">Email</label>
                  <Form.Input
                    id="email"
                    onChange={this.handleChange}
                    type="email"
                  />
                </Form.Field>
                <Form.Field required>
                  <label htmlFor="password">Password</label>
                  <div className="passwordField">
                    <Form.Input
                      id="password"
                      onChange={this.handleChange}
                      type={showPassword}
                      className="passwordInput"
                    />
                    {showPassword == 'password' ? (
                      <span className="eyePosition" onClick={() => this.showPassword('text')}><img className="viewEye" src="/eye.png" /></span>
                    ) : (
                      <span className="eyePosition" onClick={() => this.showPassword('password')}><img className="viewEye" src="/eye-active.png" /></span>
                    )
                    }
                  </div>
                </Form.Field>
                <Form.Field>
                  <label htmlFor="referal_id">Referral ID(not required)</label>
                  <Form.Input
                    onChange={this.handleChange}
                    id="referal_id"
                    value={referal_id}
                    type="number"
                  />
                </Form.Field>
                <Form.Field>
                  <label className="ohnohoney" htmlFor="display_name">Display name</label>
                  <Form.Input
                    className="ohnohoney"
                    onChange={this.handleChange}
                    id="fake_display_name"
                    value={fake_display_name}
                    type="text"
                  />
                </Form.Field>
                <Form.Field>
                  <label className="ohnohoney" htmlFor="username">Your Username</label>
                  <Form.Input
                    className="ohnohoney"
                    onChange={this.handleChange}
                    id="fake_username"
                    value={fake_username}
                    type="text"
                  />
                </Form.Field>
                <Divider />
                <Form.Field>
                  <Form.Checkbox
                    onChange={this.handleCheckbox}
                    id="check"
                    label="I agree to the Terms and Conditions"
                    defaultChecked={checked}
                  />
                </Form.Field>
                <span style={{ color: '#fff' }}><b style={{ color: 'var(--pink)' }}>Terms and Conditions:</b> I promise to be a good, kind, thoughtful human being at all times. Any content I place on this platform will be my own and not copied from some poor, unsuspecting, hardworking soul.</span>
                <Divider />
                <ReCAPTCHA
                  className="cz-recaptcha"
                  theme="dark"
                  sitekey="6LfMp8gbAAAAAONc0qQfY6MfmXLPbCLkjd5kfaNJ"
                  onChange={() => this.setState({ recaptcha: !recaptcha ? true : false })}
                />
                <Divider />
                <Button onClick={() => window.dataLayer.push({ 'event': 'Signup' })} type="submit" disabled={!recaptcha || !checked || fake_username || fake_display_name} className="btn px-3 mb-2 mb-lg-0 signUPTag">Proceed</Button>
              </Form>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
export default withRouter(
  connect(
    (state) => {
      return {
        signUpMessage: state.signUp.signUpMessage,
        userInfo: state.user.userInfo,
      };
    },
    dispatch => ({
      signUp: (params) => {
        dispatch(actions.signUp(params));
      }
    })
  )(EmailAndPasswordStage)
);
