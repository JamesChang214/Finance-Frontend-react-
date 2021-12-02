/* eslint-disable no-shadow */
import React, { Component } from 'react';
import { Message, Button, Form, Divider } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import * as actions from '../settingsActions';
import * as scatterActions from '../../../scatter/scatterActions';


class EosAccount extends Component {
  state = {
    visible: false,
    value: '',
    isLynx: false
  }

  toggleVisibility = () => this.setState(prevState => ({ visible: !prevState.visible }));

  handleChange = (e, { value }) => this.setState({ value });

  handleSubmit = () => {
    const { setEosAccount, userInfo, cookies } = this.props;
    const { value } = this.state;
    if(value) {
      const token = cookies.get('trybe_jwt');
      value && setEosAccount({
        userId: userInfo.id,
        terraAccount: value,
        token
      });
    }
  }

  render() {
    const { value } = this.state;
    const { userInfo, setEosAccountResponse } = this.props;
    const terraAccountName = userInfo.details.terra_address;
    return (
      <div className="terra-account cz-terra-account" style={{marginTop: '25px', marginBottom: '125px', width: '75%'}}>
        { setEosAccountResponse.message && (
          <Message
            error={setEosAccountResponse.status === 'error'}
            positive={setEosAccountResponse.status === 'updated' || !setEosAccountResponse.status === ''}
            header={setEosAccountResponse.message}
            style={{ display: 'block', background: 'var(--pink)' }}
          />
        )}
        <div>
          {
            terraAccountName === '' ? (
              <div>
                <h3>You have no attached TERRA Address</h3>
              </div>
            ) : (
              <div>
                <h3>Current linked TERRA Address: <br /><b><span className="account-name">{terraAccountName}</span></b></h3>
              </div>
            )
          }
          <Form class="cz-settin-tab-form" onSubmit={this.onSubmit}>
          <Divider />
            <Form.Field>
              <label htmlFor="display_name">Terra Address:</label>
              <Form.Input minLength="44" maxLength="44" onChange={this.handleChange} id="address" />
            </Form.Field>
            <Divider />
            <Form.Field className="cz-form-setting" />
            <Button
              type="submit"
              fluid
              disabled={ !value.includes("terra1") || value.length != 44 }
              onClick={() => {
                this.handleSubmit()
              }}
            >
              Link Address
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default withCookies(
  withRouter(
    connect(
      (state, ownProps) => ({
        userInfo: state.user.userInfo,
        cookies: ownProps.cookies,
        setEosAccountResponse: state.settings.setEosAccountResponse,
        walletId: state.scatter.getIn(['identity', 'account_name']),
      }),
      dispatch => ({
        setEosAccount: params => dispatch(actions.setEosAccount(params)),
        signInToScatter: (args) => {
          dispatch(scatterActions.signInToScatterRoutine(args));
        },
        signOutOfScatter: (args) => {
          dispatch(scatterActions.signOutOfScatterRoutine(args));
        },
      })
    )(EosAccount)
  )
);