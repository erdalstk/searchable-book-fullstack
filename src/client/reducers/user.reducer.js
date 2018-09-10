import { userConstants } from '../config';

const user = (state = {}, action) => {
  switch (action.type) {
    case userConstants.PROFILE_SUCCESS:
      return action.user;
    case userConstants.PROFILE_FAILURE:
      return state;
    default:
      return state;
  }
};

export default user;
