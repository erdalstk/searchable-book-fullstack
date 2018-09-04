const categories = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_CATEGORIES_COMPLETED':
      return action.categories;
    default:
      return state;
  }
};

export default categories;
