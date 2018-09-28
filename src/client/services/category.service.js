import { apiAccessTokenHeader } from '../helpers';

function handleResponse(res) {
  return res.json().then((resJson) => {
    if (!resJson.result) {
      const error = resJson.message;
      return Promise.reject(error);
    }
    return resJson;
  });
}

function getAllCategories() {
  const requestOptions = {
    method: 'GET',
    headers: apiAccessTokenHeader()
  };
  return fetch('/api/categories', requestOptions).then(handleResponse);
}

function getBooksInCategory(categoryId) {
  const requestOptions = {
    method: 'GET',
    headers: apiAccessTokenHeader()
  };
  return fetch(`/api/categories/${categoryId}`, requestOptions).then(handleResponse);
}

const categoryService = {
  getAllCategories,
  getBooksInCategory
};

export default categoryService;
