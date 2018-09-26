import React, { Component } from 'react';
import CategoryList from '../../presentational/CategoryList';
import keyIndex from 'react-key-index';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { categoryService } from 'src/client/services';
import { fetchCategoriesCompleted } from 'src/client/actions';

class AllCategories extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    categoryService.getAllCategories().then(
      res => {
        this.props.dispatch(fetchCategoriesCompleted(res.data));
      },
      error => {
        return;
      }
    );
  }

  render() {
    return (
      <div>
        <h3>All categories</h3>
        <CategoryList categories={this.props.categories} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categories: keyIndex(state.categories, 1)
});

export default connect(mapStateToProps)(withRouter(AllCategories));
