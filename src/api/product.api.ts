import { ProductType, ProductList, ProductListConfig } from 'src/@types/product.type';
import api from './api';
import { ResponseSuccessType } from 'src/@types/utils.type';

export const URL = '/product';

export const productApi = {
  getProductList: (params: ProductListConfig) => {
    return api.get<ResponseSuccessType<ProductList>>(URL+"/get-list", {});
  },

  getProduct: (id: string) => {
    return api.get<ResponseSuccessType<any>>(`${URL}/dataProduct?id=${id}`);
  }
};
