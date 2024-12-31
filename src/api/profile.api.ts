import { ResponseSuccessType } from 'src/@types/utils.type';
import api from './api';
import { User } from 'src/@types/user.type';

export interface BodyDataProfile extends Omit<User, '_id' | 'roles' | 'email' | 'createdAt' | 'updatedAt'> {
  password?: string;
  new_password?: string;
}

export const userApi = {
  getProfile: () => {
    return api.get<ResponseSuccessType<User>>('/me');
  },
  updateProfile: (body: BodyDataProfile) => {
    return api.put<ResponseSuccessType<User>>('/user', body);
  },
  uploadAvatar: (body: FormData) => {
    return api.post<ResponseSuccessType<string>>('/user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};
