import React, { Component } from 'react';
import { Comment } from 'semantic-ui-react';
import { groupBy, findIndex, find, isEmpty } from 'lodash';
import CustomComment from './CustomComment';

export default class CommentsList extends Component {
  render() {
    const { comments, userInfo, onReply, onUserClick } = this.props;
    function countLevel(el, index, array) {
      const { parent } = el;

      if (parent === 0) {
        el.level = 0;
        return 0;
      } else {
        const parentEl = find(array, { id: parent });
        el.level = 1 + countLevel(parentEl, index, array);
        return el.level;
      }
    }
    const sortedByParent = groupBy(comments, 'parent');

    if (!isEmpty(sortedByParent)) {
      //counting inner levels

      //sorting by ISO time
      try {
        sortedByParent[0]
          .sort((a, b) => {
            return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
          })
          .reverse();
      } catch (error) {
        console.log(error)
      }

      //inserting replies right after parent comments

      Object.keys(sortedByParent).forEach((parent) => {
        if (parent !== 0) {
          const replies = sortedByParent[parent];
          const foundParentIndex = findIndex(sortedByParent[0], {
            id: parseInt(parent)
          });
          foundParentIndex > -1
            && sortedByParent[0].splice(foundParentIndex + 1, 0, ...replies);
        }
      });

      try {
        sortedByParent[0].forEach(countLevel);
      } catch (error) {
        console.log(error)
      }
    }

    return (
      <Comment.Group>
        {sortedByParent[0]
          && sortedByParent[0].map(
            ({
              content,
              level,
              id,
              _embedded,
              author,
              //do not refactor that, wp sometimes sends bad embedded data
              author_avatar_urls,
              date_gmt
            }) => (
              <CustomComment
                key={id}
                id={id}
                commentInfo={{content: content.rendered, date: date_gmt}}
                authorID={author}
                authorInfo={_embedded.author[0]}
                avatarURL={author_avatar_urls[96]}
                level={level}
                userInfo={userInfo}
                onReply={onReply}
                onUserClick={onUserClick}
              />
            )
          )}
      </Comment.Group>
    );
  }
}
