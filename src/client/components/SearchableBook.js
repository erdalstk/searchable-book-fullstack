import React, { Component } from 'react';
import SearchBar from './SearchBar';
import BooksTable from './BooksTable';
import './SearchableBook.css';
import IndexGridView from './IndexGridView';
import { connect } from 'react-redux';

class SearchableBook extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let mainView;
    if (this.props.searchBarResults.length) {
      mainView = <BooksTable books={this.props.searchBarResults} />;
    } else {
      mainView = <IndexGridView />;
    }

    return (
      <div className="main-box">
        <div className="search-bar">
          <SearchBar />
        </div>
        <div className="main-view">{mainView}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  searchBarResults: state.searchBarResults
});

export default connect(mapStateToProps)(SearchableBook);
