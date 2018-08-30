import React, { Component } from 'react';
import Suggestions from './Suggestions';
import './SearchBar.css';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleFilterTextSubmit = this.handleFilterTextSubmit.bind(this);
    this.handleSuggestionClick = this.handleSuggestionClick.bind(this);
  }

  handleFilterTextChange(e) {
    this.props.onFilterTextChange(e.target.value);
  }

  handleFilterTextSubmit(e) {
    this.props.onFilterTextSubmit(e);
  }

  handleSuggestionClick(rname) {
    this.props.onSuggestionClick(rname);
  }

  render() {
    return (
      <form className="search-bar" onSubmit={this.handleFilterTextSubmit}>
        <div className="autocomplete">
          <input
            type="text"
            placeholder="Search book..."
            value={this.props.filterText}
            onChange={this.handleFilterTextChange}
          />
          <Suggestions
            suggestions={this.props.suggestions}
            filterText={this.props.filterText}
            handleSuggestionClick={this.handleSuggestionClick}
          />
        </div>
        <input type="submit" />
      </form>
    );
  }
}