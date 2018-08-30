import React from 'react';
import './suggestions.css';

// TODO
function boldString(str, find) {
  var re = new RegExp(find, 'g');
  return str.replace(re, '<Strong>' + find + '</Strong>');
}

export default class Suggestions extends React.Component {
  constructor(props) {
    super(props);
    this.handleSuggestionClick = this.handleSuggestionClick.bind(this);
  }

  handleSuggestionClick = rname => event => {
    this.props.handleSuggestionClick(rname);
  }

  render() {
    const options = this.props.suggestions.map(r => (
      <div key={r.id} onClick={this.handleSuggestionClick(r.name)}>
        {/* {boldString(r.name, this.props.filterText)} */}
        {r.name}
      </div>
    ));
    return (
      <div className="autocomplete-items" id="myInputautocomplete-list">
        {options}
      </div>
    );
  }
  
  
};

