import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCategoriesCompleted } from 'src/client/actions';
import { Link, withRouter } from 'react-router-dom';
import { categoryService } from 'src/client/services';
import './AllCategories.css';
import 'whatwg-fetch';
import keyIndex from 'react-key-index';

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
        // toast(error, errorToastOptions);
        return;
      }
    );
  }

  render() {
    const categories = [];
    this.props.categories.map(c => {
      if (c.value === '') return;
      categories.push(
        <Link
          className="nav-link-toggle dropdown-item category"
          to={'/categories/' + c.value}
          key={c.id}
          onClick={this.props.onClick}>
          <i className="fa fa-tag fa-fw" />
          {c.value}
        </Link>
      );
    });
    return categories;
  }
}

const mapStateToProps = state => ({
  categories: keyIndex(state.categories, 1)
});

export default connect(mapStateToProps)(withRouter(AllCategories));
