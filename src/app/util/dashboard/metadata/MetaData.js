import React, { Component } from 'react';
import { Container, Loader } from 'semantic-ui-react';
import CategoriesControl from '../../CategoriesControl';

export default class MetaData extends Component {
  render() {
    const {
      addCategory,
      categories,
      deleteCategory,
      chosenCategories
    } = this.props;
    return (
      <Container className="meta-data">
        {categories[0] ? (
          <CategoriesControl
            className="categories-control"
            categories={categories}
            addCategory={addCategory}
            deleteCategory={deleteCategory}
            chosenCategories={chosenCategories}
            superCategories={false}
            showToggle={false}
            oneCategory
          />
        ) : (
          <Loader active />
        )}
      </Container>
    );
  }
}
