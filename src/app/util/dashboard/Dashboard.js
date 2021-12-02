import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import className from 'classnames';
import { Container, Grid, Button, Loader, Dimmer, Responsive } from 'semantic-ui-react';
import he from 'he';
import Modal from 'react-modal';
import Article from './article/Article';
import * as editorActions from './EditorActions';
import * as categoriesActions from '../../yourtrybe/articles/articlesActions';
import MetaData from './metadata/MetaData';
// import Seo from "./seo/Seo";
import AdditionalMetaData from './additional/AdditionalMetaData';
// import ArticleEditor from '../articleEditor/ArticleEditor';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '600px',
    overflowY: 'scroll',
    color: 'black'
  }
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    // let getHtml = localStorage.getItem('htmlContent');
    const { htmlData, chosenCategories, postData } = props;
    this.state = {
      // getHtml: localStorage.getItem('htmlContent'),
      activeItem: 'publish',
      modalIsOpen: false,
      currentTab: 'article',
      chosenCategories,
      htmlData,
      data: postData
        ? Dashboard.mapPostData(postData)
        : {
          title: '',
          content: '',
          categories: []
        }
    };
    this.deleteCategory = this.deleteCategory.bind(this);
    this.addCategory = this.addCategory.bind(this);
    this.handleAddingFeaturedImage = this.handleAddingFeaturedImage.bind(this);
    this.openModal = this.openModal.bind(this);
    // this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  componentDidMount() {
    const { getCategories } = this.props;
    getCategories()
  }

  componentDidUpdate(prevProps) {
    const {
      featuredImage,
      articleIsCreated,
      history,
      articleOnCreatedAction
    } = this.props;

    if (prevProps.featuredImage !== featuredImage && featuredImage.id) {
      this.upadteFeaturedImage(featuredImage);
    }
    if (articleIsCreated) {
      history.push('/profile/my-articles');
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

  static mapPostData(data) {
    const newData = { ...data };
    newData.title = he.decode(data.title.rendered);
    newData.content = data.content.rendered;
    console.log(newData)
    return newData;
  }

  changeCurrentTab = (tab) => {
    this.setState({
      currentTab: tab
    });
  };

  handleChangeTitle = (event) => {
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        title: event.target.value
      }
    });
  };

  handleChangeStory = (story) => {
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        content: story
      }
    });
  };

  model = (story) => {
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        content: story
      }
    });
  }

  handleAddingFeaturedImage(file) {
    const { cookies, uploadFeatureImage } = this.props;
    const token = cookies.get('trybe_jwt', { path: '/' });
    uploadFeatureImage({ file, token });
  }

  createArticle(data, status) {
    const { createArticle, cookies } = this.props;
    const endData = JSON.parse(JSON.stringify(data));
    endData.status = status;
    createArticle({
      data: endData,
      token: cookies.get('trybe_jwt', { path: '/' })
    });
  }

  updateArticle(data, status) {
    const { updateArticle, cookies } = this.props;
    const endData = JSON.parse(JSON.stringify(data));
    endData.status = status;
    updateArticle({
      id: endData.id,
      data: endData,
      token: cookies.get('trybe_jwt', { path: '/' })
    });
  }

  addCategory(category) {
    const { data } = this.state;
    this.setState(
      {
        data: {
          ...data,
          categories: [category.id]
        }
      },
      () => console.log(this.state)
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

  // handleItemClick = (e, { name }) => {
  //   const { statusQuery } = this.state;
  //   this.setState({
  //     activeItem: name,
  //     statusQuery: statusQuery.replace(/[^=]*$/, name)
  //   });
  // };

  render() {
    const { currentTab, data, modalIsOpen } = this.state;
    const { sendingArticle, uploadingImage, mode, postData, feauturedImageLoading, categories } = this.props;
    return (
      <Container fluid className="dashboard-wrapper">
        {(sendingArticle || uploadingImage) && (
          <Dimmer active>
            <Loader />
          </Dimmer>
        )}
        <Grid>
          <Grid.Row>
            <Grid.Column textAlign="center" width={1} className="arrow-wrapper">
              {/* <i class="fas fa-arrow-left fa-2x" /> */}
            </Grid.Column>
            <Grid.Column
              width={16}
              className={className(
                { 'article-header': currentTab === 'article' },
                { 'meta-data-header': currentTab === 'meta-data' }
              )}
            >
              <Grid.Row className="tabs-row">
                <Button.Group toggle>
                  <Button
                    className={className('main-tab', {
                      'current-tab': currentTab === 'article'
                    })}
                    onClick={() => this.changeCurrentTab('article')}
                  >
                    Article
                  </Button>
                  <Button
                    className={className('main-tab', {
                      'current-tab': currentTab === 'meta-data'
                    })}
                    onClick={() => this.changeCurrentTab('meta-data')}
                  >
                    Publish
                  </Button>
                </Button.Group>
                {currentTab === 'meta-data' && (
                  <Button
                    floated="right"
                    className="publish-button"
                    disabled={(postData && postData.status == 'pending') || (data._embedded && data._embedded['wp:featuredmedia'][0].source_url ? false : feauturedImageLoading == undefined || feauturedImageLoading)}
                    onClick={() => mode == 'edit'
                      ? this.updateArticle(data)
                      : this.createArticle(data, 'publish')
                    }
                  >
                    {mode == 'edit' && postData.status == 'draft' ? 'Update Draft' : mode == 'edit' && postData.status == 'publish' ? 'Update Article' : 'Publish'}
                  </Button>
                )}
                {/*<Button
                  floated="right"
                  className="publish-button"
                  onClick={this.openModal}> Preview
                </Button>*/}
                <Modal
                  isOpen={modalIsOpen}
                  onAfterOpen={this.afterOpenModal}
                  onRequestClose={this.closeModal}
                  style={customStyles}
                  contentLabel="Example Modal"
                >
                  <div style={{ width: '100%', height: '30px', marginBottom: '30px', textAlign: 'center' }}> <h1>Preview Mode</h1></div>
                  {/* {console.log(JSON.stringify(data))} */}
                  <Button floated="right" className="publish-button" style={{ marginTop: '10px' }} type="button" onClick={this.closeModal}> Close </Button>
                  <h1 style={{ color: "#368f7c", borderTop: '2px solid #368f7c' }}>{data.title}</h1>
                  <div className="preview-content" dangerouslySetInnerHTML={{ __html: data.content }} />
                </Modal>
                {mode != 'edit' && (
                  <Button
                    floated="right"
                    className="publish-button"
                    onClick={() => !postData ? this.createArticle(data, 'draft') : postData.status == 'draft' && this.updateArticle(data)}
                  >
                    {!postData ? 'Save as draft' : postData.status == 'publish' ? 'Update Article' : postData.status == 'draft' && 'Update Draft'}
                  </Button>
                )}
                {currentTab != 'meta-data' && mode == 'edit' && (
                  <Button
                    floated="right"
                    className="publish-button"
                    onClick={() => !postData ? this.createArticle(data, 'draft') : postData.status == 'pending' ? this.updateArticle(data, 'pending') : postData.status == 'draft' ? this.updateArticle(data) : this.createArticle(data, 'draft')}
                  >
                    {!postData ? 'Save as draft' : postData.status == 'draft' ? 'Update Draft' : postData.status == 'pending' ? 'Send Article for Review' : 'Save as Draft'}
                  </Button>
                )}
                {currentTab === 'meta-data' && mode == 'edit' && (
                  <Button
                    floated="right"
                    className="publish-button"
                    disabled={data._embedded && data._embedded['wp:featuredmedia'][0].source_url ? false : feauturedImageLoading == undefined || feauturedImageLoading}
                    onClick={() => !postData ? this.createArticle(data, 'draft') : postData.status == 'pending' ? this.updateArticle(data, 'pending') : postData.status == 'draft' ? this.updateArticle(data, 'publish') : postData.status == 'pending' ? this.updateArticle(data, 'draft') : this.updateArticle(data)}
                  >
                    {!postData ? 'Save as draft' : postData.status == 'draft' ? 'Publish' : postData.status == 'pending' ? 'Send Article for Review' : 'Save as Draft'}
                  </Button>
                )}
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>
          <Grid.Column width={16} className="body-wrapper">
            {currentTab === 'article' && (
              <Article
                handleChangeTitle={this.handleChangeTitle}
                handleChangeStory={this.handleChangeStory}
                sendingArticle={sendingArticle}
                data={data}
              />
            )}
            {/*{currentTab === "seo" && <Seo />}*/}
          </Grid.Column>
          {/* <Responsive as={Grid.Row} minWidth={Responsive.onlyComputer.minWidth}>
            <Grid.Column width="12">
              {userIsLogged ? (
                <Feed
                  queryParams={
                    `&author=${userInfo.id}` + orderQuery + statusQuery
                  }
                  clickHandler={activeItem === 'draft' ? this.handleDraftClick : null}
                />
              ) : (
                  <Loader active />
                )}
            </Grid.Column>
          </Responsive> */}
        </Grid>


        <Responsive as={Grid} minWidth={Responsive.onlyComputer.minWidth}>
          <Grid.Row>
            <Grid.Column width={10}>
              {currentTab === 'meta-data' && (
                <MetaData
                  deleteCategory={this.deleteCategory}
                  addCategory={this.addCategory}
                  categories={categories && categories}
                  chosenCategories={data.categories.map(id => ({
                    id
                  }))}
                />
              )}
            </Grid.Column>
            <Grid.Column width={6}>
              <AdditionalMetaData
                featuredImageLoader={this.handleAddingFeaturedImage}
                featuredImageUrl={
                  data._embedded
                    ? data._embedded['wp:featuredmedia'][0].source_url
                    : null
                }
                feauturedImageLoading={data._embedded && data._embedded['wp:featuredmedia'][0].source_url ? false : feauturedImageLoading == undefined || feauturedImageLoading}
                currentTab={currentTab}
              />
            </Grid.Column>
          </Grid.Row>
        </Responsive>

        <Responsive as={Grid} maxWidth={Responsive.onlyTablet.maxWidth}>
          <Grid.Row>
            <Grid.Column width={16}>
              <AdditionalMetaData
                featuredImageLoader={this.handleAddingFeaturedImage}
                featuredImageUrl={
                  data._embedded
                    ? data._embedded['wp:featuredmedia'][0].source_url
                    : null
                }
                feauturedImageLoading={data._embedded && data._embedded['wp:featuredmedia'][0].source_url ? false : feauturedImageLoading == undefined || feauturedImageLoading}
                currentTab={currentTab}
              />
            </Grid.Column>
            <Grid.Column width={16}>
              {currentTab === 'meta-data' && (
                <MetaData
                  deleteCategory={this.deleteCategory}
                  addCategory={this.addCategory}
                  categories={categories}
                  chosenCategories={data.categories.map(id => ({
                    id
                  }))}
                />
              )}
            </Grid.Column>
          </Grid.Row>
        </Responsive>
      </Container>
    );
  }
}

export default withCookies(
  withRouter(
    connect(
      (state, ownProps) => ({
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
        },
        updateArticle: (data) => {
          dispatch(editorActions.updateArticleRoutine(data));
        }
      })
    )(Dashboard)
  )
);