import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import htmlToDraft from 'html-to-draftjs';
import * as actions from './SocialFeedActions';
import ArticleEditor from '../../util/articleEditor/ArticleEditor';


class FormAddSocialComment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      text: ''
    };
  }

  componentDidUpdate = (prevProps) => {
    const { isSending, userInfo, getSocialFeed, expandPost, postId } = this.props;
    if( prevProps.isSending === true && isSending === false ) {
      this.setState({ content: '', text: '' });
      getSocialFeed({ userId: userInfo.id });
      expandPost({
        userId: userInfo.id,
        activityId: postId
      });
    }
  }

  handleSubmit = async () => {
    const { comment, userInfo, postId, postAuthorId } = this.props;
    const valid = await this.validate();
    if(valid) {
      const { text } = this.state;
      comment({
        userId: userInfo.id,
        targetId: postId,
        authorId: postAuthorId,
        text
      });
    }
  }

  validate = () => {
    const { content } = this.state;
    let text = '';

    return new Promise( (resolve) => {
      htmlToDraft(content, (nodeName, node) => {
        if(nodeName === 'body') {
          for(let i = 0; i < node.children.length; i++) {
            text += node.children[i].outerHTML;
          }

          this.setState( () => {
            return { text };
          }, () => resolve(true));
        }
      });
    });
  }

  handleChangeContent = (text) => {
    this.setState({
      content: text
    });
  };


  render() {
    const { isSending } = this.props;
    const style = { filter: isSending ? 'blur(1px)' : '' };
    return (
      <Form onSubmit={this.handleSubmit} loading={isSending}>
        <ArticleEditor
          handleChangeStory={this.handleChangeContent}
          data={this.state}
          blockStyleControls={false}
        />
        <Button
          type="button"
          floated="right"
          onClick={this.handleSubmit}
          style={style}
          className="green-bordered-button"
        >Comment
        </Button>
      </Form>
    );
  }
}


export default withRouter(
  connect(
    (state) => {
      return {
        userInfo: state.user.userInfo,
        isSending: state.socialFeed.commentSending,
      };
    },
    dispatch => ({
      comment: (params) => {
        dispatch( actions.createSocialComment(params) );
      },
      getSocialFeed: (params) => {
        dispatch( actions.getSocialFeed(params) );
      },
      expandPost: (params) => {
        dispatch( actions.expandPost(params) );
      }
    })
  )(FormAddSocialComment)
);