import { userConstants } from '../config';

const registration = (state = { status: '', message: '' }, action) => {
  switch (action.type) {
    case userConstants.REGISTER_REQUEST:
      return { status: 'registering' };
    case userConstants.REGISTER_FAILURE:
      return { status: 'failed', message: action.error };
    case userConstants.REGISTER_SUCCESS:
      return { status: 'success' };
    default:
      return state;
  }
};

export default registration;
