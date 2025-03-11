import api from './api';
import {ProductListConfig, ProductList, ProductType} from 'src/@types/product.type';

export const productApi = {
  // API để lấy danh sách sản phẩm
  getProductList: (queryConfig: ProductListConfig) => {
    return api.get<ProductList>('/product/get-list', {
    });
  },

  // API để lấy chi tiết sản phẩm
  getProduct: (id: string) => {
    return api.get<ProductType>(`/product/dataProduct?id=${id}`);
  }
};
