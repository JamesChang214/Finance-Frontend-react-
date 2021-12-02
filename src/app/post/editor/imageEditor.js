import React, { Component } from 'react';
import { PhotoEditorSDK } from '../../../photoeditorsdk';

class ImageEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {};
  }


  componentDidMount() {
  }

  componentWillUnmount() { }
  render() {
    return (
      <PhotoEditorSDK />
    )
  }
}

export default ImageEditor