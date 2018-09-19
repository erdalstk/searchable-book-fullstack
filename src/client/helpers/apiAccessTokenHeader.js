import { API_ACCESS_TOKEN } from '../config';

export function apiAccessTokenHeader() {
  return { 'api-access-token': API_ACCESS_TOKEN };
}

export function apiAccessTokenHeaderJson() {
  return { 'api-access-token': API_ACCESS_TOKEN, 'Content-Type': 'application/json' };
}
