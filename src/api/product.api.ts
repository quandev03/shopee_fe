import { Product, ProductList, ProductListConfig } from 'src/@types/product.type';
import api from './api';
import { ResponseSuccessType } from 'src/@types/utils.type';

export const URL = '/products';

export const productApi = {
  getProductList: (params: ProductListConfig) => {
    return api.get<ResponseSuccessType<ProductList>>(URL, {
      params
    });
  },

  getProduct: (id: string) => {
    return api.get<ResponseSuccessType<Product>>(`${URL}/${id}`);
  }
};
