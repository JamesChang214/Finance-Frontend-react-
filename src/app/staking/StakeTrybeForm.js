import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { withRouter } from 'react-router-dom';
import {Button, Form, Divider} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {stakeTrybeFormHandler} from '../scatter/scatterActions';

class StakeTrybeForm extends Component {
  render() {
    const { handleSubmit, duration, submitSucceeded, handleClose, submitting } = this.props; // handleSubmit is provided by reduxForm

    if(submitSucceeded) {
      handleClose();
    }

    return (
      <Form onSubmit={handleSubmit(stakeTrybeFormHandler)}>
        <div className="modalFormFieldDiv">
          Stake for {duration===1?'90 Days':'180 Days'}.
        </div>
        <Divider hidden />
        <div className="modalFormFieldDiv">
          <label htmlFor="total_trybe">Amount to Stake</label>
          <Field component="input" type="text" name="total_trybe" placeholder="Amount to Stake" autoComplete="off" />
        </div>
        <Divider hidden />
        {submitting && (<div> Waiting for Wallet. Please be patient.</div>)}
        <Divider hidden />
        <Button type="submit">Stake</Button>
      </Form>
    );
  }
}

export default withRouter(connect(
  (state, ownProps) => {
    const walletId = state.scatter.get('account');
    return {
      initialValues: {
        owner: walletId,
        to: walletId,
        staking_period: ownProps.duration,
        transfer: false,
      }
    };
  },
)(reduxForm({
  form: 'StakeTrybeForm',
}
)(StakeTrybeForm)));