import { apiAccessTokenHeader } from '../helpers';

export const categoryService = {
  getAllCategories,
  getBooksInCategory
};

function getAllCategories() {
  const requestOptions = {
    method: 'GET',
    headers: apiAccessTokenHeader()
  };
  return fetch(`/api/categories`, requestOptions).then(handleResponse);
}

function getBooksInCategory(categoryId) {
  const requestOptions = {
    method: 'GET',
    headers: apiAccessTokenHeader()
  };
  return fetch(`/api/categories/${categoryId}`, requestOptions).then(handleResponse);
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
