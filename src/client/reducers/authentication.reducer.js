import { userConstants } from '../config';

const authentication = (state = { status: '', message: '' }, action) => {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return { status: 'processing' };
    case userConstants.LOGIN_FAILURE:
      return { status: 'failed', message: action.error };
    case userConstants.LOGIN_SUCCESS:
      return { status: 'success' };
    case userConstants.LOGOUT:
      return { status: 'loggedout' };
    default:
      return state;
  }
};

export default authentication;
