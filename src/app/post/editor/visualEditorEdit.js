import React, { Component, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import moment from 'moment';
import { Container, Grid, Input, Image, Dimmer, Loader, Button, Responsive, Message, Icon, Divider, Popup, Modal } from 'semantic-ui-react';
import he from 'he';
import { connect } from 'react-redux';
import * as editorActions from '../../util/dashboard/EditorActions';
import * as categoriesActions from '../../yourtrybe/articles/articlesActions';
import * as actions from '../postActions';
import MetaData from '../../util/dashboard/metadata/MetaData';
import FroalaEditor from '../../util/froalaEditor/froalaEditor';
import trybeIcon from '../../svg/trybeicon.svg';
//import { setPageForGoogleAnalytics } from '../../util/helperFunctions';
import placeholder from '../../../staticAssets/images/article_placeholder.png';
import SideControl from '../../yourtrybe/components/SideControl';

class VisualEditor extends Component {
  constructor(props) {
    super(props);
    const { featuredImageUrl } = props;
    this.state = {
      featuredImagePreviewUrl: featuredImageUrl || null,
      showCat: false,
      selectedCat: '',
      show: false,
      data: false
    };
    this.deleteCategory = this.deleteCategory.bind(this);
    this.handleAddingFeaturedImage = this.handleAddingFeaturedImage.bind(this);
    this.addCategory = this.addCategory.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  componentDidMount() {
    //setPageForGoogleAnalytics('VisualEditor');
    const { getCategories, match, getPost, cookies } = this.props;
    const { id } = match.params;
    const token = cookies.get('trybe_jwt', {
      path: '/'
    });
    getPost({ id, token });
    getCategories();
  }

  componentDidUpdate(prevProps) {
    const {
      featuredImage,
      info,
      articleIsCreated,
      articleOnCreatedAction,
      history,
      getPrerenderStatus,
      articleDeleted
    } = this.props;

    if (prevProps.info !== info) {
      this.mapPostData(info);
      if (info.slug) getPrerenderStatus(info.slug);
    }

    if (prevProps.featuredImage !== featuredImage && featuredImage.id) {
      this.upadteFeaturedImage(featuredImage);
    }

    if (articleDeleted) {
      history.push('/profile/my-articles/');
      articleOnCreatedAction();
    }

    if (articleIsCreated) {
      history.push('/profile/my-articles/');
      articleOnCreatedAction();
    }
  }

  componentWillUnmount() {
    const { clearPostInfo } = this.props;
    clearPostInfo();
  }

  updateArticle(data, status) {
    const { updateArticle, cookies, preRendered, sendPrerenderRequest } = this.props;
    const endData = JSON.parse(JSON.stringify(data));
    endData.status = status;

    if (status == 'publish') {
      updateArticle({
        id: endData.id,
        data: endData,
        token: cookies.get('trybe_jwt', { path: '/' }),
      });
      if (endData.slug) sendPrerenderRequest(endData.slug);
    } else {
      updateArticle({
        id: endData.id,
        data: endData,
        token: cookies.get('trybe_jwt', { path: '/' }),
      });
    }
  }

  deleteArticle(id) {
    this.hideModal();
    const { deleteArticle, cookies } = this.props;
    if (id) {
      deleteArticle({
        id: id,
        token: cookies.get('trybe_jwt', { path: '/' }),
      });
    }
  }

  mapPostData(data) {
    const newData = { ...data };
    newData.title = he.decode(data.title.rendered);
    newData.content = data.content.rendered;
    this.setState({ data: newData });
    data._embedded['wp:term'] && this.addCategory(data._embedded['wp:term'][0][0]);
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

  handleChangeTitle = (event) => {
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        title: event.target.value
      }
    });
  }

  renderTokens(centered) {
    const { selectedCat, data } = this.state;
    console.log(data);
    console.log(selectedCat);
    const style = {
      justifyContent: centered ? 'center' : 'flex-end',
      margin: centered ? '0 auto' : 0
    };
    return (
      <div className="tokens" style={style}>
        {centered ? `Article Earnings: ${data.details.tokens}` : data.details.tokens}
        <Image src={trybeIcon} />
      </div>
    );
  }

  handleChangeStory = (story) => {
    const { data } = this.state;
    console.log(data)
    this.setState({
      data: {
        ...data,
        content: story
      }
    });
  };

  addCategory(category) {
    const { info } = this.props;
    const newData = { ...info };
    newData.title = he.decode(info.title.rendered);
    newData.content = info.content.rendered;
    this.setState(
      {
        data: {
          ...newData,
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
          data,
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

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  render() {
    const { data, featuredImagePreviewUrl, showCat, selectedCat, sidebarOpened, show } = this.state;
    const { userInfo, feauturedImageLoading, categories, articleIsCreated, sendingArticle, preRendered } = this.props;
    return (
      <Grid className="page-wrapper">
        <SideControl />
        <Grid className="cz-new-js">
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
                {!sendingArticle && userInfo && data && data.author == userInfo.id ? (
                  <Grid className="my-grid">
                    <Grid.Row>
                      <Grid.Column width="16" className="cz-write-message">
                        <div className="post-header post-header__visual">
                          <h3><Input className="title" placeholder="Name your article" value={data.title} fluid autoFocus onChange={this.handleChangeTitle} /></h3>
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
                            {preRendered ? <span className="prerendered" /> : <span className="prerendered-false" />}
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
                              chosenCategories={data.categories.map(id => ({
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
                                    <Image
                                      src={data._embedded['wp:featuredmedia'] && data._embedded['wp:featuredmedia'][0].source_url ? data._embedded['wp:featuredmedia'][0].source_url : placeholder}
                                    />
                                    <Icon name="cloud upload" size="massive" />
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
                          <FroalaEditor data={data} height="300" handleChangeStory={this.handleChangeStory} />
                          {/* <span>Min Character: 300/{data.content.length}</span> */}
                          <div className="actions">
                            <Popup
                              content="Delete Article"
                              trigger={(
                                <Button
                                  disabled={!data}
                                  icon="trash"
                                  style={{ backgroundColor: 'red' }}
                                  className="delete-button"
                                  onClick={() => this.showModal()}
                                />
                              )}
                            />
                            <Popup
                              content="Save Article as Draft"
                              trigger={(
                                <Button
                                  icon="save"
                                  className="draft-button"
                                  disabled={data.title.length < 10 || !selectedCat}
                                  onClick={() => data.status == 'pending' ? this.updateArticle(data, 'pending') : this.updateArticle(data, 'draft')}
                                />
                              )}
                            />
                            <Popup
                              content="Publish/Update Artcle"
                              trigger={(
                                <Button
                                  disabled={(data.title.length < 10) || (data && data.status == 'pending') || !placeholder || !selectedCat || (data._embedded['wp:featuredmedia'] && data._embedded['wp:featuredmedia'][0].source_url ? false : feauturedImageLoading == undefined || feauturedImageLoading)}
                                  className="publish-button"
                                  style={{ color: '#fff' }}
                                  onClick={() => this.updateArticle(data, 'publish')}
                                >Publish
                                </Button>
                              )}
                            />
                          </div>
                        </Grid.Column>
                      </Grid.Row>
                    </Container>
                  </Grid>
                ) : (
                  <Grid className='editArticleLoader'>
                    <Loader active indeterminate={!data} />
                  </Grid>
                )
                }

              </Grid.Column>
              <Grid>
                <div className={show ? "modal display-block modal-delete" : "modal display-none modal-delete"}>
                  <section className="modal-main">
                    <p>Are you sure you want to permanently delete your article?</p>
                    <Button variant="secondary" onClick={() => this.hideModal()}>
                      NO
                    </Button>
                    <Button variant="primary" onClick={() => this.deleteArticle(data.id)}>
                      Yes
                    </Button>
                  </section>
                </div>
              </Grid>
            </Grid.Row>
          </Container>
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
        info: state.post.postInfo,
        categories: state.articles.categories,
        categoriesAreLoading: state.articles.categoriesAreLoading,
        articleIsCreated: state.editor.articleIsCreated,
        articleDeleted: state.editor.articleDeleted,
        sendingArticle: state.editor.sendingArticle,
        uploadingImage: state.image.uploadingImage,
        featuredImage: state.editor.featuredImage,
        feauturedImageLoading: state.editor.feauturedImageLoading,
        preRendered: state.post.preRendered,
        cookies: ownProps.cookies
      }),
      dispatch => ({
        updateArticle: (data) => {
          dispatch(editorActions.updateArticleRoutine(data));
        },
        deleteArticle: (data) => {
          dispatch(editorActions.deleteArticleRoutine(data));
        },
        getPrerenderStatus: (data) => {
          dispatch(actions.getPrerenderRoutine(data));
        },
        sendPrerenderRequest: (data) => {
          dispatch(actions.sendPrerenderRoutine(data));
        },
        getCategories: (data) => {
          dispatch(categoriesActions.getAllCategories(data));
        },
        uploadFeatureImage: ({ file, token }) => {
          dispatch(editorActions.uploadFeaturedImageRoutine({ file, token }));
        },
        articleOnCreatedAction: () => {
          dispatch(editorActions.articleIsCreatedRoutine());
        },
        getPost: (params) => {
          dispatch(actions.getPostInfo(params));
        },
        clearPostInfo: () => {
          dispatch(actions.clearPostInfo());
        },
      })
    )(VisualEditor)
  )
);