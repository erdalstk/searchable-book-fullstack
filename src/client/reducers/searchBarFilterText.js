const searchBarFilterText = (state = '', action) => {
  switch (action.type) {
    case 'CHANGE_SEARCHBAR_FILTERTEXT':
      return action.searchBarFilterText;
    default:
      return state;
  }
};

export default searchBarFilterText;
