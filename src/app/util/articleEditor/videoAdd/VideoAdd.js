import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Popup } from 'semantic-ui-react';

class VideoAdd extends Component {
  state = { videoUrl: '' };

  onAddUrl() {
    const { editorState, onChange, modifier } = this.props;
    const { videoUrl } = this.state;
    console.log(videoUrl);
    videoUrl && onChange(modifier(editorState, { src: videoUrl }));
  }

  // uploadVideoHandler = e => {
  //   const { editorState, uploadVideo } = this.props;
  //   let reader = new FileReader();
  //   let file = e.target.files[0];
  //   if (file) {
  //     reader.onloadend = () => {
  //       uploadVideo({
  //         file: file,
  //         token: this.props.cookies.get("trybe_jwt")
  //       });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  render() {
    const popupStyle = {
      borderRadius: '6px',
      backgroundColor: 'rgb(48, 48, 60)'
    };
    return (
      <div className="addVideo">
        <Popup
          inverted
          trigger={(
            <button type="button">
              <i className="fal fa-video-plus" />
            </button>
          )}
          content={(
            <div className="video-input-container">
              <input
                placeholder="URL"
                type="text"
                onChange={({ target }) => this.setState({ videoUrl: target.value })
                }
              />
              <button
                type="submit"
                onClick={() => this.onAddUrl()}
              >
                Add
              </button>
            </div>
          )}
          on="click"
          position="top right"
          style={popupStyle}
        />
      </div>
    );
  }
}

export default withCookies(
  withRouter(
    connect((state, ownProps) => {
      return {
        cookies: ownProps.cookies
      };
    })(VideoAdd)
  )
);
