const key = 'refresh_token';

export const RefreshTokenService = {
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
