import { AuthResponse } from 'src/@types/auth.type';
import api from './api';
import {ResponseSuccessType} from "../@types/utils.type.ts";
import {BaseUrl} from "./base.url.ts";

export const URL_LOGIN = 'auth/login';
export const URL_REGISTER = 'auth/register';
export const URL_LOGOUT = '/logout';
export const URL_REFRESH_TOKEN = '/auth/refresh-token';
type FormData = {
  username:string,
  password: string,
  phoneNumber: string
};
export const authApi = {
  registerAccount: (body: FormData) => {
    return api.post<AuthResponse>(URL_REGISTER, body);
  },

  loginAccount: (body: { username: string; password: string }) => {
    return api.post<AuthResponse>(URL_LOGIN, body);
  },

  logoutAccount: () => {
    return api.post(URL_LOGOUT);
  },
  resetPassword: (body: {oldPassword: string, newPassword: string})=>{
    return api.put<ResponseSuccessType<any>>(BaseUrl.AuthUrl.getUrlResetPassword([], []), body)
  },
  getAccessToken: (body : {refreshToken: string})=>{
    return api.post<string>(URL_REFRESH_TOKEN, body)
}
};
