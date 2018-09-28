export function authHeader() {
  // return authorization header with jwt token
  const token = localStorage.getItem('token');
  if (token) {
    return { 'x-access-token': token };
  }
  return {};
}

export function authHeaderJson() {
  // return authorization header with jwt token
  const token = localStorage.getItem('token');
  if (token) {
    return { 'x-access-token': token, 'Content-Type': 'application/json' };
  }
  return {};
}
