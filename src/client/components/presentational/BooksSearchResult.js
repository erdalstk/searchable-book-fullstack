import React, { Component } from 'react';
import BooksTable from './BooksTable';
import { connect } from 'react-redux';
import './BooksSearchResult.css';
import 'whatwg-fetch';

const BooksSearchResult = ({ searchBarResults }) => {
  let mainView = (
    <div className="search-hint">
      <p>Start searching book by typing something in searchbar!</p>
    </div>
  );
  if (searchBarResults && searchBarResults.length) {
    mainView = <BooksTable books={searchBarResults} />;
  }
  return (
    <div className="all-book-container">
      <div className="table-view">{mainView}</div>
    </div>
  );
};

const mapStateToProps = state => ({
  searchBarResults: state.searchBarResults
});

export default connect(mapStateToProps)(BooksSearchResult);
