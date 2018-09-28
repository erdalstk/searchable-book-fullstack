const fetchBookDetailsCompleted = book => ({
  type: 'FETCH_BOOKDETAILS_COMPLETED',
  book
});

const bookActions = {
  fetchBookDetailsCompleted
};

export default bookActions;
