import api from './api';
import {ProductListConfig, ProductList, ProductType} from 'src/@types/product.type';

export const productApi = {
  // API để lấy danh sách sản phẩm
  getProductList: (queryConfig: ProductListConfig) => {
    return api.post<ProductList>('/products', queryConfig);
  },

  // API để lấy chi tiết sản phẩm
  getProduct: (id: string) => {
    return api.get<ProductType>(`/products/${id}`);
  }
};
