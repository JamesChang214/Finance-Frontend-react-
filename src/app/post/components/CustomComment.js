import React, { Component } from 'react';
import { Comment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import TextArea from '../../textarea/Textarea';

export default class CustomComment extends Component {
  state = {
    openReplyField: false
  };

  render() {
    const {
      level,
      id,
      userInfo,
      onUserClick,
      commentInfo,
      onReply,
      avatarURL,
      authorID,
      authorInfo
    } = this.props;
    const {name} = authorInfo;
    const authorId = authorInfo.id || authorID;
    // console.log(authorInfo.avatar_urls[96]);
    // const avatarURL = authorInfo.avatar_urls[96];
    const { date, content } = commentInfo;
    const { openReplyField } = this.state;
    return (
      <React.Fragment>
        <Comment className={'comment-lvl-' + level}>
          <Comment.Avatar
            as={Link}
            to={`/user/${authorId}/`}
            src={avatarURL}
            onClick={() => onUserClick(authorInfo, authorId)}
          />
          <Comment.Content>
            <Comment.Author
              as={Link}
              to={`/user/${authorId}/`}
              onClick={() => onUserClick(authorInfo, authorId)}
            >
              {name}
            </Comment.Author>
            <Comment.Metadata>
              <div>
                {moment
                  .utc(date)
                  .local()
                  .format('DD MMMM YYYY')}
              </div>
            </Comment.Metadata>
            <Comment.Text dangerouslySetInnerHTML={{ __html: content }} />
            <Comment.Actions>
              {userInfo.id && (
                <Comment.Action
                  onClick={() => this.setState({
                    openReplyField: !openReplyField
                  })
                  }
                >
                  <i className="fas fa-reply" /> {'  '}Reply
                </Comment.Action>
              )}
            </Comment.Actions>
          </Comment.Content>
        </Comment>
        {openReplyField && userInfo.id && (
          <Comment className={'comment-lvl-' + (parseInt(level) + 1)}>
            <Comment.Avatar as="a" src={userInfo.avatar_urls[96]} />
            <Comment.Content>
              <Comment.Author>{userInfo.name}</Comment.Author>
              <Comment.Metadata>
                <div>
                  {moment
                    .utc()
                    .local()
                    .format('DD MMMM YYYY')}
                </div>
              </Comment.Metadata>
              <TextArea
                handler={text => onReply({ text, parent: id, replyId: authorID })}
                placeholder={`Type your reply to ${name} here...`}
                rows="3"
              />
            </Comment.Content>
          </Comment>
        )}
      </React.Fragment>
    );
  }
}
