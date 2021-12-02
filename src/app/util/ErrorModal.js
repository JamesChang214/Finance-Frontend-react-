import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { Modal, Form, TextArea } from "semantic-ui-react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export class ErrorModal extends Component {
  static propTypes = {
    prop: PropTypes
  };

  render() {
    return (
      <Modal
        size="mini"
        dimmer={"blurring"}
        open={this.props.open}
        onClose={this.props.close}
        closeIcon
      >
        <Modal.Header>Error occured. {this.props.message}</Modal.Header>
        <Modal.Content>
          <Form>
            <TextArea value={this.props.logs} style={{ maxHeight: 100 }} />
          </Form>
          Feel free to inform our dev team
        </Modal.Content>
        <Modal.Actions>
          <CopyToClipboard
            text={this.props.logs}
            onCopy={() => this.setState({ copied: true })}
          >
            <Button className="copy-logs-button">Copy to clipboard</Button>
          </CopyToClipboard>
          <Button className="cancel-button" onClick={close}>
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ErrorModal)
);
