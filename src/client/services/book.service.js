import { authHeader } from '../helpers';

export const bookService = {
  getMostDownload,
  getMostView,
  getRecentlyAdded,
  getDownloadLink
};

function getMostDownload(limit) {
  return fetch(`api/mostdownload?limit=${limit}`).then(handleResponse);
}

function getMostView(limit) {
  return fetch(`api/mostview?limit=${limit}`).then(handleResponse);
}

function getRecentlyAdded(limit) {
  return fetch(`api/recentlyadded?limit=${limit}`).then(handleResponse);
}

function getDownloadLink(bookId, type) {
  return fetch(`api/downloadebook/${bookId}/${type}`).then(handleResponse);
}

function handleResponse(res) {
  return res.json().then(res => {
    if (!res.result) {
      const error = res.message;
      return Promise.reject(error);
    }
    return res;
  });
}
