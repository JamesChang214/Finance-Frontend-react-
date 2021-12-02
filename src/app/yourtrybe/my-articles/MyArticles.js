import React, { Component } from 'react';
import { Grid, Loader, Dropdown, Menu, Image } from 'semantic-ui-react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setPageForGoogleAnalytics } from '../../util/helperFunctions';
import Feed from '../../util/feed/Feed';
// import {getCurrentTheme} from '../../themes';

class MyArticles extends Component {
  state = {
    activeItem: 'publish',
    orderQuery: '',
    statusQuery: '&cache=false&status=publish'
  };

  componentDidMount() {
    setPageForGoogleAnalytics('your-trybe/my-articles');
    const status = new URLSearchParams(document.location.search).get('status');
    const { statusQuery } = this.state;
    if (status == 'publish' || status == 'pending' || status == 'bookmark' || status == 'draft') {
      this.setState({ activeItem: status, statusQuery: statusQuery.replace(/[^=]*$/, status) });
    }
  }

  handleOrderChange(value) {
    value === 'Most popular'
      ? this.setState({ orderQuery: '&orderby=token_score_average' })
      : this.setState({ orderQuery: '' });
  }

  handleItemClick = (e, { name }) => {
    const { statusQuery } = this.state;
    this.setState({
      activeItem: name,
      statusQuery: statusQuery.replace(/[^=]*$/, name)
    });
  };

  handleDraftClick = ({ id }) => {
    const { history } = this.props;
    history.push('/post/editor/edit/' + id);
  };

  render() {
    const { activeItem, orderQuery, statusQuery } = this.state;
    const { userIsLogged, userInfo } = this.props;
    const options = [
      { text: 'Newest', value: 'Newest' },
      { text: 'Most popular', value: 'Most popular' }
    ];
    return (
      <Grid className="my-articles-content cz-my-articles-content">
        <Grid.Column width="16" className="cz-tabs-newest">
          <Grid>
            <Grid.Row>
              <Grid.Column width="4">
                <div className="dropdown-container cz-newest-filter">
                  <Image src="/filters.svg" /> Filter:
                  <Dropdown
                    defaultValue={options[0].value}
                    options={options}
                    onChange={(ev, { value }) => this.handleOrderChange(value)
                    }
                    floating
                  />
                </div>
              </Grid.Column>
              <Grid.Column width="12">
                <Menu fluid widths={4} size="small" borderless>
                  <Menu.Item
                    name="publish"
                    active={activeItem === 'publish'}
                    onClick={this.handleItemClick}
                  >
                    <Image src="/plublish.svg"/>
                    <Image className="cz-publish-filter-icon" src="/plublish-active.svg"/>
                      Published
                  </Menu.Item>
                  <Menu.Item
                    name="pending"
                    active={activeItem === 'pending'}
                    onClick={this.handleItemClick}
                  >
                    <Image src="/inreiview.svg"/>
                    <Image className="cz-publish-filter-icon" src="/inreiview-active.svg"/>
                      In review
                  </Menu.Item>
                  <Menu.Item
                    name="bookmarks"
                    active={activeItem === 'bookmarks'}
                    onClick={this.handleItemClick}
                  >
                    <Image src="/bookmark.svg"/>
                    <Image className="cz-publish-filter-icon" src="/bookmark-active.svg"/>
                      Bookmarks
                  </Menu.Item>
                  <Menu.Item
                    name="draft"
                    active={activeItem === 'draft'}
                    onClick={this.handleItemClick}
                  >
                    <Image src="/draft.svg"/>
                    <Image className="cz-publish-filter-icon" src="/draft-active.svg"/>
                      Draft
                  </Menu.Item>
                </Menu>
                {/* <div className="filter">
                    <div className="option">Published</div>
                    <div className="option">Pending</div>
                    <div className="option">Draft</div>
                  </div> */}
              </Grid.Column>
              {/* <Grid.Column width="2">
                   <div className="post-preview-style-control">
                    <i className="fal fa-grip-lines" />
                    <i className="fal fa-th-large" />
                  </div>
                </Grid.Column> */}
            </Grid.Row>
          </Grid>
        </Grid.Column>
        <Grid.Column width="16">
          {userIsLogged ? (
            <Feed
              queryParams={
                `&author=${userInfo.id}&cache=false` + orderQuery + statusQuery
              }
              clickHandler={activeItem === 'draft' || activeItem === 'pending' ? this.handleDraftClick : null}
            />
          ) : (
            <Loader active />
          )}
        </Grid.Column>
      </Grid>
    );
  }
}
export default withCookies(
  withRouter(
    connect((state, ownProps) => ({
      userInfo: state.user.userInfo,
      userIsLogged: state.user.userIsLogged,
      cookies: ownProps.cookies
    }))(MyArticles)
  )
);
