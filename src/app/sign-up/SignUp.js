/* eslint-disable */
import React, { PureComponent } from 'react';
import { Container, Loader } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';
import * as actions from './signUpActions';
import ActivationKeyStage from './components/ActivationKeyStage';
import EmailAndPasswordStage from './components/EmailAndPasswordStage';
import SuccessfulActivationStage from './components/SuccessfulActivationStage';

class SignUp extends PureComponent {
  state = {
    username: '',
    email: '',
    display_name: '',
    eosAccountName: '',
    password: '',
    refId: '',
    checked: false
  };

  componentDidUpdate(prevProps) {
    const { signUpStatus, history } = this.props;
    if (signUpStatus !== prevProps.signUpStatus) {
      switch (signUpStatus) {
        case 'initial':
          break;
        case 'success':
          history.push('/sign-up/success');
          break;
        case 'activation_key':
          history.push('/sign-up/activation');
          break;

        default:
          break;
      }
    }
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleCheckbox = (e, { checked }) => this.setState({ checked });

  handleSubmit = () => {
    const { username, email, password, checked } = this.state;
    const { signUp } = this.props;

    if (checked) {
      signUp({ username, email, password });
    }
  };

  render() {
    const { signUpStatus } = this.props;
    return (
      <div className="sign-up">
        <Container>
          {signUpStatus !== 'loading' ? (
            <Switch>
              <Route exact path="/sign-up" component={EmailAndPasswordStage} />
              <Route
                path="/sign-up/success"
                component={SuccessfulActivationStage}
              />
              <Route
                path="/sign-up/activation"
                component={ActivationKeyStage}
              />
            </Switch>
          ) : (
            <Loader active />
          )}
        </Container>
      </div>
    );
  }
}
export default withRouter(
  connect(
    (state) => {
      return {
        signUpFetching: state.signUp.signUpFetching,
        signUpStatus: state.signUp.signUpStatus
      };
    },
    dispatch => ({
      signUp: (params) => {
        dispatch(actions.signUp(params));
      }
    })
  )(SignUp)
);
