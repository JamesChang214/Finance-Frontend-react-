import React, { Component } from 'react';
import { Grid, Responsive, Icon, Popup, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import ReactHtmlParser from 'react-html-parser';
import * as actions from './SocialFeedActions';

import FormAddSocialPost from './FormAddSocialPost';
import SocialFeed from './SocialFeed';

class Social extends Component {
  componentDidMount() {
    const { getUserHelperData, cookies } = this.props;
    const token = cookies.get('trybe_jwt');

    if (token) {
      getUserHelperData(token);
    }
  }

  componentWillUnmount = () => {
    const { clear } = this.props;
    clear();
  }

  render() {
    const { UserHelper, UserId } = this.props;
    const userProfileLink = ( <div style={{marginBottom: '1.5rem'}}><b>Profile Link:</b><br /> <Icon name="linkify" /> https://trybe.one/user/{UserId}</div> );
    const userHelper = (
      <div>
        <Popup content={UserHelper &&( ReactHtmlParser(UserHelper.data) )} trigger={<Button icon="info" circular compact size="mini" />} />
      </div>
    );

    return (
      <Grid className="social-content">
        <Responsive
          maxWidth={768}
        >
          <div className="ui divider" />
        </Responsive>
        <Grid.Row>
          <Responsive
            maxWidth={Responsive.onlyTablet.maxWidth}
            as={Grid.Column}
            width="16"
            className="social-feed-wrapper"
          >
            <Grid.Row className="textarea-container">
              <Grid>
                <FormAddSocialPost />
              </Grid>
            </Grid.Row>

            <Grid.Row className="feed-container">
              <SocialFeed />
            </Grid.Row>
          </Responsive>

          <Responsive
            minWidth={Responsive.onlyComputer.minWidth}
            as={Grid.Column}
            width="16"
            className="social-feed-wrapper"
          >
            <Grid.Row className="textarea-container">
              <Grid>
                {userHelper}
                {userProfileLink}
                <FormAddSocialPost />
              </Grid>
            </Grid.Row>
            <Grid.Row className="feed-container">
              <SocialFeed />
            </Grid.Row>
          </Responsive>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withCookies(
  connect(
    (state, ownProps) => ({
      UserId: state.user.userInfo.id,
      UserHelper: state.socialFeed.userHelper,
      cookies: ownProps.cookies
    }),
    dispatch => ({
      clear: params => dispatch( actions.cleanSocialFeed(params) ),
      getUserHelperData: token => dispatch( actions.getUserHelperData({token}))
    })
  )(Social)
);