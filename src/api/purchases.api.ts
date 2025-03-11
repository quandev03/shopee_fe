import { ProductCart, PurchaseListStatus, Purchases } from 'src/@types/purchases.type';
import { ResponseSuccessType } from 'src/@types/utils.type';
import api from './api';

const URL = '/cart-order';

export const purchasesApi = {
  getPurchases: (params: { status: PurchaseListStatus }) => {
    return api.get<ResponseSuccessType<any[]>>(URL + "/get-data-cart");
  },
  addToCart: (body: ProductCart) => {
    return api.post<ResponseSuccessType<Purchases>>(`${URL}/add-product-in-cart?productId=${body.product_id}&quantity=${body.buy_count}`);
  },
  updatePurchases: (body: ProductCart) => {
    return api.put<ResponseSuccessType<Purchases>>(`${URL}/update-purchase`, body);
  },
  deletePurchases: (purchaseIds: string[]) => {
    return api.delete<ResponseSuccessType<{ deleted_count: number }>>(URL, {
      data: purchaseIds
    });
  },
  buyProducts: (body: ProductCart[]) => {
    return api.post<ResponseSuccessType<Purchases[]>>(`${URL}/buy-products`, body);
  }
};
