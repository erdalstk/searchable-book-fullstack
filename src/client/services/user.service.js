import { authHeader, authHeaderJson, apiAccessTokenHeaderJson } from '../helpers';

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function handleResponse(res) {
  if (res.status === 401) {
    // auto logout if 401 response returned from api
    logout();
  }
  return res.json().then((resJson) => {
    if (!resJson.result) {
      const error = resJson.message;
      return Promise.reject(error);
    }
    return resJson;
  });
}

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
    .then((res) => {
      // login successful if there's a jwt token in the response
      if (res.result && res.token) {
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
    .then((res) => {
      // login successful if there's a jwt token in the response
      if (res.result && res.token) {
        localStorage.setItem('token', res.token);
      }
      return res;
    });
}

function forgotPassword(email) {
  const requestOptions = {
    method: 'POST',
    headers: apiAccessTokenHeaderJson(),
    body: JSON.stringify({ email })
  };
  return fetch('api/auth/resetpasswordrequest', requestOptions).then(handleResponse);
}

function resetPassword(user, token) {
  const requestOptions = {
    method: 'POST',
    headers: apiAccessTokenHeaderJson(),
    body: JSON.stringify(user)
  };
  return fetch(`api/auth/reset/${token}`, requestOptions).then(handleResponse);
}

function loginWithFacebook(user) {
  const requestOptions = {
    method: 'POST',
    headers: apiAccessTokenHeaderJson(),
    body: JSON.stringify(user)
  };
  return fetch('api/auth/facebook', requestOptions)
    .then(handleResponse)
    .then((res) => {
      // login successful if there's a jwt token in the response
      if (res.result && res.token) {
        localStorage.setItem('token', res.token);
      }
      return res;
    });
}

function me() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch('api/auth/me', requestOptions)
    .then(handleResponse)
    .then((res) => {
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

function updateProfile(data) {
  const requestOptions = {
    method: 'PUT',
    headers: authHeader(),
    body: data
  };
  return fetch('api/profile/me', requestOptions).then(handleResponse);
}

function adminGetAllUsers() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch('api/admin/users/', requestOptions).then(handleResponse);
}

function adminUpdateUsers(users) {
  const requestOptions = {
    method: 'POST',
    headers: authHeaderJson(),
    body: JSON.stringify({ data: users })
  };
  return fetch('api/admin/users/update', requestOptions).then(handleResponse);
}

const userService = {
  login,
  logout,
  register,
  me,
  loginWithFacebook,
  changePassword,
  forgotPassword,
  resetPassword,
  checkEmail,
  profile,
  updateProfile,
  adminGetAllUsers,
  adminUpdateUsers
};

export default userService;
