import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { propTypesHelper } from 'src/client/helpers';
import BooksTable from './BooksTable';
import './BooksSearchResult.css';

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

BooksSearchResult.defaultProps = {
  searchBarResults: []
};

BooksSearchResult.propTypes = {
  searchBarResults: PropTypes.arrayOf(propTypesHelper.Book)
};

export default connect(mapStateToProps)(BooksSearchResult);
