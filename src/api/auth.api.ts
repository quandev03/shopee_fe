import { AuthResponse } from 'src/@types/auth.type';
import api from './api';

export const URL_LOGIN = '/login';
export const URL_REGISTER = '/register';
export const URL_LOGOUT = '/logout';
export const URL_REFRESH_TOKEN = '/refresh-access-token';

export const authApi = {
  registerAccount: (body: { email: string; password: string }) => {
    return api.post<AuthResponse>(URL_REGISTER, body);
  },

  loginAccount: (body: { email: string; password: string }) => {
    return api.post<AuthResponse>(URL_LOGIN, body);
  },

  logoutAccount: () => {
    return api.post(URL_LOGOUT);
  }
};
