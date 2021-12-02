import React, { Component } from 'react';
import { withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';
import { withCookies } from 'react-cookie';
import Dashboard from '../util/dashboard/Dashboard';
import { getPostInfo } from '../post/postActions';

class UpdateArticle extends Component {
  // state = { postData: null };
  componentDidMount() {
    const { match, getPost, cookies } = this.props;
    const { id } = match.params;
    const token = cookies.get('trybe_jwt', {
      path: '/'
    });
    getPost({id, token});
  }

  render() {
    const { info } = this.props;
    const style = {minHeight: '100vh'};
    return (
      <div style={style}>
        {info.id ? (
          <Dashboard postData={info} mode="edit" />
        ) : (
          <Loader active />
        )}
      </div>
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
    dispatch => ({
      getPost: (id) => {
        dispatch(getPostInfo(id));
      }
    })
  )(UpdateArticle)
));
