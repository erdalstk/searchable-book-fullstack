const bookDetails = (state = { result: false, book: {} }, action) => {
  switch (action.type) {
    case 'FETCH_BOOKDETAILS_COMPLETED':
      state.result = action.result;
      state.book = action.book;
      return state;
    default:
      return state;
  }
};

export default bookDetails;
