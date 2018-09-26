import React, { Component } from 'react';
import Suggestions from 'src/client/components/presentational/Suggestions';
import './SearchBar.css';
import {
  changeSearchBarFilterText,
  fetchSearchBarSuggestionCompleted,
  fetchSearchBarResultsCompleted
} from 'src/client/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bookService } from 'src/client/services';
import 'whatwg-fetch';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleFilterTextSubmit = this.handleFilterTextSubmit.bind(this);
    this.handleFilterTextLostFocus = this.handleFilterTextLostFocus.bind(this);
  }

  handleFilterTextLostFocus(e) {
    var mainProps = this.props;
    clearTimeout(this.delayTimerBlur);
    this.delayTimerBlur = setTimeout(function() {
      mainProps.dispatch(fetchSearchBarSuggestionCompleted([]));
    }, 200);
  }

  handleFilterTextChange(e) {
    var mainProps = this.props;
    var filterText = e.target.value;
    mainProps.dispatch(changeSearchBarFilterText(filterText));
    if (!filterText.trim()) {
      return;
    }
    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(function() {
      bookService.instantSearch(filterText).then(
        res => {
          mainProps.dispatch(fetchSearchBarSuggestionCompleted(res.data.slice(0, 10)));
          return;
        },
        error => {
          return;
        }
      );
    }, 500);
  }

  handleFilterTextSubmit(e) {
    e.preventDefault();
    clearTimeout(this.delayTimer);
    if (!this.props.searchBarFilterText.trim()) {
      this.props.dispatch(fetchSearchBarResultsCompleted([]));
      return;
    }
    bookService.instantSearch(this.props.searchBarFilterText).then(
      res => {
        this.props.dispatch(fetchSearchBarResultsCompleted(res.data));
        this.props.history.push('/search');
        return;
      },
      error => {
        return;
      }
    );
  }

  render() {
    return (
      <div className="search-bar-container">
        <form className="search-form" onSubmit={this.handleFilterTextSubmit}>
          <div className="autocomplete">
            <input
              type="text"
              placeholder="Search book..."
              // ref={node => (this.input = node)}
              value={this.props.searchBarFilterText}
              onChange={this.handleFilterTextChange}
              onFocus={this.handleFilterTextChange}
              onBlur={this.handleFilterTextLostFocus}
            />
            <button type="submit">
              <i className="fa fa-search" />
            </button>
            <Suggestions />
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  searchBarFilterText: state.searchBarFilterText
});

export default connect(mapStateToProps)(withRouter(SearchBar));
