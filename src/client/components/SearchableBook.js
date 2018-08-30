import React, { Component } from 'react';
import SearchBar from './SearchBar'
import BooksTable from './BooksTable'


export default class SearchableBook extends React.Component {
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
      filterText: rname,
    });
  }

  render() {
    const state = this.state;
    // const results = [];

    let resultView;
    if (state.results.length) {
      resultView = <BooksTable results={state.results} />;
    } else {
      if (state.filterText.length) {
        resultView = 'No result!';
      } else {
        resultView = 'Start search by input book name';
      }
    }

    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          onFilterTextChange={this.handleFilterTextChange}
          onFilterTextSubmit={this.handleFilterTextSubmit}
          onSuggestionClick={this.handleSuggestionClick}
          suggestions={this.state.suggestions}
        />

        {resultView}
      </div>
    );
  }
}
