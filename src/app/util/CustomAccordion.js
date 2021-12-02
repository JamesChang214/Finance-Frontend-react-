import React, { Component, Fragment } from 'react';
import { Icon, Checkbox, Accordion } from 'semantic-ui-react';
import he from 'he';
import { isEqual } from 'lodash';

export default class CustomAccordion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCategoryIndex: [],
      selectedId: props.selectedId ? props.selectedId : []
    };
  }

  componentDidUpdate(prevProps) {
    const {selectedId} = this.props;
    if (!isEqual(selectedId.sort(), prevProps.selectedId.sort())) {
      this.selectId(selectedId);
    }
  }

  selectId = (id) => {
    this.setState({
      selectedId: id ? id : []
    });
  }

  renderCategories = (categories, categoryLevel, parentCategory) => {
    const { activeCategoryIndex } = this.state;
    const activeIndex = activeCategoryIndex[categoryLevel];
    const {withCheckbox} = this.props;

    return categories.map((category, index) => (
      <Fragment key={category.id}>
        <Accordion.Title
          active={activeIndex === index}
          index={index}
          onClick={() => category.subCategories && this.openCategory(index, categoryLevel)
          }
          className={`accordion-wrapper level-${categoryLevel}`}
        >
          <div className="accordion-text">
            {category.subCategories && category.subCategories[0] && (
              <Icon name="dropdown" />
            )}
          </div>
          {withCheckbox && (
            
            <Checkbox
              className="accordion-checkbox"
              label={he.decode(category.name)}
              checked={this.setCheckboxValue(category)}
              onChange={(ev, { checked }) => this.changeCheckboxValue(ev, checked, category, parentCategory)
              }
            />
          )}
        </Accordion.Title>
        <Accordion.Content active={activeIndex === index}>
          {category.subCategories
            && this.renderCategories(
              category.subCategories,
              categoryLevel + 1,
              category
            )}
        </Accordion.Content>
      </Fragment>
    ));
  };

  setCheckboxValue = (category) => {
    const {superCategories} = this.props;
    const { selectedId } = this.state;
    if (category.subCategories.length !== 0 && superCategories) {
      let isCategoryChecked = true;
      category.subCategories.forEach((item) => {
        if (!selectedId.includes(item.id)) {
          isCategoryChecked = false;
        }
      });
      return isCategoryChecked;
    }
    return selectedId.includes(category.id);
  };

  changeCheckboxValue = (ev, checked, category, parentCategory) => {
    const { selectedId } = this.state;
    const {onChecked, superCategories, oneCategory, onUnchecked} = this.props;
    ev.stopPropagation();
    console.log(ev);
    console.log(checked);
    console.log(category);
    console.log(parentCategory);
    if (checked) {
      onChecked(category);
      const subCategoriesArr = [];
      if (category.subCategories.length !== 0 && superCategories) {
        // category.subCategories.forEach((item) => {
        //   if (!selectedId.includes(item.id)) {
        //     subCategoriesArr.push(item.id);
        //     onChecked(item);
        //   }
        // });
        this._checkCategory(category);
      }
      oneCategory
        ? this.setState({ selectedId: [category.id] })
        : this.setState({
          selectedId: [
            ...selectedId,
            category.id,
            ...subCategoriesArr
          ]
        });
    } else {
      if (category.subCategories[0] && superCategories) {
        // let subCategoriesArr = selectedId;
        // category.subCategories.forEach((item) => {
        //   if (selectedId.includes(item.id)) {
        //     subCategoriesArr = subCategoriesArr.filter(id => item.id !== id);
        //     onUnchecked(item);
        //   }
        // });
        // subCategoriesArr = subCategoriesArr.filter(id => category.id !== id);
        // this.setState({
        //   selectedId: subCategoriesArr
        // });
        this._uncheckCategory(category);
      } else {
        this.setState({
          selectedId: selectedId.filter(id => category.id !== id)
        });
      }
      if (parentCategory) {
        onUnchecked(parentCategory);
      }
      onUnchecked(category);
    }
  };

  _checkCategory(category) {
    const { selectedId } = this.state;
    const {onChecked} = this.props;
    category.subCategories.forEach((item) => {
      if (!selectedId.includes(item.id)) {
        // subCategoriesArr.push(item.id);
        this._checkCategory(item);
      }
    });
    this.setState({
      selectedId: [
        ...selectedId,
        category.id,
      ]
    });
    onChecked(category);
  }

  _uncheckCategory(category) {
    // console.log('uncheck called');
    const { selectedId } = this.state;
    const {onUnchecked} = this.props;
    category.subCategories.forEach((item) => {
      if (selectedId.includes(item.id)) {
        const subCategoriesArr = selectedId.filter(id => category.id !== id);
        this.setState({
          selectedId: subCategoriesArr
        });
        this._uncheckCategory(item);
      }
    });
    onUnchecked(category);
  }

  openCategory = (index, categoryLevel) => {
    const { activeCategoryIndex } = this.state;
    const newActiveCategoryIndex = activeCategoryIndex;
    const newIndex = activeCategoryIndex[categoryLevel] === index ? -1 : index;
    newActiveCategoryIndex[categoryLevel] = newIndex;
    this.setState({
      activeCategoryIndex: newActiveCategoryIndex
    });
  };

  render() {
    const { categories} = this.props;
    return (
      <Accordion>{this.renderCategories(categories, 0)}</Accordion>
    );
  }
}
