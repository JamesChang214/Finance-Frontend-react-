import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Grid, Segment, Header, Label, Input, Divider, Loader, Image, List, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { setPageForGoogleAnalytics } from '../../util/helperFunctions';
import { getAllCategories } from '../../yourtrybe/articles/articlesActions';
import SideControl from '../../yourtrybe/components/SideControl';

// import parslLogo from '../../staticAssets/images/parsl-logo.png';
// import chainceLogo from '../../staticAssets/images/chaince-logo.png';
// import worbliLogo from '../../staticAssets/images/worbli-logo.jpg';
// import eosphereLogo from '../../staticAssets/images/eosphere-logo.png';
// import triangles from '../../staticAssets/images/triangles.png';
// import blockchain from '../../staticAssets/images/blockchain.png';
// import arrowRight from '../../staticAssets/images/arrow-right.svg';
// import playImage from '../../staticAssets/images/play-circle.svg';
// import teamImage from '../../staticAssets/images/team.png';

class About extends Component {
  constructor(props) {
    super(props);
    this.updateSearch = this.updateSearch.bind(this);
    this.updateSearchButton = this.updateSearchButton.bind(this);
    this.state = {
      search: '',
    };
  }

  componentDidMount() {
    const { getCategories } = this.props;
    setPageForGoogleAnalytics('Categories');
    getCategories();
  }

  updateSearch(event) {
    this.setState({ search: event.target.value.substr(0, 20) });
  }

  updateSearchButton(letter) {
    this.setState({ search: letter });
  }

  closeSidebar() {
    const {sidebarOpened} = this.state;
    this.setState({sidebarOpened: !sidebarOpened});
  }

  render() {
    const { search, sidebarOpened } = this.state;
    const { categories, categoriesAreLoading, categoriesList } = this.props;
    categories.sort((a, b) => {
      const x = a.name < b.name ? -1 : 1;
      return x;
    });

    const categorySearch = categories.filter(
      (data) => {
        return data.name.toLowerCase().indexOf(search.toLowerCase()) == 0;
      }
    );

    const alphabet = [...Array(26)].map((_, i) => String.fromCharCode(65 + i));

    return (

      <Grid className="page-wrapper">
        <Helmet>
          <title>Loop Finance | Categories</title>
        </Helmet>
        {/* {sidebarOpened && ( */}
        <SideControl />
        {/* )} */}
        <Grid columns={3} className="categories cz-categories">
          <Grid.Row>
            <Grid.Column>
              <Link to="../category/loop-finance/">
                <Segment secondary className="categories_bg categories_bg__active">
                  <Header as="h3">
                    <Header.Content style={{ color: 'var(--text-color)' }}>
                      <div className="category-img-cz"><Image src="../block-chain.svg" alt="" />
                        {categoriesList?.['0']}
                      </div>
                    </Header.Content>
                  </Header>
                </Segment>
              </Link>
            </Grid.Column>
            <Grid.Column>
              <Link to="../category/blockchain/">
                <Segment secondary className="categories_bg categories_bg__active">
                  <Header as="h3">
                    <Header.Content style={{ color: 'var(--text-color)' }}>
                      <div className="category-img-cz"><Image src="../block-chain.svg" alt="" />
                        {categoriesList?.['1']}
                      </div>
                    </Header.Content>
                  </Header>
                </Segment>
              </Link>
            </Grid.Column>

            <Grid.Column>
              <Link to="../category/nft">
                <Segment secondary className="categories_bg categories_bg__active">
                  <Header as="h3">
                    <Header.Content style={{ color: 'var(--text-color)' }}>
                      <div className="category-img-cz"><Image src="../nft.svg" alt="" />
                        {categoriesList?.['2']}
                      </div>
                    </Header.Content>
                  </Header>
                </Segment>
              </Link>
            </Grid.Column>
          </Grid.Row>
          <div className="cat-cz-both">
            <div className="categories categories__mt">
              <Grid.Row>
                <Grid.Column className="cz-seaarch-icon">
                  <Image src="/search.svg" alt="search" />
                  <Input className="search-input" size="huge" fluid placeholder="Search Categories..." onChange={this.updateSearch} />
                  <Divider />
                </Grid.Column>
              </Grid.Row>
            </div>
            <div className="categories categories__mt">
              <div className="filter-li">
                <div className="row">
                  <Label className="cz-seaarch-icon"><Image src="/filter.svg" alt="filter" />Filter:</Label>
                  <List>
                    {
                      alphabet.map((data) => {
                        return (
                          <List.Item as={Button} onClick={() => { this.updateSearchButton(data); }} style={{zIndex: '9999'}}>{data}</List.Item>
                        );
                      })
                    }
                  </List>
                </div>
                <Grid columns={3} className="categories categories__mb">
                  <Grid.Row>
                    {categoriesAreLoading
                      ? <Loader active intermediate />
                      : categorySearch.map((data) => {
                        return (
                          <Grid.Column key={data.id}>
                            <Link to={`../category/${data.slug}/`}>
                              <Segment secondary className="categories_bg">
                                <Header as="h3">
                                  <Header.Content style={{ color: 'var(--text-color)' }}>
                                    {data.name}
                                  </Header.Content>
                                </Header>
                              </Segment>
                            </Link>
                          </Grid.Column>
                        );
                      })
                    }
                  </Grid.Row>
                </Grid>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    );
  }
}
export default withRouter(
  connect(
    (state, ownProps) => ({
      isAdmin: state.user.userInfo.extra_capabilities,
      categories: state.articles.categories,
      categoriesAreLoading: state.articles.categoriesAreLoading,
      cookies: ownProps.cookies,
      categoriesList: { 0: 'LOOP', 1: 'Blockchain & Cryptocurrencies', 2: 'NFT' }
    }),
    dispatch => ({
      getCategories: () => {
        dispatch(getAllCategories());
      },
    })
  )(About)
);
