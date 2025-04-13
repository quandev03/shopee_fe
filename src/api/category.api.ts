import { ResponseSuccessType } from 'src/@types/utils.type';
import api from './api';

export const URL = '/product/get-list-category';

export const categoryApi = {
  getAll: () => {
    return api.get<ResponseSuccessType<any>>(URL);
  }
};
