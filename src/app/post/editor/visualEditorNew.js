import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import moment from 'moment';
import { Container, Grid, Input, Image, Dimmer, Loader, Button, Message, Modal, Icon, Divider, Popup } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as editorActions from '../../util/dashboard/EditorActions';
import * as categoriesActions from '../../yourtrybe/articles/articlesActions';
import MetaData from '../../util/dashboard/metadata/MetaData';
import FroalaEditor from '../../util/froalaEditor/froalaEditor';
import trybeIcon from '../../svg/trybeicon.svg';
//import { setPageForGoogleAnalytics } from '../../util/helperFunctions';
import placeholder from '../../../staticAssets/images/article_placeholder.png';
import SideControl from '../../yourtrybe/components/SideControl';

import ImageEditor from './imageEditor';

class VisualEditor extends Component {
  constructor(props) {
    super(props);
    const { featuredImageUrl } = props;
    this.state = {
      featuredImagePreviewUrl: featuredImageUrl || null,
      showCat: false,
      selectedCat: '',
      data: {
        title: '',
        content: '',
        categories: [],
        show: false,
        publishRule: false
      }
    };
    this.deleteCategory = this.deleteCategory.bind(this);
    this.handleAddingFeaturedImage = this.handleAddingFeaturedImage.bind(this);
    this.addCategory = this.addCategory.bind(this);
  }

  componentDidMount() {
    //setPageForGoogleAnalytics('VisualEditor');
    const { getCategories } = this.props;
    getCategories();
  }

  componentDidUpdate(prevProps) {
    const {
      featuredImage,
      articleIsCreated,
      articleOnCreatedAction,
      history
    } = this.props;

    if (prevProps.featuredImage !== featuredImage && featuredImage.id) {
      this.upadteFeaturedImage(featuredImage);
    }
    if (articleIsCreated) {
      history.push('/profile/my-articles/');
      articleOnCreatedAction();
    }
  }

  upadteFeaturedImage(featuredImage) {
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        featured_media: featuredImage.id
      }
    });
  }

  handleAddingFeaturedImage(file) {
    const { cookies, uploadFeatureImage } = this.props;
    const token = cookies.get('trybe_jwt', { path: '/' });
    uploadFeatureImage({ file, token });
  }

  uploadFeaturedImageHandler = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    const fileSize = e.target.files[0].size;
    const fileMath = Math.round((fileSize / 1024));
    if (file && fileMath < 4096) {
      reader.onloadend = () => {
        this.setState({
          // uploadedFeaturedImage: file,
          featuredImagePreviewUrl: reader.result
        });
        this.handleAddingFeaturedImage(file);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Image too Big, please select a Image less than 4MB");
    }
  };

  createArticle(data, status) {
    const { createArticle, cookies } = this.props;
    const endData = JSON.parse(JSON.stringify(data));
    endData.status = status;
    const { data, selectedCat } = this.state;
    const { feauturedImageLoading, postData } = this.props;
    if (status == 'publish') {
      if ((data.title.length < 10) || (data.content.length < 300) || (postData && postData.status == 'pending') || !placeholder || !selectedCat || (feauturedImageLoading == undefined || feauturedImageLoading)) {
        console.log('publish articles')
        this.setState({ publishRule: true })
        setTimeout(() => {
          this.setState({ publishRule: false })
        }, 2500)
      } else {
        this.showModal()
        createArticle({
          data: endData,
          token: cookies.get('trybe_jwt', { path: '/' })
        });
      }

    } else {
      if ((data.title.length < 10) || !selectedCat) {
        this.setState({ draftRule: true })
        setTimeout(() => {
          this.setState({ draftRule: false })
        }, 2500)
      } else {
        console.log("made it!")
        this.showModal()
        createArticle({
          data: endData,
          token: cookies.get('trybe_jwt', { path: '/' })
        });
      }
    }
  }

  handleChangeTitle = (event) => {
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        title: event.target.value
      }
    });
  }

  showModal = () => {
    this.setState({ show: true });
    setTimeout(() => {
      this.hideModal()
    }, 5000)
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  renderTokens(centered) {
    const { selectedCat } = this.state;
    //console.log(selectedCat);
    const style = {
      justifyContent: centered ? 'center' : 'flex-end',
      margin: centered ? '0 auto' : 0
    };
    return (
      <div className="tokens" style={style}>
        0
        <Image src={trybeIcon} />
      </div>
    );
  }

  handleChangeStory = (story) => {
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        content: story
      }
    });
    //console.log(data.content.length);
  };

  addCategory(category) {
    const { data } = this.state;
    this.setState(
      {
        data: {
          ...data,
          categories: [category.id]
        },
        selectedCat: category.name,
      },
    );
  }

  deleteCategory(category) {
    const { data } = this.state;
    this.setState(
      {
        data: {
          ...data,
          categories: data.categories.filter(id => category.id !== id)
        }
      },
      () => console.log(this.state)
    );
  }

  handleCatToggle() {
    const { showCat } = this.state;
    this.setState({ showCat: showCat ? false : true });
  }

  render() {
    const { data, featuredImagePreviewUrl, showCat, selectedCat, show, publishRule, draftRule } = this.state;
    const { userInfo, feauturedImageLoading, categories, postData, sendingArticle, history, articleIsCreated } = this.props;
    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'Article',
        action: 'click',
        label: 'submit',
        value: 1
      }
    });
    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'Article',
        action: 'click',
        label: 'save',
        value: 1
      }
    });
    return (
      <Grid className="page-wrapper cz-new-edit">
        <SideControl />
        <Grid className="cz-new-js">
          {!sendingArticle && data && (
            <React.Fragment>
              <Container>
                <Grid className="articlePoints">
                  <ul>
                    <li><h6>Article Requirements</h6></li>
                    <li>
                      Articles must be more than 300 words or contain a video or other useful content (eg. infographics)
                    </li>
                    <li>
                      Articles must be related to cryptocurrencies or blockchain technology
                    </li>
                    <li>
                      Articles should be carefully edited and include a title, nice cover image, and category
                    </li>
                    <li>
                      Articles must be your own work and not copied from somewhere else
                    </li>
                  </ul>
                </Grid>
              </Container>
              {/*
                <Grid.Row className="editImage">
                  <Modal
                    size="fullscreen"
                    trigger={<Button className="post-category"><small>New*</small> Image Editor</Button>}
                    actions={['Close']}
                  >
                    <Modal.Content scrolling>
                      <ImageEditor />
                    </Modal.Content>
                  </Modal>
                </Grid.Row>
              */}
            </React.Fragment>
          )}
          <Container>
            <Grid.Row>
              <Grid.Column>
                {!sendingArticle && articleIsCreated && (
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width="5" style={{ margin: 'auto' }} className="post-header post-header__visual">
                        <Message info>
                          <Message.Header>Article Updated</Message.Header>
                        </Message>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                )}
                {!sendingArticle && data
                  ? (
                    <Grid className="my-grid">
                      <Grid.Row>
                        <Grid.Column width="16" className="cz-write-message">
                          <div className="post-header post-header__visual">
                            <h3><Input className="title" placeholder="Name your article" fluid autoFocus onChange={this.handleChangeTitle} /></h3>
                            <span>Title Character Minimum: 10</span>
                          </div>
                          <Grid.Row>
                            <Grid.Column>
                              <div className="post-categories-n-tags">
                                <div className="post-categories">
                                  <Button className="post-category" onClick={() => { this.handleCatToggle(); }}>
                                    {!showCat ? selectedCat ? selectedCat : 'Choose a Category' : 'Close Categories'}
                                  </Button>
                                </div>
                              </div>
                            </Grid.Column>
                          </Grid.Row>
                          <div className="post-date">
                            <Divider />
                            <div className="post-author">
                              <b style={{ marginRight: '5px', color: '#4DD4B6' }}>
                                <Image
                                  src={userInfo.avatar_urls && userInfo.avatar_urls[96]}
                                  avatar
                                  circular
                                  to="/"
                                />
                                <span style={{ marginLeft: '0.5rem' }}>Published By : {userInfo.name}</span>
                              </b>
                              {' . '} {moment().format('MMMM DD, YYYY')}
                              <Button
                                content="Follow"
                                floated="right"
                                size="tiny"
                                disabled
                                className="green-bordered-button"
                              />
                            </div>
                            <Divider />
                          </div>
                          <div className="post-date cz-post-date-onmobi">
                            <Divider />
                            <div className="post-author">
                              <b style={{ marginRight: '5px', color: '#4DD4B6' }}>
                                <Image
                                  src={userInfo.avatar_urls && userInfo.avatar_urls[96]}
                                  avatar
                                  circular
                                  to="/"
                                />
                                <span style={{ marginLeft: '0.5rem' }}>Published By : {userInfo.name}</span>
                              </b>
                              <i>{moment().format('MMMM DD, YYYY')}</i>
                              <Button
                                content="Follow"
                                floated="right"
                                size="tiny"
                                disabled
                                className="green-bordered-button"
                              />
                            </div>
                            <Divider />
                          </div>
                        </Grid.Column>
                      </Grid.Row>
                      {showCat && (
                        <Grid.Row>
                          <Grid.Column>
                            <div className="post-categories-n-tags">
                              <MetaData
                                deleteCategory={this.deleteCategory}
                                addCategory={this.addCategory}
                                categories={categories && categories}
                                chosenCategories={categories.map(id => ({
                                  id
                                }))}
                              />
                            </div>
                          </Grid.Column>
                        </Grid.Row>
                      )}
                      <Grid.Row>
                        <Grid.Column>
                          {!featuredImagePreviewUrl ? (
                            <div className="post-featured-image">
                              <div className="meta-data-segment-featured-image">
                                <div className="upload-text-wrapper">
                                  <div className="upload-link">
                                    <label htmlFor="file-input">
                                      <div className="img-up-cz"><Image src="/cz-upp.svg" /></div>
                                    </label>
                                    <input
                                      type="file"
                                      id="file-input"
                                      accept="image/png, image/jpeg, image/gif"
                                      onChange={this.uploadFeaturedImageHandler}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="post-featured-image">
                              <div className="meta-data-segment-featured-image">
                                <Dimmer active={feauturedImageLoading}>
                                  <Loader size="massive" indeterminate />
                                </Dimmer>
                                <div className="upload-text-wrapper">
                                  <div className="upload-link">
                                    <label htmlFor="file-input">
                                      <Image
                                        src={featuredImagePreviewUrl}
                                      />
                                      <Icon name="cloud upload" size="massive" />
                                    </label>
                                    <input
                                      type="file"
                                      id="file-input"
                                      onChange={this.uploadFeaturedImageHandler}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Grid.Column>
                      </Grid.Row>
                      <Container>
                        <Grid.Row className="editor">
                          <Grid.Column>
                            <FroalaEditor className="editor_text_box" data={data} height="300" handleChangeStory={this.handleChangeStory} />
                            {/* <span>Min Character: 300/{data.content.length}</span> */}
                            <div className="actions btn-wrap">
                              <div className="triger-conditions">
                                <div className={draftRule ? 'submitConditionTooltip' : 'hideTooltip'}>
                                  {(data.title.length < 10) &&
                                    <p>Title is too short</p>
                                  }
                                  {!selectedCat &&
                                    <p>Category is not selected</p>
                                  }
                                </div>
                                <button
                                  className="publish-button right-btn saveArticle"
                                  //disabled={data.title.length < 10 && !selectedCat}
                                  onClick={() => data.status == 'pending' ? this.createArticle(data, 'pending') : this.createArticle(data, 'draft')}
                                >Save
                                </button>
                              </div>
                              <div className="triger-conditions">
                                <div className={publishRule ? 'submitConditionTooltip' : 'hideTooltip'}>
                                  {(data.title.length < 10) &&
                                    <p>Title is too short</p>
                                  }
                                  {(data.content.length < 300) &&
                                    <p>The text is less than 300 words</p>
                                  }
                                  {!selectedCat &&
                                    <p>Category is not selected</p>
                                  }
                                  {(feauturedImageLoading == undefined || feauturedImageLoading) &&
                                    <p>Cover Image is required</p>
                                  }
                                </div>
                                <button
                                  // disabled={(data.title.length < 10) || (data.content.length < 300) || (postData && postData.status == 'pending') || !placeholder || !selectedCat || (feauturedImageLoading == undefined || feauturedImageLoading)}
                                  className="publish-button right-btn submitArticle"
                                  onClick={() => this.createArticle(data, 'publish')}
                                >Publish
                                </button>
                              </div>
                            </div>
                          </Grid.Column>
                        </Grid.Row>
                      </Container>
                    </Grid>
                  )
                  : (
                    <Loader active indeterminate={!data} className="dataLoader" />
                  )
                }
              </Grid.Column>
            </Grid.Row>
          </Container>
          <div className={show ? "modal display-block modal-delete" : "modal display-none modal-delete"}>
            <section className="modal-main">
              <span onClick={() => this.hideModal()}>+</span>
              <p>This post may take up to 15 minutes to appear in the news feed due to server caching. Please be patient!</p>
            </section>
          </div>
        </Grid>
      </Grid>
    );
  }
}
export default withCookies(
  withRouter(
    connect(
      (state, ownProps) => ({
        isAdmin: state.user.userInfo.extra_capabilities,
        userInfo: state.user.userInfo,
        categories: state.articles.categories,
        categoriesAreLoading: state.articles.categoriesAreLoading,
        articleIsCreated: state.editor.articleIsCreated,
        sendingArticle: state.editor.sendingArticle,
        uploadingImage: state.image.uploadingImage,
        featuredImage: state.editor.featuredImage,
        feauturedImageLoading: state.editor.feauturedImageLoading,
        cookies: ownProps.cookies
      }),
      dispatch => ({
        createArticle: (data) => {
          dispatch(editorActions.createArticleRoutine(data));
        },
        getCategories: (data) => {
          dispatch(categoriesActions.getAllCategories(data));
        },
        uploadFeatureImage: ({ file, token }) => {
          dispatch(editorActions.uploadFeaturedImageRoutine({ file, token }));
        },
        articleOnCreatedAction: () => {
          dispatch(editorActions.articleIsCreatedRoutine());
        }
      })
    )(VisualEditor)
  )
);