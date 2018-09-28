const fetchCategoriesCompleted = categories => ({
  type: 'FETCH_CATEGORIES_COMPLETED',
  categories
});

const categoryActions = {
  fetchCategoriesCompleted
};

export default categoryActions;
