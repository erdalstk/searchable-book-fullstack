import React, { Component } from 'react';
import keyIndex from 'react-key-index';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { categoryService } from 'src/client/services';
import { categoryActions } from 'src/client/actions';
import CategoryList from '../../presentational/CategoryList';

class AllCategories extends Component {
  componentDidMount() {
    const mainProps = this.props;
    categoryService.getAllCategories().then((res) => {
      mainProps.dispatch(categoryActions.fetchCategoriesCompleted(res.data));
    });
  }

  render() {
    const mainProps = this.props;
    return (
      <div>
        <h3>All categories</h3>
        <CategoryList categories={mainProps.categories} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categories: keyIndex(state.categories, 1)
});

export default connect(mapStateToProps)(withRouter(AllCategories));
