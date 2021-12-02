import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { Feed } from 'semantic-ui-react';
import { getNotifications } from './NotificationsActions';

import Notification from './Notification';

class NotificationList extends Component {
  componentDidMount = () => {
    const { loadNotifications, userInfo } = this.props;
    loadNotifications({
      userId: userInfo.id,
      markSeen: true
    });
  };

  render() {
    const { loading, notifications } = this.props;
    return (
      <Feed>
        {loading ? (
          <div />
        ) : (
          notifications.map(el => <Notification key={el.id} element={el} />)
        )}
      </Feed>
    );
  }
}

export default withCookies(
  withRouter(
    connect(
      (state, ownProps) => ({
        userInfo: state.user.userInfo,
        notifications: state.notifications.notifications,
        cookies: ownProps.cookies,
        loading: state.notifications.loading
      }),
      dispatch => ({
        loadNotifications: (params) => {
          dispatch(getNotifications(params));
        }
      })
    )(NotificationList)
  )
);
