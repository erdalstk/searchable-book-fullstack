import React, { Component } from 'react';
import BooksTable from './BooksTable';
import SearchBar from './SearchBar';
import { connect } from 'react-redux';
import './BooksSearchResult.css';
import 'whatwg-fetch';

class BooksSearchResult extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const { searchBarResults } = this.props;
    let mainView = (
      <div className="search-hint">
        <p>Start searching book by typing something in searchbar!</p>
      </div>
    );
    if (searchBarResults && searchBarResults.length) {
      mainView = <BooksTable books={this.props.searchBarResults} />;
    }
    return (
      <div className="all-book-container">
        <div className="search-bar">
          <SearchBar />
        </div>
        <div className="table-view">{mainView}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  searchBarResults: state.searchBarResults
});

export default connect(mapStateToProps)(BooksSearchResult);
