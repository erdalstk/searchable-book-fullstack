import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BooksTable from './BooksTable';
import { fetchSearchBarResultsCompleted } from '../actions/index';
import 'whatwg-fetch';
import { isStringEmptyOrSpaces } from '../helpers';

class Category extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (isStringEmptyOrSpaces(this.props.match.params.id)) {
      return;
    }
    fetch('/api/categories/' + this.props.match.params.id)
      .then(res => res.json())
      .then(books => this.props.dispatch(fetchSearchBarResultsCompleted(books)))
      .catch(function() {});
  }

  componentDidUpdate(prevProps) {
    if (isStringEmptyOrSpaces(this.props.match.params.id)) {
      return;
    }
    if (this.props.match.params.id !== prevProps.match.params.id) {
      fetch('/api/categories/' + this.props.match.params.id)
        .then(res => res.json())
        .then(books => this.props.dispatch(fetchSearchBarResultsCompleted(books)))
        .catch(function() {});
    }
  }

  render() {
    return <BooksTable books={this.props.searchBarResults} />;
  }
}

const mapStateToProps = state => ({
  searchBarResults: state.searchBarResults
});

export default connect(mapStateToProps)(withRouter(Category));
