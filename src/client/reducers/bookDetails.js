const bookDetails = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_BOOKDETAILS_COMPLETED':
      return action.book;
    default:
      return state;
  }
};

export default bookDetails;
