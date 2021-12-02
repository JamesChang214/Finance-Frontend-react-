import React, { Component } from 'react';
import { Search, Button } from 'semantic-ui-react';
import {
  escapeRegExp,
  filter,
  groupBy,
  compact,
  keyBy,
  union,
  omit,
  each
} from 'lodash';
import className from 'classnames';
import CustomAccordion from './CustomAccordion';

export default class CategoriesControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearching: false,
      searchValue: '',
      mappedCategories: [],
      allCategories: true,
      showToggle: props.showToggle ? true : false,
    };
  }

  componentDidMount() {
    const { categories } = this.props;
    this.updateCategories(categories);
  }

  componentDidUpdate(prevProps) {
    const { categories } = this.props;
    if (categories !== prevProps.categories) {
      this.updateCategories(categories);
    }
  }

  handleResultSelect = (e, { result }) => this.setState({ searchValue: result.title });

  handleSearchChange = (e, { value }) => {
    this.setState({ isSearching: true, searchValue: value });

    setTimeout(() => {
      const { searchValue } = this.state;
      const { categories } = this.props;
      if (searchValue.length < 1) return this.resetComponent();
      const re = new RegExp(escapeRegExp(searchValue), 'i');
      const isMatch = result => re.test(result.name);
      this.setState({
        isSearching: false
      });
      const result = filter(categories, isMatch);
      if (result.length > 0) return this.updateCategories(result);
      return result;
    }, 150);
  };

  updateCategories(categories) {
    const rawCategories = categories.filter(({ id }) => id != 1 && id != 888);
    const groupedByParents = groupBy(rawCategories, 'parent');
    const catsById = keyBy(rawCategories, 'id');

    const data = Object.values(
      each(omit(groupedByParents, ''), (childrens, parentId) => {
        if (catsById[parentId]) {
          catsById[parentId].subCategories = childrens;
        }
      })
    );

    each(catsById, (cat) => {
      cat.subCategories = compact(union(cat.subCategories));
    });
    this.setState({ mappedCategories: data[0] });
  }

  resetComponent = () => {
    const { categories } = this.props;
    this.updateCategories(categories);
    this.setState({ isSearching: false });
  };

  changeToggleState = (item) => {
    const { onSwitchToAll, onSwitchToFavourite } = this.props;
    this.setState({
      allCategories: item
    });
    if (item) {
      onSwitchToAll();
      // this.setState({ chosenCategories: this.props.chosenCategories });
    } else {
      onSwitchToFavourite();
      // this.setState({ chosenCategories: this.props.favoriteCategories });
    }
  };

  render() {
    const {
      showToggle,
      allCategories,
      isSearching,
      searchValue,
      mappedCategories,
    } = this.state;
    const {
      chosenCategories,
      addCategory,
      deleteCategory,
      superCategories,
      oneCategory
    } = this.props;
    return (
      <div className="categories-control">
        {showToggle && (
          <Button.Group className="toggle-group">
            <Button
              className={className('toggle-group-toggle left', {
                'toggle-group-toggle-current current-left':
                  allCategories === true
              })}
              onClick={() => this.changeToggleState(true)}
            >
              All
            </Button>
            <Button
              className={className('toggle-group-toggle right', {
                'toggle-group-toggle-current current-right':
                  allCategories === false
              })}
              onClick={() => this.changeToggleState(false)}
            >
              Favorite
            </Button>
          </Button.Group>
        )}
        <Search
          loading={isSearching}
          onResultSelect={this.handleResultSelect}
          onSearchChange={this.handleSearchChange}
          value={searchValue}
          showNoResults={false}
        />
        <CustomAccordion
          categories={mappedCategories}
          selectedId={chosenCategories.map(item => parseInt(item.id))}
          onChecked={addCategory}
          onUnchecked={deleteCategory}
          superCategories={superCategories}
          oneCategory={oneCategory ? oneCategory : false}
          withCheckbox
        />
      </div>
    );
  }
}
