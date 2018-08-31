import React, { Component } from 'react';
import SearchBar from './SearchBar';
import BooksTable from './BooksTable';
import './SearchableBook.css';

class SearchableBook extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleFilterTextSubmit = this.handleFilterTextSubmit.bind(this);
    this.handleSuggestionClick = this.handleSuggestionClick.bind(this);

    this.state = {
      filterText: '',
      suggestions: [],
      results: []
    };
  }

  handleFilterTextChange(filterText) {
    this.setState({
      filterText: filterText
    });
    fetch('/api/instantsearch?q=' + filterText)
      .then(res => res.json())
      .then(books => this.setState({ suggestions: books }));
  }

  handleFilterTextSubmit(event) {
    fetch('/api/instantsearch?q=' + this.state.filterText)
      .then(res => res.json())
      .then(books => this.setState({ results: books }));
    this.setState({ suggestions: [] });
    event.preventDefault();
  }

  handleSuggestionClick(rname) {
    this.setState({
      suggestions: [],
      filterText: rname
    });
  }

  render() {
    const state = this.state;

    let mainView;
    if (state.results.length) {
      mainView = <BooksTable results={state.results} />;
    } else {
      mainView = '';
    }

    return (
      <div className="main-box">
        <div className="search-bar center">
          <SearchBar
            filterText={this.state.filterText}
            onFilterTextChange={this.handleFilterTextChange}
            onFilterTextSubmit={this.handleFilterTextSubmit}
            onSuggestionClick={this.handleSuggestionClick}
            suggestions={this.state.suggestions}
          />
        </div>
        <div className="main-view">{mainView}</div>
      </div>
    );
  }
}

export default SearchableBook;
