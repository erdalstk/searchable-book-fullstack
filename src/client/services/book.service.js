import { authHeader, authHeaderJson, apiAccessTokenHeader } from '../helpers';

function handleResponse(res) {
  return res.json().then((resJson) => {
    if (!resJson.result) {
      const error = resJson.message;
      return Promise.reject(error);
    }
    return resJson;
  });
}

function instantSearch(filterText) {
  const requestOptions = {
    method: 'GET',
    headers: apiAccessTokenHeader()
  };
  return fetch(`/api/instantsearch?q=${filterText}`, requestOptions).then(handleResponse);
}

function getBookDetails(id) {
  const requestOptions = {
    method: 'GET',
    headers: apiAccessTokenHeader()
  };
  return fetch(`/api/books/${id}`, requestOptions).then(handleResponse);
}

function getMostDownload(limit) {
  const requestOptions = {
    method: 'GET',
    headers: apiAccessTokenHeader()
  };
  return fetch(`api/mostdownload?limit=${limit}`, requestOptions).then(handleResponse);
}

function getMostView(limit) {
  const requestOptions = {
    method: 'GET',
    headers: apiAccessTokenHeader()
  };
  return fetch(`api/mostview?limit=${limit}`, requestOptions).then(handleResponse);
}

function getRecentlyAdded(limit) {
  const requestOptions = {
    method: 'GET',
    headers: apiAccessTokenHeader()
  };
  return fetch(`api/recentlyadded?limit=${limit}`, requestOptions).then(handleResponse);
}

function getDownloadLink(bookId, type) {
  const requestOptions = {
    method: 'GET',
    headers: apiAccessTokenHeader()
  };
  return fetch(`api/downloadebook/${bookId}/${type}`, requestOptions).then(handleResponse);
}

function uploadBook(data) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: data
  };
  return fetch('/api/books', requestOptions).then(handleResponse);
}

function getUploadedBy(email) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`api/books/${email}/uploaded`, requestOptions).then(handleResponse);
}

function adminGetAllBooks() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch('api/admin/books', requestOptions).then(handleResponse);
}

function adminUpdateBooks(books) {
  const requestOptions = {
    method: 'POST',
    headers: authHeaderJson(),
    body: JSON.stringify({ data: books })
  };
  return fetch('api/admin/books/update', requestOptions).then(handleResponse);
}

const bookServices = {
  instantSearch,
  getMostDownload,
  getMostView,
  getRecentlyAdded,
  getDownloadLink,
  getBookDetails,
  uploadBook,
  getUploadedBy,
  adminGetAllBooks,
  adminUpdateBooks
};

export default bookServices;
