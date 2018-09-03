const searchBarResults = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_SEARCHBAR_RESUTLS_COMPLETED':
      return action.searchBarResults;
    default:
      return state;
  }
};

export default searchBarResults;
