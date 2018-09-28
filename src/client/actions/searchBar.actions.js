const changeSearchBarFilterText = searchBarFilterText => ({
  type: 'CHANGE_SEARCHBAR_FILTERTEXT',
  searchBarFilterText
});

const fetchSearchBarSuggestionCompleted = searchBarSuggestions => ({
  type: 'FETCH_SEARCHBAR_SUGGESTIONS_COMPLETED',
  searchBarSuggestions
});

const fetchSearchBarResultsCompleted = searchBarResults => ({
  type: 'FETCH_SEARCHBAR_RESUTLS_COMPLETED',
  searchBarResults
});

const searchBarActions = {
  changeSearchBarFilterText,
  fetchSearchBarSuggestionCompleted,
  fetchSearchBarResultsCompleted
};

export default searchBarActions;
