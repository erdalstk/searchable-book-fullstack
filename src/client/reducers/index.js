import { combineReducers } from 'redux';
import searchBarFilterText from 'src/client/reducers/searchBarFilterText.reducer';
import searchBarSuggestions from 'src/client/reducers/searchBarSuggestions.reducer';
import bookDetails from 'src/client/reducers/bookDetails.reducer';
import categories from 'src/client/reducers/categories.reducer';
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
