import React from 'react';
import placeholder from '../../../staticAssets/images/placeholder.png';


class LazyBackground extends React.Component {
  state = { src: null };

  componentDidMount() {
    const { src } = this.props;

    const imageLoader = new Image();
    imageLoader.src = src;

    imageLoader.onload = () => {
      this.setState({ src });
    };
  }

  render() {
    const { src } = this.state
    return <div {...this.props} style={{ backgroundImage: `url(${src ? src : placeholder})`, marginBottom: '20px' }} className="featured_image" />;
  }
}

export default LazyBackground;