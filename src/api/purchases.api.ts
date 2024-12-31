import { ProductCart, PurchaseListStatus, Purchases } from 'src/@types/purchases.type';
import { ResponseSuccessType } from 'src/@types/utils.type';
import api from './api';

const URL = '/purchases';

export const purchasesApi = {
  getPurchases: (params: { status: PurchaseListStatus }) => {
    return api.get<ResponseSuccessType<Purchases[]>>(URL, { params });
  },
  addToCart: (body: ProductCart) => {
    return api.post<ResponseSuccessType<Purchases>>(`${URL}/add-to-cart`, body);
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
