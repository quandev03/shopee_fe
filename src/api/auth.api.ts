
import api from './api';

export const URL_LOGIN = '/auth/login';
export const URL_REGISTER = 'auth/register';
export const URL_LOGOUT = '/auth/logout';
export const URL_REFRESH_TOKEN = '/refresh-access-token';

export const authApi = {
  registerAccount: (body: { username: string; password: string, phoneNumber: string }) => {
    return api.post<any>(URL_REGISTER, body);
  },

  loginAccount: (body: { username: string; password: string }) => {
    return api.post<any>(URL_LOGIN, body);
  },

  logoutAccount: () => {
    return api.post(URL_LOGOUT);
  }
};
