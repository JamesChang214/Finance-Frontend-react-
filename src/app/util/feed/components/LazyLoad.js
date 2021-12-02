import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import placeholder from '../../../../staticAssets/images/placeholder.png';


class LazyBackground extends React.Component {
  state = { src: null };

  componentDidMount() {
    const { src } = this.props;

    const imageLoader = new Image();
    imageLoader.src = src;

    imageLoader.onerror = () => {
      // Decide what to do on error
      this.setState({ src: placeholder });
    };

    imageLoader.onload = () => {
      this.setState({ src });
    };
  }

  render() {
    const { src } = this.state
    return <Grid.Column className="content-img" width={6} style={{ backgroundImage: `url(${src ? src : placeholder})`, height: `100%` }} as={Link} to={`../../${this.props.url}/`} />
  }
}

export default LazyBackground;