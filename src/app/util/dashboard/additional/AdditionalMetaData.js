import React, { Component } from 'react';
import { Grid, Button, Container, Input, Loader, Segment, Dimmer } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import className from 'classnames';

export default class AdditionalContent extends Component {
  constructor(props) {
    super(props);
    const { featuredImageUrl } = props;
    this.state = {
      // currentExperienceLevel: 'beginner',
      wasTheArticlePublished: false,
      // uploadedFeaturedImage: null,
      featuredImagePreviewUrl: featuredImageUrl || null
    };
  }

  // uploadImageHandler = e => {
  //   const { editorState, uploadImage } = this.props;
  //   let reader = new FileReader();
  //   let file = e.target.files[0];
  //   if (file) {
  //     reader.onloadend = () => {
  //       uploadImage({
  //         file: file,
  //         token: this.props.cookies.get('trybe_jwt')
  //       });
  //     };
  //     reader.readAsDataURL(file);
  //   };
  // };
  uploadFeaturedImageHandler = (e) => {
    const {featuredImageLoader} = this.props;
    const reader = new FileReader();
    const file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        this.setState({
          // uploadedFeaturedImage: file,
          featuredImagePreviewUrl: reader.result
        });
        featuredImageLoader(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // changeCurrentExperienceLevel = (level) => {
  //   this.setState({
  //     currentExperienceLevel: level
  //   });
  // };

  changeToggleState = (item) => {
    this.setState({
      wasTheArticlePublished: item
    });
  };

  render() {
    const { currentTab, feauturedImageLoading } = this.props;
    const {
      // currentExperienceLevel,
      wasTheArticlePublished,
      featuredImagePreviewUrl
    } = this.state;

    switch (currentTab) {
      case 'meta-data':
        return (
          <Grid.Column width={4} className="meta-data-segment-wrapper">
            <Container className="meta-data-segment">
              <div className="meta-data-segment-title">
                <i className="far fa-image fa-lg" />
                <p className="meta-data-segment-title-text">Featured Image</p>
              </div>
              {!featuredImagePreviewUrl ? (
                <div className="meta-data-segment-featured-image">
                  <div className="upload-featured-image">
                    <i className="fal fa-cloud-upload fa-3x" />
                  </div>
                  <div className="upload-text-wrapper">
                    <div className="upload-link">
                      <button type="button"><span className="upload-text">Drop file here or&nbsp;</span>click here to upload</button>
                      <input
                        type="file"
                        onChange={this.uploadFeaturedImageHandler}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="upload-text-wrapper">
                  <Segment style={{ backgroundColor: 'var(--header-back)'}}>
                    <Dimmer active={feauturedImageLoading}>
                      <Loader size="massive" indeterminate />
                    </Dimmer>
                    <img
                      className="featured-image-preview"
                      src={featuredImagePreviewUrl}
                      alt="preview"
                    />
                  </Segment>
                </div>
              )}
            </Container>
            {/* <Container className="meta-data-segment">
              <div className="meta-data-segment-title">
              <i className="fal fa-graduation-cap fa-lg" />
              <p className="meta-data-segment-title-text">Experience level</p>
            </div> */}
            {/* <div className="meta-data-segment-experience-level">
              <Button
                className={className('level-button', {
                  'current-level-button':
                    currentExperienceLevel === 'beginner'
                })}
                onClick={() => this.changeCurrentExperienceLevel('beginner')}
              >
                Beginner
              </Button>
              <Button
                className={className('level-button', {
                  'current-level-button':
                    currentExperienceLevel === 'intermediate'
                })}
                onClick={() => this.changeCurrentExperienceLevel('intermediate')
                }
              >
                Intermediate
              </Button>
              <Button
                className={className('level-button', {
                  'current-level-button':
                    currentExperienceLevel === 'advanced'
                })}
                onClick={() => this.changeCurrentExperienceLevel('advanced')}
              >
                Advanced
              </Button>
            </div>
            </Container>*/}
            {/* <Container className="meta-data-segment">
              <div className="meta-data-segment-title-wrapper">
                <div className="meta-data-segment-title">
                  <i className="fal fa-clipboard-list-check fa-lg" />
                  <p className="meta-data-segment-title-text">Series</p>
                </div>
                <Button className="add-button">Add</Button>
              </div>
              <div className="meta-data-segment-series">
                <p className="meta-data-segment-series-text">
                  Not part of a series
                </p>
                <Checkbox />
              </div>
              <div className="meta-data-segment-series">
                <p className="meta-data-segment-series-text">
                  Not part of a series
                </p>
                <Checkbox />
              </div>
              <div className="meta-data-segment-series">
                <p className="meta-data-segment-series-text">
                  Not part of a series
                </p>
                <Checkbox />
              </div>
              <div className="meta-data-segment-series">
                <p className="meta-data-segment-series-text">
                  Not part of a series
                </p>
                <Checkbox />
              </div>
              <div className="meta-data-segment-series">
                <p className="meta-data-segment-series-text">
                  Not part of a series
                </p>
                <Checkbox />
              </div>
            </Container> */}
            {/*
              <Container className="meta-data-segment">
                <div className="meta-data-segment-title">
                  <i className="fal fa-tag fa-lg" />
                  <p className="meta-data-segment-title-text">Tags</p>
                </div>
                <Input
                  placeholder="... Add tag"
                  type="text"
                  className="meta-data-segment-input-tag"
                />
                <Button className="meta-data-segment-tag-label-button">
                  Tag
                  <div className="meta-data-segment-tag-label-button-close">
                    <i className="fas fa-times fa-sm" />
                  </div>
                </Button>
              </Container>
            */}
            <Container className="meta-data-segment">
              <div className="meta-data-segment-title">
                <i className="fal fa-external-link fa-lg" />
                <p className="meta-data-segment-title-text">
                  Has this article been published elsewhere?
                </p>
              </div>
              <div className="meta-data-segment-toggle-wrapper">
                <Button.Group className="toggle-group">
                  <Button
                    className={className('toggle-group-toggle left', {
                      'toggle-group-toggle-current current-left':
                        wasTheArticlePublished === false
                    })}
                    onClick={() => this.changeToggleState(false)}
                  >
                    No
                  </Button>
                  <Button
                    className={className('toggle-group-toggle right', {
                      'toggle-group-toggle-current current-right':
                        wasTheArticlePublished === true
                    })}
                    onClick={() => this.changeToggleState(true)}
                  >
                    Yes
                  </Button>
                </Button.Group>
                {wasTheArticlePublished && (
                  <Input
                    placeholder="Enter the URL where the article was published"
                    type="text"
                    className="input-url"
                  />
                )}
              </div>
            </Container>
          </Grid.Column>
        );
      default:
        return null;
    }
  }
}

AdditionalContent.propTypes = {
  currentTab: PropTypes.string.isRequired
};
