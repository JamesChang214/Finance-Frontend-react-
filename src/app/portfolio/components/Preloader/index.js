import React, { Component } from 'react';

export default class Preloader extends Component {
  render() {
    return (
      <div className="preloader-container">
        <span className="pulsate">Loading data. Please wait</span>
        <div className="spinner-pulse" />
      </div>
    );
  }
}
