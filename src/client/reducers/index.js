import { combineReducers } from 'redux';
import searchBarFilterText from './searchBarFilterText';
import searchBarSuggestions from './searchBarSuggestions';
import searchBarResults from './searchBarResults';
import bookDetails from './bookDetails'

export default combineReducers({
  searchBarFilterText,
  searchBarSuggestions,
  searchBarResults,
  bookDetails
});
