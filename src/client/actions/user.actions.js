import { userConstants } from '../config';

export const userActions = {
  loginRequesting,
  loginSuccess,
  loginFailure,
  registerRequesting,
  registerSuccess,
  registerFailure,
  profileSuccess,
  profileFailure,
  logout
};

function loginRequesting() {
  return { type: userConstants.LOGIN_REQUEST };
}
function loginSuccess() {
  return { type: userConstants.LOGIN_SUCCESS };
}
function loginFailure(error) {
  return { type: userConstants.LOGIN_FAILURE, error };
}

function registerRequesting() {
  return { type: userConstants.REGISTER_REQUEST };
}
function registerSuccess() {
  return { type: userConstants.REGISTER_SUCCESS };
}
function registerFailure(error) {
  return { type: userConstants.REGISTER_FAILURE, error };
}

function profileSuccess(user) {
  return { type: userConstants.PROFILE_SUCCESS, user };
}

function profileFailure() {
  return { type: userConstants.PROFILE_FAILURE };
}

function logout() {
  return { type: userConstants.LOGOUT };
}
