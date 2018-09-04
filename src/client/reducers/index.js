import { combineReducers } from 'redux';
import searchBarFilterText from './searchBarFilterText';
import searchBarSuggestions from './searchBarSuggestions';
import searchBarResults from './searchBarResults';
import bookDetails from './bookDetails';
import categories from './categories';

export default combineReducers({
  searchBarFilterText,
  searchBarSuggestions,
  searchBarResults,
  bookDetails,
  categories
});
