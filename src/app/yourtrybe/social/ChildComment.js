import React from 'react';
import { Feed } from 'semantic-ui-react';

const ChildComment = (props) => {
  const { data } = props;
  return (
    <Feed className="child-comment">
      <Feed.Event>
        <Feed.Label>
          <img src={data.user.data.avatarUrl} alt="" />
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>
            <Feed.User>{data.user.data.name}</Feed.User>
            <span dangerouslySetInnerHTML={{ __html: data.data.text }} />
          </Feed.Summary>
        </Feed.Content>
      </Feed.Event>
    </Feed>
  );
};

export default ChildComment;
