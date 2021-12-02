import React, { Component } from 'react';

export default class StyleButton extends Component {
  constructor(props) {
    super(props);
    const { onToggle, style } = props;
    this.onToggle = (e) => {
      e.preventDefault();
      onToggle(style);
    };
  }

  render() {
    const { active, label } = this.props;
    let className = 'RichEditor-styleButton';
    if (active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span
        className={className}
        role="button"
        tabIndex={0}
        onKeyPress={({ key }) => key === 'Enter' && this.onToggle()}
        onMouseDown={this.onToggle}
      >
        {label}
      </span>
    );
  }
}
