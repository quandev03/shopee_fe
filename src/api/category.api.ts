import { ResponseSuccessType } from 'src/@types/utils.type';
import api from './api';
import { Category } from 'src/@types/category.type';

export const URL = 'product/get-list-category';

export const categoryApi = {
  getAll: () => {
    return api.get<ResponseSuccessType<Category[]>>(URL);
  }
};
