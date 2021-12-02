import React, { Component } from 'react';
import { Button, Container, Loader, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import Helmet from 'react-helmet';
import * as api from '../Api';
import Feed from '../../../util/feed/Feed';
import SideControl from '../../../yourtrybe/components/SideControl';

class UpdateArticle extends Component {
  state = { catId: null };

  componentDidMount() {
    const { match } = this.props;
    const { id } = match.params;
    api.getCategoryId(id).then(catId => this.setState({ catId }));
  }

  render() {
    const { catId } = this.state;
    const { history, match } = this.props;
    return (
      // cz-categry-parent
      <Grid className="page-wrapper">
        <Helmet>
          <title>Loop Finance | {match.params.id}</title>
        </Helmet>
        {/* {sidebarOpened && ( */}
        <SideControl />
        {/* )} */}
        <div className="cz-single-post">
          <Container><Button className="backCategory" onClick={() => history.push('/categories/')}>Back to categories</Button>
            <h6>Title: <b>{match.params.id}</b></h6>
          </Container>
          {catId ? (
            <Feed queryParams={catId == 205 ? `&categories=${catId}&orderby=token_score_average&cache=true` : `&categories=${catId}&cache=true`} />
          ) : (
            <Loader active indeterminate />
          )}
        </div>

      </Grid>
    );
  }
}
export default withCookies(withRouter(
  connect(
    (state, ownProps) => ({
      cookies: ownProps.cookies,
      token: state.user.token,
      userInfo: state.user.userInfo,
      isAuthorized: state.user.userIsLogged,
      comments: state.post.postComments,
      isCommentsLoading: state.post.isCommentsLoading,
      isPostLoading: state.post.isPostLoading,
      info: state.post.postInfo
    }),
  )(UpdateArticle)
));
