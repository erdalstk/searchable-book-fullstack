import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import './Suggestions.css';
import { connect } from 'react-redux';
import { changeSearchBarFilterText } from '../actions';
import sanitizeHtml from 'sanitize-html';

function boldString(str, find) {
  var re = new RegExp(find, 'g');
  return str.replace(re, '<b>' + find + '</b>');
}

class Suggestions extends React.Component {
  constructor(props) {
    super(props);
    this.handleSuggestionClick = this.handleSuggestionClick.bind(this);
  }

  handleSuggestionClick = id => event => {
    this.props.dispatch(changeSearchBarFilterText(''));
    this.props.history.push('/books/' + id);
  };

  render() {
    // const options = this.props.searchBarSuggestions;
    if (!this.props.searchBarSuggestions.length) return '';
    // const clean = sanitizeHtml(book.description);
    const options = this.props.searchBarSuggestions.map(r => (
      <div
        key={r.id}
        onClick={this.handleSuggestionClick(r.id)}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(boldString(r.name, 'a')) }}
      />
    ));
    return (
      <div className="autocomplete-items" id="myInputautocomplete-list">
        {options}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  searchBarSuggestions: state.searchBarSuggestions
});

export default connect(mapStateToProps)(withRouter(Suggestions));
