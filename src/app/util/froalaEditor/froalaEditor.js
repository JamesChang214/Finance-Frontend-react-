import React from "react";
// import ReactDOM from 'react-dom';

// Require Editor JS files.
import "froala-editor/js/froala_editor.pkgd.min.js";
import { connect } from "react-redux";
import { withCookies } from 'react-cookie';
// import './dashboard'
// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
// Require Font Awesome.
// import 'font-awesome/css/font-awesome.css';

import FroalaEditor from "react-froala-wysiwyg";
import 'froala-editor/js/plugins.pkgd.min.js';

// Include special components if required.
// import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

import $ from "jquery";
import { getMentionSuggestions } from "../dashboard/EditorActions";

window.$ = $;
// import FroalaEditorA from 'react-froala-wysiwyg/FroalaEditorA';
// import FroalaEditorButton from 'react-froala-wysiwyg/FroalaEditorButton';
// import FroalaEditorImg from 'react-froala-wysiwyg/FroalaEditorImg';
// import FroalaEditorInput from 'react-froala-wysiwyg/FroalaEditorInput';

class Froala extends React.Component {
  constructor(props) {
    super(props);
    this.handleModelChange = this.handleModelChange.bind(this);
    this.state = {
      modelNew: props.data && props.data.content
    };
    this.handleModelChange = this.handleModelChange.bind(this);
  }

  handleModelChange = (modelNew) => {
    const { handleChangeStory } = this.props;
    this.setState({ modelNew });
    handleChangeStory(modelNew);
  };

  render() {
    // const { handleChangeStory } = this.props;
    const { modelNew } = this.state;
    const { cookies } = this.props;
    const token = cookies.get('trybe_jwt');
    const configs = {
      key: "xGE6oE3G3C2B9C6A4fwsrnE2md1phaquH-8D1B3D3C2E6D1A1B4F4C3==", // Pass your key here
      attribution: false,
      autofocus: false,
      pastePlain: false,
      toolbarInline: false,
      charCounterCount: false,
      toolbarButtons: ['bold', 'italic', '-', 'paragraphFormat', 'formatOL', 'formatUL', '-', 'insertImage', 'insertLink', 'insertVideo', 'clearFormatting', 'undo', 'redo',],
      imageEditButtons: ['imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove'],
      toolbarVisibleWithoutSelection: true,
      toolbarSticky: true,
      toolbarStickyOffset: false,
      height: 700,
      fileUpload: false,
      // Image upload endpoint and options
      imageUploadURL: 'https://old.trybe.one/wp-json/wp/v2/media/',
      imageMaxSize: 5 * 1024 * 1024, // 5MB
      imageUploadParam: 'file',
      imageUploadMethod: 'POST',
      requestHeaders: {
        Authorization: 'Bearer ' + token,
      },
      imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'],
      // Block Video Uploads
      videoAllowedTypes: [],
      imageUploadRemoteUrls: false,
      requestWithCORS: false,
      events: {
        'image.uploaded': function (response) {
          response = JSON.parse(response).source_url;
          // Insert Image into editor
          this.image.insert(response, false, null, this.image.get(), response);
          return false;
        },
        'image.error': function (error) {
          console.log(error)
        }
      }
    }
    return (
      <div className="cz-textarea-setting" style={{ height: '55rem' }}>
        <FroalaEditor
          config={configs}
          model={modelNew}
          onModelChange={this.handleModelChange}
        />
        {/* <FroalaEditorView model={modelNew} /> */}
        {/* editorData(modelNew) */}
        {/* {console.log(modelNew + "gaurav")} */}
      </div>
    );
  }
}

export default withCookies((
  connect(
    (state, ownProps) => ({
      userInfo: state.user.userInfo,
      cookies: ownProps.cookies,
      mentionSuggestions: state.editor.mentionSuggestions
    }),
    dispatch => ({
      getMentionsSuggestions: (params) => {
        dispatch(getMentionSuggestions(params));
      }
    })
  )
)(Froala));
