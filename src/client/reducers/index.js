import { combineReducers } from 'redux';
import searchBarFilterText from './searchBarFilterText';
import searchBarSuggestions from './searchBarSuggestions';
import searchBarResults from './searchBarResults';
import bookDetails from './bookDetails';
import categories from './categories';
import registration from './registration.reducer';
import authentication from './authentication.reducer';
import user from './user.reducer'

export default combineReducers({
  searchBarFilterText,
  searchBarSuggestions,
  searchBarResults,
  bookDetails,
  categories,
  registration,
  authentication,
  user
});
