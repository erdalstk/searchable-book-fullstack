import React, { Component } from 'react';
import Suggestions from './Suggestions';
import './SearchBar.css';
import {
  changeSearchBarFilterText,
  fetchSearchBarSuggestionCompleted,
  fetchSearchBarResultsCompleted
} from '../actions';
import { connect } from 'react-redux';
import 'whatwg-fetch';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleFilterTextSubmit = this.handleFilterTextSubmit.bind(this);
  }

  handleFilterTextChange(e) {
    var mainProps = this.props;
    var filterText = e.target.value;
    mainProps.dispatch(changeSearchBarFilterText(filterText));
    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(function() {
      fetch('/api/instantsearch?q=' + filterText)
        .then(res => res.json())
        .then(books => mainProps.dispatch(fetchSearchBarSuggestionCompleted(books.slice(0, 10))))
        .catch(function() {});
    }, 500);
  }

  handleFilterTextSubmit(e) {
    e.preventDefault();
    if (!this.input.value.trim()) {
      this.props.dispatch(fetchSearchBarResultsCompleted([]));
      return;
    }
    fetch('/api/instantsearch?q=' + this.props.searchBarFilterText)
      .then(res => res.json())
      .then(books => this.props.dispatch(fetchSearchBarResultsCompleted(books)))
      .catch(function() {});
  }

  render() {
    return (
      <form className="search-form" onSubmit={this.handleFilterTextSubmit}>
        <div className="autocomplete">
          <input
            type="text"
            placeholder="Search book..."
            ref={node => (this.input = node)}
            onChange={this.handleFilterTextChange}
          />
          <button type="submit">
            <i className="fa fa-search" />
          </button>
          <Suggestions />
        </div>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  searchBarFilterText: state.searchBarFilterText
});

export default connect(mapStateToProps)(SearchBar);
