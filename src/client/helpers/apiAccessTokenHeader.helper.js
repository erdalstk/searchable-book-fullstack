import { apiAccessToken } from '../config';

export function apiAccessTokenHeader() {
  return { 'api-access-token': apiAccessToken.WEB_APP_API_ACCESS_TOKEN };
}

export function apiAccessTokenHeaderJson() {
  return {
    'api-access-token': apiAccessToken.WEB_APP_API_ACCESS_TOKEN,
    'Content-Type': 'application/json'
  };
}
