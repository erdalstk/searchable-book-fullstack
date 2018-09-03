const bookDetails = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_BOOKDETAILS_COMPLETED':
      return action.bookDetails;
    default:
      return state;
  }
};

export default bookDetails;
