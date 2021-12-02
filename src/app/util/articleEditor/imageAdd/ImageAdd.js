import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import * as uploadImageActions from './ImageAddActions';

class ImageAdd extends Component {
  componentDidUpdate(prevProps) {
    const { editorState, imageUrl, onChange, modifier } = this.props;
    if (prevProps.imageUrl !== imageUrl) {
      onChange(modifier(editorState, imageUrl));
    }
  }

  uploadImageHandler = (e) => {
    const { uploadImage, cookies } = this.props;
    const reader = new FileReader();
    const file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        uploadImage({
          file,
          token: cookies.get('trybe_jwt')
        });
      };
      reader.readAsDataURL(file);
    }
  };

  render() {
    return (
      <div className="addImage">
        <button type="button">
          <i className="fal fa-image" />
        </button>
        <input type="file" onChange={this.uploadImageHandler} />
      </div>
    );
  }
}

export default withCookies(
  withRouter(
    connect(
      (state, ownProps) => ({
        imageUrl: state.image.imageUrl,
        cookies: ownProps.cookies
      }),
      dispatch => ({
        uploadImage: file => dispatch(uploadImageActions.uploadImageRoutine(file))
      })
    )(ImageAdd)
  )
);
