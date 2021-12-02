import React, { PureComponent } from 'react';
import { Grid, Tab, List, Icon, Button, Image, Menu, Responsive } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import NotificationList from '../../sidebar/notifications/NotificationList';
import { setPageForGoogleAnalytics } from '../../util/helperFunctions';

class Notifications extends PureComponent {
  componentDidMount = () => {
    setPageForGoogleAnalytics('your-trybe/notifications');
  }

  render() {
    const panes = [
      {
        menuItem: (
          <Menu.Item key="notifications">
            <Icon name="bell" />Notifications
          </Menu.Item>
        ),
        render: () => {
          return (
            <NotificationList />
          );
        }
      }
    ];

    return (
      <Grid className="following-content cz-following-content">
        <Grid.Row>
          <Responsive
            
            as={Grid.Column}
            width="16"
            className="notifications-wrapper"
          >
            <Grid.Row className="tabs-panel">
              <Tab
                menu={{ text: true }}
                panes={panes}
              />
            </Grid.Row>
          </Responsive>

        </Grid.Row>
      </Grid>
    );
  }
}

export default withCookies(
  withRouter(
    connect(
      (state, ownProps) => {
        return {
          followers: state.following.followers,
          following: state.following.following,
          isLoadingFollowers: state.following.loadingList,
          isLoadingSubscription: state.following.loadingSubscribe,
          loadingIndexes: state.following.loadingIndexes,
          userInfo: state.user.userInfo,
          cookies: ownProps.cookies,
        };
      },
    )(Notifications)
  )
);