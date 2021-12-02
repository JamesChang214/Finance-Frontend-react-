import React, { Component } from 'react';
import { Feed, Button, Image } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { removeRealtimeNotification } from './NotificationsActions';

class RealtimeNotification extends Component {
  getVerbAndObject = (verb, object) => {
    if (verb == 'follow') return 'subscribed on you';
    if (verb == 'post') return 'posted new article';
    if (verb == 'like' && object == 'comment') return 'liked your comment';
    if (verb == 'like') return 'liked your post';
    if (verb == 'comment') return 'commented your post';
    if (verb == 'answer') return 'answered your comment';
    if (verb == 'mention') return 'mentioned you in his posts';
    if (object == 'friendship' && verb == 'want') return 'wants to add you as a friend';
    if (object == 'friendship' && (verb == 'accept' || verb == 'reject')) {
      return `${verb}ed your friendship request`;
    }
    return '';
  };

  render() {
    const { pool, read } = this.props;
    return (
      <div className="realtime-notification-wrapper">
        {pool.map((el) => {
          const verbAndObject = this.getVerbAndObject(el.verb, el.object);
          return (
            <div className="notification-wrapper" key={el.id}>
              <Feed>
                <Button
                  floated="right"
                  className="close"
                  onClick={() => read(el.id)}
                >
                  X
                </Button>
                <Feed.Event>
                  <Feed.Label>
                    <Image src={el.actor.data.avatarUrl} avatar />
                  </Feed.Label>
                  <Feed.Content>
                    <Feed.Summary>
                      <Link to={`/user/${el.actor.id}/`}>
                        {el.actor.data.name}
                      </Link>{' '}
                      {verbAndObject}
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>
              </Feed>
            </div>
          );
        })}
      </div>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      userInfo: state.user.userInfo,
      newNotification: state.notifications.newNotification,
      pool: state.notifications.realtime,
      realtimeDeleted: state.notifications.realtimeDeleted
    }),
    dispatch => ({
      read: (params) => {
        dispatch(removeRealtimeNotification(params));
      }
    })
  )(RealtimeNotification)
);
