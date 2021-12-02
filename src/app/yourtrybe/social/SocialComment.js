import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { Card, Button, Form, Label, Icon } from 'semantic-ui-react';
import htmlToDraft from 'html-to-draftjs';
import * as actions from './SocialFeedActions';
import ArticleEditor from '../../util/articleEditor/ArticleEditor';

import ChildComment from './ChildComment';

class SocialPost extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      expandedForm: false,
      content: '',
      text: ''
    };
  }

  componentDidUpdate = (prevProps) => {
    const { likeSending, expandPost, userInfo, activity_id } = this.props;
    if(prevProps.likeSending === true && likeSending === false) {
      expandPost({
        userId: userInfo.id,
        activityId: activity_id
      });
    }
  }

  handleChangeContent = (text) => {
    this.setState({
      content: text
    });
  };

  handleSubmit = async () => {
    const valid = await this.validate();
    if( valid ) {
      const { userInfo, activity_id, user_id, id, comment } = this.props;
      const { text } = this.state;
      comment({
        userId: userInfo.id.toString(),
        targetId: activity_id,
        authorId: null,
        text,
        parentId: id,
        parentAuthorId: user_id
      });
    }
  }

  validate = () => {
    const { content } = this.state;
    let text = '';

    return new Promise( (resolve) => {
      htmlToDraft(content, (nodeName, node) => {
        if(nodeName === 'body') {
          //preparing text and image
          for(let i = 0; i < node.children.length; i++) {
            text += node.children[i].outerHTML;
          }

          this.setState({
            text,
          });
          resolve(true);
        }
      });
    });
  }

  clickOnLike = (commentId, authorId, parentId) => {
    const { like, userInfo } = this.props;

    //TODO: check of existing likes from that user

    like({
      userId: userInfo.id,
      targetId: commentId,
      authorId,
      parentId
    });
  }

  render() {
    const {
      activity_id,
      updated_at,
      user,
      id,
      children_counts,
      latest_children,
      data,
      user_id
    } = this.props;
    const { expandedForm } = this.state;
    const childCommentsCount = children_counts.comment || 0;
    return (
      <Card>

        <Card.Content
          className="comment-content"
          onClick={() => this.setState(state => ({ expandedForm: !state.expandedForm }))}
        >
          <Card.Header><Link to={`/user/${user.id}`}>{user.data.name}</Link></Card.Header>
          <Card.Meta>
            <Label onClick={() => this.clickOnLike(id, user_id, activity_id)}>
              <Icon
                name="like"
              />
              {children_counts.like? children_counts.like : 0}
            </Label>

            <Label>
              <Icon name="comment" />
              {childCommentsCount}
            </Label>

          </Card.Meta>
          <Card.Description
            className="comment-time"
          >
            {moment(updated_at).format('DD MMM YYYY')}
          </Card.Description>
          <Card.Description dangerouslySetInnerHTML={{ __html: data.text }}></Card.Description>
        </Card.Content>

        {
          childCommentsCount != 0
          && (
            <Card.Content className="child-comments">
              {
                latest_children.comment
                && latest_children.comment.map( comm => <ChildComment data={comm} key={comm.id} />)
              }
            </Card.Content>
          )
        }

        { expandedForm && (
          <Card.Content className="child-comment-form">
            <Form>
              <ArticleEditor
                handleChangeStory={this.handleChangeContent}
                data={this.state}
                blockStyleControls={false}
              />
              <Button
                floated="right"
                onClick={this.handleSubmit}
                className="green-bordered-button"
              >Answer
              </Button>
            </Form>
          </Card.Content>
        )}

      </Card>
    )
  }
}

export default withRouter(
  connect(
    (state) => {
      return {
        userInfo: state.user.userInfo,
        likeSending: state.socialFeed.likeSending
      };
    },
    dispatch => ({
      like: (params) => {
        dispatch( actions.like(params) );
      },
      deleteReaction: (params) => {
        dispatch( actions.deleteReaction(params) );
      },
      comment: (params) => {
        dispatch( actions.createSocialComment(params) );
      },
      expandPost: (params) => {
        dispatch( actions.expandPost(params) );
      }
    })
  )(SocialPost)
);