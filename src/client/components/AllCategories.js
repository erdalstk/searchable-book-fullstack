import React from 'react';
import { connect } from 'react-redux';
import { fetchCategoriesCompleted } from '../actions';
import { Link, withRouter } from 'react-router-dom';
import './AllCategories.css';

class AllCategories extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    fetch('/api/categories')
      .then(res => res.json())
      .then(categories => this.props.dispatch(fetchCategoriesCompleted(categories)));
  }

  render() {
    const categories = this.props.categories.map(c => (
      <Link className="dropdown-item category" to={'/categories/' + c} key={c}>
        <i className="fa fa-tag fa-fw" />
        {c}
      </Link>
    ));
    return categories;
  }
}

const mapStateToProps = state => ({
  categories: state.categories
});

export default connect(mapStateToProps)(withRouter(AllCategories));
