import React, { PureComponent } from 'react';
import { Grid, Menu, Loader, Responsive, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { setPageForGoogleAnalytics } from '../../util/helperFunctions';
import General from './components/General';
import TerraAccout from './components/TerraAccount';
import * as actions from './settingsActions';
import * as userActions from '../../user/userActions';

class Settings extends PureComponent {
  state = { activeItem: 'General' };

  componentDidMount() {
    setPageForGoogleAnalytics('your-trybe/settings');
  }

  componentDidUpdate = (prevProps) => {
    const { isLoading } = this.props;
    if (prevProps.isLoading === true && isLoading === false) {
      const { getUserData, cookies } = this.props;
      const token = cookies.get('trybe_jwt');
      getUserData(token);
    }
  }

  componentWillUnmount = () => {
    const { cleanMessages } = this.props;
    cleanMessages();
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  render() {
    const { activeItem } = this.state;
    const { isLoading, gettingUserData } = this.props;
    let ActiveTab = General;
    switch (activeItem) {
      case 'General':
        ActiveTab = General;
        break;
      case 'Terra account':
        ActiveTab = TerraAccout;
        break;
      default:
        ActiveTab = General;
        break;
    }
    window.dataLayer.push({
      event: 'pageview',
      page: {
        url: '/profile/settings',
        title: 'Settings'
      }
    });
    return (
      <Grid className="settings cz-settings" style={{ marginBottom: '200px' }}>
        <Responsive
          as={Grid.Column}
          width={16}
          className="menu"
        >
          <Menu vertical inverted>
            <Menu.Item
              name="General"
              active={activeItem === 'General'}
              onClick={this.handleItemClick}
            >
              <Image src="/general.svg" />
              <Image className="cz-publish-filter-icon" src="/general-active.svg" />
              General
            </Menu.Item>
            <Menu.Item
              name="Terra account"
              active={activeItem === 'Terra account'}
              onClick={this.handleItemClick}
            >
              <Image src="/terra.svg" />
              <Image className="cz-publish-filter-icon" src="/terra-active.svg" />
              Terra Account
            </Menu.Item>
          </Menu>
        </Responsive>
        <Grid.Row>
          <h4>{`${activeItem}  info`}</h4>
        </Grid.Row>
        {isLoading || gettingUserData ? <Loader active /> : <ActiveTab />}
      </Grid>
    );
  }
}

export default withCookies(
  withRouter(
    connect(
      (state, ownProps) => ({
        userInfo: state.user.userInfo,
        cookies: ownProps.cookies,
        isLoading: state.settings.settingsUpdating,
        gettingUserData: state.user.gettingUserData
      }),
      dispatch => ({
        getUserData: params => dispatch(userActions.getUserData(params)),
        cleanMessages: params => dispatch(actions.cleanSetEosAccountMessage(params))
      })
    )(Settings)
  )
);