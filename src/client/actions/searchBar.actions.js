export const changeSearchBarFilterText = searchBarFilterText => ({
  type: 'CHANGE_SEARCHBAR_FILTERTEXT',
  searchBarFilterText
});

export const fetchSearchBarSuggestionCompleted = searchBarSuggestions => ({
  type: 'FETCH_SEARCHBAR_SUGGESTIONS_COMPLETED',
  searchBarSuggestions
});

export const fetchSearchBarResultsCompleted = searchBarResults => ({
  type: 'FETCH_SEARCHBAR_RESUTLS_COMPLETED',
  searchBarResults
});

export const fetchBookDetailsCompleted = ({ result, book }) => ({
  type: 'FETCH_BOOKDETAILS_COMPLETED',
  result,
  book
});

export const fetchCategoriesCompleted = categories => ({
  type: 'FETCH_CATEGORIES_COMPLETED',
  categories
});
