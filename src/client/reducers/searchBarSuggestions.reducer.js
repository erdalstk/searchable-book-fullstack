const searchBarSuggestions = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_SEARCHBAR_SUGGESTIONS_COMPLETED':
      return action.searchBarSuggestions;
    default:
      return state;
  }
};

export default searchBarSuggestions;
