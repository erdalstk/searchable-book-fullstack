import { combineReducers } from 'redux';
import bookDetails from './bookDetails.reducer';
import categories from './categories.reducer';
import searchBarSuggestions from './searchBarSuggestions.reducer';
import searchBarFilterText from './searchBarFilterText.reducer';
import searchBarResults from './searchBarResults.reducer';
import registration from './registration.reducer';
import authentication from './authentication.reducer';
import user from './user.reducer';

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
