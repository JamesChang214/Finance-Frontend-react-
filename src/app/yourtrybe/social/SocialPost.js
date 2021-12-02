import React, { Component } from 'react';
import moment from 'moment';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Card,
  Image,
  Icon,
  Feed,
  Label,
  Button
} from 'semantic-ui-react';
import * as actions from './SocialFeedActions';
import FormAddSocialComment from './FormAddSocialComment';
import SocialComment from './SocialComment';

class SocialPost extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      expandedForm: false
    };
  }

  handleLikeClick = (ownReactions, targetId, authorId ) => {
    const { like, deleteReaction, userInfo } = this.props;
    if( !ownReactions.like || ownReactions == {}) {
      like({
        userId: userInfo.id,
        targetId,
        authorId
      });
    } else { // remove like
      deleteReaction({
        userId: userInfo.id,
        targetId: ownReactions.like[0].id
      });
    }
  }

  handleCommentClick = (activityId, comments) => {
    this.setState( state => ({ expandedForm: !state.expandedForm}) );
    if( comments !== 0) {
      const { expandPost, expandedPost, rollPostBack, userInfo } = this.props;
      if (expandedPost !== activityId || expandedPost === null) {
        expandPost({
          userId: userInfo.id,
          activityId
        });
      } else {
        rollPostBack();
        this.setState({ expandedForm: false });
      }
    }
  }

  render() {
    const {
      content,
      tags,
      featured_image,
      time,
      actor,
      reaction_counts,
      id,
      own_reactions,
      expandedPost,
      loadingComments,
      comments
    } = this.props;
    const { expandedForm } = this.state;

    const commentsLabel = reaction_counts.comment? reaction_counts.comment : 0;
    const pictureStyle = featured_image? {
      url: featured_image,
    } : {
      url: ' '
    };
    console.log(pictureStyle.url)
    return (
      <Card>
        <Card.Content className="header">
          <Feed className="post-creator">
            <Feed.Event>
              <Feed.Label>
                <img
                  src={actor.data.avatarUrl}
                  alt="feed-label"
                  onError={(e) => { e.target.onerror = null; e.target.src='http://guidancegroup.co.in/img/mentors/default.jpg'; }}
                />
              </Feed.Label>
              <Feed.Content>
                <Feed.Summary>
                  <Link to={`/user/${actor.id}`}>{actor.data.name}</Link> @ {actor.data.slug}
                </Feed.Summary>
                <Feed.Date>{moment(time).format('DD MMM YYYY')}</Feed.Date>
              </Feed.Content>
            </Feed.Event>
          </Feed>
          {/*<span className='date'></span>*/}
        </Card.Content>
        <Card.Content className="text">
          <Card.Description dangerouslySetInnerHTML={{__html: content}} />
        </Card.Content>
        <Card.Content className="tags">
          {
            tags.map(tag => (
              <Label color="black" key={tag}>{tag}</Label>
            ))
          }
        </Card.Content>
        <div className="social-post">
          <Image className="image-placeholder" src={pictureStyle.url} />
        </div>
        <Card.Content className="controls">
          <Button
            className="expand-form"
            onClick={() => this.handleCommentClick(id, commentsLabel)}
          >{ expandedPost === id ? '' : 'Write your comment here...'}
          </Button>
          <Card.Meta>

            <Label onClick={() => this.handleLikeClick(own_reactions, id, actor.id)}>
              <Icon
                name="like"
                className={own_reactions.like && 'active'}
              />
              {reaction_counts.like? reaction_counts.like : 0}
            </Label>

            <Label onClick={() => this.handleCommentClick(id, commentsLabel)}>
              <Icon name="comment" />
              {commentsLabel}
            </Label>

          </Card.Meta>
        </Card.Content>
        {
          expandedForm && (
            <Card.Content className="comment-form">
              <FormAddSocialComment
                postId={id}
                postAuthorId={actor.id}
                parentId={id}
                parentAuthorId={actor.id}
              />
            </Card.Content>
          )
        }
        {
          expandedPost === id && (
            <Card.Content className="comments">
              {
                !loadingComments && comments.map( comm => <SocialComment {...comm} key={comm.id} />)
              }
            </Card.Content>
          )
        }
      </Card>
    );
  }
}

export default withRouter(
  connect(
    (state) => {
      return {
        userInfo: state.user.userInfo,
        loadingComments: state.socialFeed.loadingComments,
        comments: state.socialFeed.comments,
        expandedPost: state.socialFeed.expandedPost
      };
    },
    dispatch => ({
      like: (params) => {
        dispatch( actions.like(params) );
      },
      deleteReaction: (params) => {
        dispatch( actions.deleteReaction(params) );
      },
      expandPost: (params) => {
        dispatch( actions.expandPost(params) );
      },
      rollPostBack: () => {
        dispatch( actions.rollPostBack() );
      }
    })
  )(SocialPost)
);