import { authHeader } from '../helpers';

export const userService = {
  login,
  logout,
  register,
  profile
};

function register(user) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  };

  return fetch('api/auth/register', requestOptions).then(handleResponse);
}

function login(user) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function profile() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch('api/auth/me', requestOptions)
    .then(handleResponse)
    .then(res => {
      if (res.result && res.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
      }
      return res;
    });
}

function handleResponse(res) {
  return res.json().then(res => {
    if (!res.result) {
      if (res.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        location.reload(true);
      }
      const error = res.message;
      return Promise.reject(error);
    }
    return res;
  });
}
