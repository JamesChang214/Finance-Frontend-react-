import React, { Component } from 'react';
import { Grid, Button, Input } from 'semantic-ui-react';
import className from 'classnames';
import { suggestedKeywords } from './suggestedKeywords';

export default class Seo extends Component {
  state = {
    choosenKeywords: [],
    currentKeyword: null
  };

  setKeyword = (item) => {
    const { choosenKeywords } = this.state;
    if (!choosenKeywords.find(el => item === el)) {
      this.setState({
        currentKeyword: item
      });
    }
  };

  chooseKeyword = () => {
    const { choosenKeywords, currentKeyword } = this.state;
    if (currentKeyword) {
      this.setState({
        choosenKeywords: [...choosenKeywords, currentKeyword],
        currentKeyword: null
      });
    }
  };

  deleteKeyword = (item) => {
    const { choosenKeywords } = this.state;
    this.setState({
      choosenKeywords: [...choosenKeywords.filter(el => el !== item)]
    });
  };

  render() {
    const { choosenKeywords, currentKeyword } = this.state;
    return (
      <Grid className="seo">
        <Grid.Row>
          <div className="seo-search">
            <div className="seo-search-icon">
              <i className="fal fa-search fa-lg" />
            </div>
            <Input placeholder="Search for suggetions" type="text" />
          </div>
        </Grid.Row>
        <Grid.Row className="seo-keywords-containers">
          <Grid.Column width={5}>
            <p className="seo-title-suggested">Suggested Keywords</p>
            <div className="seo-keywords-containers-suggested">
              {suggestedKeywords.map((item, index) => (
                <div
                  key={item.keyword}
                  role="button"
                  tabIndex={index}
                  onKeyDown={({ key }) => key === 'Enter' && this.setKeyword(item)
                  }
                  onClick={() => this.setKeyword(item)}
                  className={className('suggested-keyword', {
                    'current-keyword': currentKeyword === item,
                    'deleted-keyword': choosenKeywords.find(el => item === el)
                  })}
                >
                  {item.keyword}
                </div>
              ))}
            </div>
          </Grid.Column>
          <Grid.Column className="seo-arrow" width={1}>
            <Button
              icon
              className="seo-arrow-button"
              onClick={this.chooseKeyword}
            >
              <i className="fal fa-arrow-alt-right fa-lg" />
            </Button>
          </Grid.Column>
          <Grid.Column width={5}>
            <p className="seo-title-choosen">Choosen Keywords</p>
            <div className="seo-keywords-containers-choosen">
              {choosenKeywords.map((item, index) => (
                <div key={item.keyword} className="choosen-keyword">
                  {item.keyword}
                  <div
                    role="button"
                    tabIndex={index}
                    onKeyDown={({ key }) => key === 'Enter' && this.deleteKeyword(item)
                    }
                    onClick={() => this.deleteKeyword(item)}
                    className="choosen-keyword-trash"
                  >
                    <i className="far fa-trash-alt fa-lg" />
                  </div>
                </div>
              ))}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
