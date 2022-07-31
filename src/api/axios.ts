import axios from 'axios';
import dayjs from 'dayjs';
import jwt_decode from 'jwt-decode';
import { AccessTokenService } from '../services/AccessTokenService';
import { RefreshTokenService } from '../services/RefreshTokenService';

const baseURL = 'http://localhost:9000';

let accessToken = AccessTokenService.getToken();

export const publicInstance = axios.create({
  baseURL,
});

export const privateInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
});

privateInstance.interceptors.request.use(async (req) => {

  if (!accessToken) {
    accessToken = AccessTokenService.getToken();
    if (req.headers) req.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (accessToken) {
    const user: any = jwt_decode(accessToken);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) {
      if (req.headers) req.headers.Authorization = `Bearer ${accessToken}`;
      return req;
    }

    const response = await axios.post(
      `${baseURL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${RefreshTokenService.getToken()}`,
        },
      }
    );

    AccessTokenService.setToken(response.data.access_token.trim());

    if (req.headers)
      req.headers.Authorization = `Bearer ${response.data.access_token.trim()}`;
  }

  return req;
});
