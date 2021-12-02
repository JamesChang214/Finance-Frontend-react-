import React, { PureComponent } from 'react';
import { Message, Form, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import * as actions from '../postActions';
import ReCAPTCHA from 'react-google-recaptcha';

class AddComment extends PureComponent {
  state = {
    articlerecaptcha: false
  };
  handleChange = (e, { value }) => this.setState({ CommentText: value });
  handleClearChange = () => {
    this.setState({ CommentText: '' });
  }
  handleRecaptcha = () => {
    const { articlerecaptcha } = this.state;
    this.setState({ articlerecaptcha: !articlerecaptcha })
  }
  render() {
    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'Reply',
        action: 'click',
        label: 'reply',
        value: 1
      }
    });
    const { CommentText, articlerecaptcha } = this.state;
    const { commentErrorCode, commentErrorMessage, commentSuccessMessage } = this.props;
    return (
      <div className="add-comment">
        {commentErrorMessage && (
          <Message negative>
            <Message.Header>Error: {commentErrorCode}</Message.Header>
            <p dangerouslySetInnerHTML={{ __html: commentErrorMessage }} />
          </Message>
        )}
        {commentSuccessMessage && (
          <Message positive>
            <Message.Header>Success: .....</Message.Header>
            <p dangerouslySetInnerHTML={{ __html: 'Comment Sent Successfully' }} />
          </Message>
        )}
        <Form inverted>
          <Form.TextArea
            className="post-textarea"
            rows='6'
            placeholder="Type your comment here..."
            onChange={this.handleChange}
            value={CommentText}
          />

          <Form.Field>
            <ReCAPTCHA
              theme="dark"
              sitekey="6LfMp8gbAAAAAONc0qQfY6MfmXLPbCLkjd5kfaNJ"
              onChange={() => this.handleRecaptcha()}
            />
          </Form.Field>

          <div className="buttons cz-leaving-repy">
            <Form>
              <button
                className="replyComment"
                disabled={((!articlerecaptcha) || (!CommentText))}
                onClick={() => this.onSubmit()}
                floated="right"
              >Leave Reply</button>
            </Form>
          </div>
        </Form>
      </div>
    );
  }

  onSubmit = async () => {
    const { sendComment, cookies, info, userInfo } = this.props;
    const { CommentText } = this.state;
    const token = cookies.get('trybe_jwt', { path: '/' });
    await sendComment({ id: info.id, text: CommentText, token, authorId: info.author, userId: userInfo.id, target: info.slug });
    await this.handleClearChange();
    await this.handleRecaptcha();
  };
}
export default withCookies(
  withRouter(
    connect(
      (state, ownProps) => ({
        cookies: ownProps.cookies,
        userInfo: state.user.userInfo,
        info: state.post.postInfo,
        commentErrorCode: state.post.commentErrorCode,
        commentErrorMessage: state.post.commentErrorMessage,
        commentSuccessMessage: state.post.commentSuccessMessage
      }),
      dispatch => ({
        sendComment: (params) => {
          dispatch(actions.sendPostComment(params));
        }
      })
    )(AddComment)
  )
);
