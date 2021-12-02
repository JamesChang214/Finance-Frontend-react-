/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Modal, Form, Icon, Divider } from 'semantic-ui-react';
import ReCAPTCHA from 'react-google-recaptcha';
import * as actions from '../user/userActions';

class LoginModal extends Component {
  state = {
    data: {
      username: '',
      password: '',
      recaptcha: false
    }
  };

  handleChangeUsername = (event) => {
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        username: event.target.value
      }
    });
  };

  handleChangePassword = (event) => {
    const { data } = this.state;

    this.setState({
      data: {
        ...data,
        password: event.target.value
      }
    });
  };

  render() {
    const { close, login, error, forgotPasswordClick } = this.props;
    const { data, recaptcha } = this.state;
    return (
      <React.Fragment>
        <Modal.Header className="loginModalHeader">
          <p>Login</p>
          <Button
            floated="right"
            className="cancel-button loginCloseBtn"
            icon
            basic
            onClick={close}>
            <Icon name="close" />
          </Button>
        </Modal.Header>
        <Modal.Content>
          {error && (
            <div dangerouslySetInnerHTML={{ __html: error.message }} />
          )}
          <Form className="loginFormBox">
            <Form.Field>
              <label htmlFor="login" className="input-label">
                Email or Username
              </label>
              <input
                id="login"
                className="login-input"
                type="email"
                onChange={this.handleChangeUsername}
              />
            </Form.Field>
            <Form.Field>
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <input
                className="login-input"
                id="password"
                type="password"
                onChange={this.handleChangePassword}
              />
            </Form.Field>
            <Form.Field>
              <ReCAPTCHA
                theme="dark"
                sitekey="6LfMp8gbAAAAAONc0qQfY6MfmXLPbCLkjd5kfaNJ"
                onChange={() => this.setState({ recaptcha: true })}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Divider />
        <Modal.Actions>
          <Button
            className="forgot-password"
            onClick={() => forgotPasswordClick()}
          >Forgot Password?
          </Button>
          <Button
            type="submit"
            className="submit-button"
            disabled={((!recaptcha) || data.username.length == 0 || data.password.length == 0)}
            onClick={() => login(data)}
          >
            Log In
          </Button>
        </Modal.Actions>
      </React.Fragment>
    );
  }
}
//888,1
export default withRouter(
  connect(
    (state) => {
      return {
        loginning: state.user.loginning,
        error: state.user.authError
      };
    },
    dispatch => ({
      login: (params) => {
        dispatch(actions.postLogin(params));
      },
      forgotPasswordClick: () => {
        dispatch(actions.forgotPasswordClick());
      }
    })
  )(LoginModal)
);
