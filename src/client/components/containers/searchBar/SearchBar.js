import React, { Component } from 'react';
import Suggestions from 'src/client/components/presentational/Suggestions';
import './SearchBar.css';
import { searchBarActions } from 'src/client/actions';
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

  handleFilterTextLostFocus() {
    const mainProps = this.props;
    clearTimeout(this.delayTimerBlur);
    this.delayTimerBlur = setTimeout(() => {
      mainProps.dispatch(searchBarActions.fetchSearchBarSuggestionCompleted([]));
    }, 200);
  }

  handleFilterTextChange(e) {
    const mainProps = this.props;
    const filterText = e.target.value;
    mainProps.dispatch(searchBarActions.changeSearchBarFilterText(filterText));
    if (!filterText.trim()) {
      clearTimeout(this.delayTimer);
      mainProps.dispatch(searchBarActions.fetchSearchBarSuggestionCompleted([]));
      return;
    }
    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(() => {
      bookService.instantSearch(filterText).then((res) => {
        mainProps.dispatch(
          searchBarActions.fetchSearchBarSuggestionCompleted(res.data.slice(0, 10))
        );
      });
    }, 500);
  }

  handleFilterTextSubmit(e) {
    e.preventDefault();
    const mainProps = this.props;
    clearTimeout(this.delayTimer);
    mainProps.dispatch(searchBarActions.fetchSearchBarSuggestionCompleted([]));
    if (!mainProps.searchBarFilterText.trim()) {
      return;
    }
    bookService.instantSearch(mainProps.searchBarFilterText).then((res) => {
      mainProps.dispatch(searchBarActions.fetchSearchBarResultsCompleted(res.data));
      mainProps.history.push('/search');
    });
  }

  render() {
    const mainProps = this.props;
    return (
      <div className="search-bar-container">
        <form className="search-form" onSubmit={this.handleFilterTextSubmit}>
          <div className="autocomplete">
            <input
              type="text"
              placeholder="Search book..."
              value={mainProps.searchBarFilterText}
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
