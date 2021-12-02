import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Form } from 'semantic-ui-react';
import { purchaseTrybeHandler } from '../presaleActions';

class PurchaseTrybeForm extends Component {
  render() {
    const {handleSubmit} = this.props;
    return (
      <Form onSubmit={handleSubmit(purchaseTrybeHandler)}>
        <div>
          <Field component="input" type="text" name="eos" placeholder="Enter EOS Amount" autoComplete="off" />
        </div>
        <br />
        <Button type="submit">Buy Trybe</Button>
      </Form>
    );
  }
}

export default withRouter(connect(
  (state) => {
    const account = state.scatter.get('account');
    console.log('account: ', account);
    return {
      account,
    };
  },
)(reduxForm({
  form: 'PurchaseTrybeForm',
}
)(PurchaseTrybeForm)));