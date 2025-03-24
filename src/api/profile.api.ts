import { ResponseSuccessType } from 'src/@types/utils.type';
import api from './api';
import { User } from 'src/@types/user.type';
import {BaseUrl} from "./base.url.ts";

export interface BodyDataProfile extends Omit<User, '_id' | 'roles' | 'username' | 'createdAt' | 'updatedAt'> {
  password?: string;
  new_password?: string;
}

export const userApi = {
  getProfile: () => {
    return api.get<ResponseSuccessType<User>>(BaseUrl.AuthUrl.getUrlCreateOrder([],[]));
  },
  updateProfile: (body: {phone: string, birthday: string}) => {
    return api.put<ResponseSuccessType<User>>( BaseUrl.AuthUrl.getUrlUpdate([], []), body);
  },
  uploadAvatar: (body: FormData) => {
    return api.put<ResponseSuccessType<string>>(BaseUrl.AuthUrl.getUrlUpdateAvatar([], []), body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

};
