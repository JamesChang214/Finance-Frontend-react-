import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Feed, Icon } from 'semantic-ui-react';
import moment from 'moment';

class Notification extends Component {
  getNames = (actor_count, activities) => {
    //if( actor_count == 2 ) return `${activities[0].actor} and ${activities[1].actor}`;
    if (actor_count == 1) return activities[0].name;
    if (actor_count >= 2) return `${activities[0].name} and ${actor_count - 1} more person${
      actor_count != 2 ? 's' : ''
    }`;
    return activities[0].name;
  };

  getObject = (verb, activity_count, activities) => {
    const count = activity_count;
    const some = count > 1;
    if (verb == 'post' && activities[0].object == 'comment' ) return ' commented on your article';
    if (verb == 'post' && activities[0].object == 'comment-reply' ) return ' replied to your comment';
    if (verb == 'post' && activities[0].object == 'rated' ) return ' rated your article';
    if (verb == 'comment' && activities[0].object == 'liked' ) return ` your comment`;
    if (verb == 'follow') return ' is now following you';
    if (verb == 'mention') {
      return `you ${some ? `${count} times` : ''} in his post${
        some ? 's' : ''
      }`;
    }
    return 'notification';
  };

  getVerb = (verb) => {
    switch (verb) {
      case 'follow':
        return 'is now following';
      default:
        return '';
    }
  };

  render() {
    const {element} = this.props;
    const { activities, updated_at, verb, activity_count } = element;
    const object = this.getObject(verb, activity_count, activities);
    const { actor, target } = activities[0];
    const date = new Date(`${updated_at}Z`);
    return (
      <Feed.Event>
        <Feed.Label>
          <img
            src={actor.data.avatarUrl}
            onError={(e) => { e.target.onerror = null; e.target.src='http://guidancegroup.co.in/img/mentors/default.jpg'; }}
            alt="notification avatar"
          />
        </Feed.Label>
        <Feed.Content>
          <Feed.User as="span">
            <Link to={`/user/${actor.id}/`}>{actor.data.name}</Link>
          </Feed.User>{' '}
          {target ? <a href={`/${target}/`} style={{color: 'var(--green)'}}>{this.getVerb(verb)} {object}</a> : (this.getVerb(verb), object)}
          <Feed.Summary>
            <Feed.Date>
              <Icon name="time" />
              {moment(date)
                .startOf('second')
                .fromNow()}
            </Feed.Date>
          </Feed.Summary>
        </Feed.Content>
      </Feed.Event>
    );
  }
}

export default Notification;
