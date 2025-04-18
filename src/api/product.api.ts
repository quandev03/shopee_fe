import { ProductType, ProductList, ProductListConfig } from 'src/@types/product.type';
import api from './api';
import { ResponseSuccessType } from 'src/@types/utils.type';
import {BaseUrl} from "./base.url.ts";

export const URL = '/product';

export const productApi = {
  getProductList: (params: ProductListConfig) => {
    let param: ProductListConfig = {
      page: params.page || 0,
      size: params.size || 10,
      order: params.order || 'desc',
      sorty: params.sorty || 'sold',
      category: params.category || null,
      exclude: params.exclude || null,
      rating: params.rating || null,
      priceMax: params.priceMax || null ,
      priceMin: params.priceMin || null ,
      nameProduct: params.name || null
    }
    return api.get<ResponseSuccessType<ProductList>>(BaseUrl.ProductUrl.getUrlGetList(param));
  },

  getProduct: (id: string) => {
    return api.get<ResponseSuccessType<any>>(`${URL}/dataProduct?id=${id}`);
  }
};
