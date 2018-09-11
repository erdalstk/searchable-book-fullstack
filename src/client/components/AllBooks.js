import React, { Component } from 'react';
import BooksTable from './BooksTable';
import { connect } from 'react-redux';
import { fetchSearchBarResultsCompleted } from '../actions';
import 'whatwg-fetch'; 
class AllBooks extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    fetch('/api/books')
      .then(res => res.json())
      .then(books => this.props.dispatch(fetchSearchBarResultsCompleted(books)));
  }

  render() {
    return <BooksTable books={this.props.searchBarResults} />;
  }
}

const mapStateToProps = state => ({
  searchBarResults: state.searchBarResults
});

export default connect(mapStateToProps)(AllBooks);
