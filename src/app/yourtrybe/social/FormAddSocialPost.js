import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';
import htmlToDraft from 'html-to-draftjs';
import { createSocialPost } from './SocialFeedActions';
import ArticleEditor from '../../util/articleEditor/ArticleEditor';

class FormAddSocialPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      tags: [],
      mentions: [],
      text: '',
      featuredImage: null
    };
  }

  componentDidUpdate = (prevProps) => {
    const { isPostSended } = this.props;
    if (prevProps.isPostSended === false && isPostSended === true) {
      // return state to default condition
      this.setState({
        content: '',
        text: '',
        tags: [],
        featuredImage: null,
        mentions: []
      });
      this.forceUpdate();
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const valid = await this.validate();
    if (valid) {
      const { userInfo, addPost } = this.props;
      const { text, featuredImage, tags, mentions } = this.state;

      console.log('mentions', mentions);
      console.log({
        content: text,
        tags,
        featuredImage,
        userId: userInfo.id,
        mentions
      });
      addPost({
        content: text,
        tags,
        featuredImage,
        userId: userInfo.id,
        mentions
      });
    }
  };

  validate = () => {
    const { content, mentions } = this.state;
    let text = '',
      featuredImage;

    return new Promise((resolve) => {
      htmlToDraft(content, (nodeName, node) => {
        if (nodeName === 'body') {
          //preparing text and image
          for (let i = 0; i < node.children.length; i++) {
            if (node.children[i].localName === 'img') {
              featuredImage = node.children[i].src;
            } else {
              text += node.children[i].outerHTML;
            }
          }

          //searching for tags
          const tags = text.match(/#([\w+]+)/g) || [];

          //mentions proccessing
          let mentioned = mentions;
          mentioned = mentioned.map((el) => {
            if (el) return el.userId;
            return null;
          });

          this.setState({
            featuredImage,
            text,
            tags,
            mentions: mentioned
          });
          resolve(true);
        }
      });
    });
  };

  onAddMention = (user) => {
    const { mentions } = this.props;
    this.setState({ mentions: [...mentions, user] });
  };

  handleChangeContent = (text) => {
    this.setState({
      content: text
    });
  };

  render() {
    const { isPostSending } = this.props;
    const style = { filter: isPostSending ? 'blur(1px)' : '' };

    return (
      <Form onSubmit={this.handleSubmit} loading={isPostSending}>
        <ArticleEditor
          handleChangeStory={this.handleChangeContent}
          data={this.state}
          blockStyleControls
          mediaControls
          onAddMention={this.onAddMention}
        />
        <Button
          floated="right"
          type="submit"
          className="green-bordered-button"
          style={style}
        >
          Publish
        </Button>
      </Form>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      userInfo: state.user.userInfo,
      isPostSending: state.socialFeed.postSending,
      isPostSended: state.socialFeed.postSuccessfullSended
    }),
    dispatch => ({
      addPost: (params) => {
        dispatch(createSocialPost(params));
      }
    })
  )(FormAddSocialPost)
);
