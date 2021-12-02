/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Modal, Form, Message } from 'semantic-ui-react';
import ReCAPTCHA from 'react-google-recaptcha';
import * as actions from '../user/userActions';

class LoginModal extends Component {
  state = {
    messages: [],
    data: {
      newPassword: '',
      confirmPassword: '',
      recaptcha: false,
      email: ''
    }
  };

  componentDidUpdate = (prevProps) => {
    const { resetPasswordResponse } = this.props;
    if( !prevProps.resetPasswordResponse && resetPasswordResponse && resetPasswordResponse.status === 'ok') {
      let { messages } = this.state;
      messages = [...messages, 'The password has been changed successfully'];
      this.setState({ messages });
    }
  }

  handleChangePassword = (event, inputName) => {
    const { data } = this.state;

    this.setState({
      data: {
        ...data,
        [inputName]: event.target.value
      }
    });
  };

  handleSubmit = () => {
    const {
      forgotPasswordResponse,
      forgotPasswordRequest,
      sendNewPassword
    } = this.props;
    const { data } = this.state;
    if( !forgotPasswordResponse || forgotPasswordResponse.status !== 'ok' ) {
      forgotPasswordRequest({ email: data.email });
    }
    if( forgotPasswordResponse && forgotPasswordResponse.key ) {
      const { email } = this.props;
      if( data.newPassword !== data.confirmPassword ) {
        let { messages } = this.state;
        messages = [...messages, 'Passwords don\'t match'];
        this.setState({
          messages
        });
        return;
      }
      this.setState({
        messages: []
      });
      sendNewPassword({
        newPassword: data.newPassword,
        email,
        key: forgotPasswordResponse.key
      });
    }
  }

  render() {
    const {
      close,
      error,
      forgotPasswordResponse,
      resetPasswordResponse,
      closePassword
    } = this.props;
    const { data, recaptcha, messages } = this.state;
    return (
      <React.Fragment>
        <Modal.Header>Forgot Password</Modal.Header>
        <Modal.Content>
          {error && (
            <div dangerouslySetInnerHTML={{ __html: error.message }} />
          )}
          {
            messages.length !== 0 && (
              messages.map( msg => (
                <Message
                  key={msg}
                  content={msg}
                />
              ))
            )
          }
          {
            ( !resetPasswordResponse && (!forgotPasswordResponse || forgotPasswordResponse.status !== 'ok') ) && (
              <Form><Button className="cancel-button cz-cancel" onClick={close}>
                <i aria-hidden="true" className="close icon" />
                    </Button>
                <Form.Field>

                <label htmlFor="login" className="input-label">
                    Your email
                  </label>
                <input
                    id="email"
                    className="email"
                    type="email"
                    onChange={e => this.handleChangePassword(e, 'email')}
                    value={data.email}
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
            )
          }
          {
            (forgotPasswordResponse) && (
              <Form>
                <Form.Field>
                  <label htmlFor="login" className="input-label">
                    Please check your email to continue password reset.
                  </label>
                </Form.Field>
              </Form>
            )
          }
          {
            (forgotPasswordResponse && forgotPasswordResponse.key) && (
              <Form>
                <Form.Field>
                  <label htmlFor="login" className="input-label">
                    New password
                  </label>
                  <input
                    id="new-password"
                    className="new-password"
                    type="password"
                    onChange={e => this.handleChangePassword(e, 'newPassword')}
                    value={data.newPassword}
                  />
                </Form.Field>
                <Form.Field>
                  <label htmlFor="password" className="input-label">
                    Confirm password
                  </label>
                  <input
                    className="confirm-password"
                    id="confirm-password"
                    type="password"
                    onChange={e => this.handleChangePassword(e, 'confirmPassword')}
                    value={data.confirmPassword}
                  />
                </Form.Field>
                <Form.Field>
                  <ReCAPTCHA
                    theme="dark"
                    sitekey="6LfnDp8UAAAAAPhLkzkzZF4Qef4vdofwnp896YCG"
                    onChange={() => this.setState({ recaptcha: true })}
                  />
                </Form.Field>
              </Form>
            )
          }
          {
            ( forgotPasswordResponse && resetPasswordResponse && resetPasswordResponse.status === 'ok') && (
              <Button onClick={close}>
                OK
              </Button>
            )
          }
        </Modal.Content>
        { !forgotPasswordResponse && !(resetPasswordResponse && resetPasswordResponse.status === 'ok') && (
          <Modal.Actions>
            <Button className="cancel-button" onClick={closePassword}>
              Cancel
            </Button>
            <Button
              className="submit-button"
              onClick={() => recaptcha && this.handleSubmit()}
            >
              Submit
            </Button>
          </Modal.Actions>
        )}
        { forgotPasswordResponse && (
          <Modal.Actions>
            <Button className="cancel-button" onClick={close}>
              Close
            </Button>
          </Modal.Actions>
        )}
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
        error: state.user.authError,
        forgotPasswordResponse: state.user.forgotPasswordResponse,
        resetPasswordResponse: state.user.resetPasswordResponse,
        email: state.user.email
      };
    },
    dispatch => ({
      sendNewPassword: (params) => {
        dispatch(actions.sendNewPassword(params));
      },
      forgotPasswordRequest: (params) => {
        dispatch(actions.forgotPasswordRequest(params));
      }
    })
  )(LoginModal)
);
