const key = 'access_token';

export const AccessTokenService = {
  getToken() {
    return localStorage.getItem(key);
  },
  setToken(token: string) {
    return localStorage.setItem(key, token);
  },
  removeToken() {
    return localStorage.removeItem(key);
  },
};
