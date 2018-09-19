import { authHeader, authHeaderJson, apiAccessTokenHeader, apiAccessTokenHeaderJson } from '../helpers';

export const userService = {
  login,
  logout,
  register,
  me,
  loginWithFacebook,
  changePassword,
  checkEmail,
  profile,
  admin_getAllUsers
};

function register(user) {
  const requestOptions = {
    method: 'POST',
    headers: apiAccessTokenHeaderJson(),
    body: JSON.stringify(user)
  };
  return fetch('api/auth/register', requestOptions).then(handleResponse);
}

function checkEmail(email) {
  const requestOptions = {
    method: 'GET',
    headers: apiAccessTokenHeaderJson()
  };
  return fetch(`/api/auth/checkemail?q=${email}`, requestOptions).then(handleResponse);
}

function login(user) {
  const requestOptions = {
    method: 'POST',
    headers: apiAccessTokenHeaderJson(),
    body: JSON.stringify(user)
  };
  return fetch('api/auth/login', requestOptions)
    .then(handleResponse)
    .then(res => {
      // login successful if there's a jwt token in the response
      if (res.result && res.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('token', res.token);
      }
      return res;
    });
}

function changePassword(user) {
  const requestOptions = {
    method: 'POST',
    headers: authHeaderJson(),
    body: JSON.stringify(user)
  };
  return fetch('api/auth/changepassword', requestOptions)
    .then(handleResponse)
    .then(res => {
      // login successful if there's a jwt token in the response
      if (res.result && res.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('token', res.token);
      }
      return res;
    });
}

function loginWithFacebook(user) {
  const requestOptions = {
    method: 'POST',
    headers: apiAccessTokenHeaderJson(),
    body: JSON.stringify(user)
  };
  return fetch('api/auth/facebook', requestOptions)
    .then(handleResponse)
    .then(res => {
      // login successful if there's a jwt token in the response
      if (res.result && res.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('token', res.token);
      }
      return res;
    });
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function me() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch('api/auth/me', requestOptions)
    .then(handleResponse)
    .then(res => {
      if (res.result && res.data) {
        localStorage.setItem('user', JSON.stringify(res.data));
      }
      return res;
    });
}

function profile(email) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`api/profile/${email}`, requestOptions).then(handleResponse);
}

function admin_getAllUsers() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`api/profile/all`, requestOptions).then(handleResponse);
}

function handleResponse(res) {
  if (res.status === 401) {
    // auto logout if 401 response returned from api
    logout();
  }
  return res.json().then(res => {
    if (!res.result) {
      const error = res.message;
      return Promise.reject(error);
    }
    return res;
  });
}
