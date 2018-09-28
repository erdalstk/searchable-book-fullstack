import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypesHelper } from 'src/client/helpers';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './Suggestions.css';

class Suggestions extends Component {
  constructor(props) {
    super(props);
    this.handleSuggestionClick = this.handleSuggestionClick.bind(this);
  }

  handleSuggestionClick = _id => () => {
    const { history } = this.props;
    history.push(`/books/${_id}`);
  };

  render() {
    const { searchBarSuggestions } = this.props;
    if (!searchBarSuggestions.length) return '';
    const options = searchBarSuggestions.map(r => (
      <div
        key={r._id}
        role="button"
        tabIndex={0}
        onClick={this.handleSuggestionClick(r._id)}
        onKeyPress={this.handleSuggestionClick(r._id)}
      >
        {r.name}
      </div>
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

Suggestions.defaultProps = {
  searchBarSuggestions: []
};

Suggestions.propTypes = {
  history: PropTypes.object, // eslint-disable-line
  searchBarSuggestions: PropTypes.arrayOf(propTypesHelper.Book)
};

export default connect(mapStateToProps)(withRouter(Suggestions));
