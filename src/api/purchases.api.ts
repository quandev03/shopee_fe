import { ProductCart, PurchaseListStatus, Purchases } from 'src/@types/purchases.type';
import { ResponseSuccessType } from 'src/@types/utils.type';
import api from './api';
import {BaseUrl} from "./base.url.ts";

const URL = '/cart-order';

export const purchasesApi = {
  getPurchases: () => {
    return api.get<ResponseSuccessType<CartItem>>(`${URL}/get-data-cart`);
  },
  addToCart: (body: ProductCart) => {
    return api.post<ResponseSuccessType<Purchases>>(`${URL}/add-product-in-cart?productId=${body.product_id}&quantity=${body.buy_count}`);
  },
  updatePurchases: (body: ProductCart) => {
    return api.put<ResponseSuccessType<Purchases>>(`${URL}/update-cart?productId=${body.product_id}&quantity=${body.buy_count}`);
  },
  deletePurchases: (cartId: string) => {
    console.error(cartId)
    return api.delete<any>(BaseUrl.CartUrl.getUrlRemoveCart(["cartId"], [cartId]));
  },
  buyProducts: (param: {cartId: string, addressUserId: string}) => {
    return api.post<ResponseSuccessType<Purchases[]>>(BaseUrl.CartUrl.getUrlCreateOrder(["cartId", "addressUserId"], [param.cartId, param.addressUserId]));
  },
  getPurchasesStatus :(status: number)=>{
    console.log(BaseUrl.CartUrl.getUrlOrderUser(["orderStatus"], [status]))
    return api.get<ResponseSuccessType<any>>(BaseUrl.CartUrl.getUrlOrderUser(["orderStatus"], [status]))
  }
};
