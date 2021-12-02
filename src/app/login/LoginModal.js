/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Loader, Grid } from 'semantic-ui-react';
import LoginForm from './LoginForm';
import ForgottenPassword from './ForgottenPassword';

class LoginModal extends Component {
  render() {
    const {
      open,
      close,
      closePassword,
      loginning,
      forgotPasswordMode,
      resetPasswordLoading
    } = this.props;
    return (
      <Grid>
        {(loginning || resetPasswordLoading)
          ? (
            <Loader active intermediate />
          )
          :(
            <Modal size="mini" open={open} onClose={close}>
              { forgotPasswordMode ? (
                <ForgottenPassword open={open} close={close} closePassword={closePassword} />
              ) : (
                <LoginForm open={open} close={close} />
              )}
            </Modal>
          )
        }
      </Grid>
    );
  }
}
//888,1
export default withRouter(
  connect(
    (state) => {
      return {
        loginning: state.user.loginning,
        forgotPasswordMode: state.user.forgotPasswordMode,
        resetPasswordLoading: state.user.resetPasswordLoading
      };
    }
  )(LoginModal)
);
