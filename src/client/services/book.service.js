import { authHeader } from '../helpers';

export const bookService = {
  getDownloadLink
};

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
