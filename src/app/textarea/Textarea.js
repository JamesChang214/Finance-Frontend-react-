import React, { Component } from 'react';
import { Form, Button, Ref } from 'semantic-ui-react';

// const options = [
//   { key: 'm', text: 'Male', value: 'male' },
//   { key: 'f', text: 'Female', value: 'female' }
// ];

class FormExampleSubcomponentControl extends Component {
  state = {};

  componentDidMount() {
    console.log(this.textAreaRef);
    const el = this.textAreaRef.querySelector('textarea');
    el.addEventListener('input', FormExampleSubcomponentControl.autosize);
    this.textarea = el;
  }

  componentWillUnmount() {
    this.textarea.removeEventListener('input', FormExampleSubcomponentControl.autosize);
  }

  textAreaRef = null;

  handleRef = (node) => {
    this.textAreaRef = node;
  };

  handleChange = (e, { value }) => this.setState({ value });

  static autosize({ target }) {
    const el = target;
    el.style.cssText = 'height:auto; padding:0';
    el.style.cssText = '-moz-box-sizing:content-box';
    el.style.cssText = 'height:' + el.scrollHeight + 'px';
  }

  render() {
    const { rows, placeholder, handler } = this.props;
    const { value } = this.state;
    return (
      <Form inverted>
        <Ref innerRef={this.handleRef}>
          <Form.TextArea
            className="post-textarea"
            rows={rows || '6'}
            placeholder={placeholder}
            onChange={this.handleChange}
          />
        </Ref>

        <div className="buttons">
          {/* <Button.Group fluid>
            <Form.Button>
              <Icon name="image outline" />
              Photo
            </Form.Button>
            <Form.Button>
              <Icon name="tv" />
              SlideShow
            </Form.Button>
            <Form.Button>
              <Icon name="linkify" />
              Link
            </Form.Button>
          </Button.Group> */}
          <Button.Group fluid>
            <Form.Button
              disabled={!value}
              onClick={() => value
                ? handler(value)
                : console.log('empty textarea', this.state)
              }
              floated="right"
            >
              Leave Reply
            </Form.Button>
          </Button.Group>
        </div>
      </Form>
    );
  }
}

export default FormExampleSubcomponentControl;
