import { Product } from './product.type';

export type PurchaseStatus = -1 | 1 | 2 | 3 | 4 | 5;

export type PurchaseListStatus = 0 | PurchaseStatus;

export type ProductCart = {
  product_id: string;
  buy_count: number;
};

export interface Purchases {
  _id: string;
  buy_count: number;
  price: number;
  price_before_discount: number;
  status: PurchaseStatus;
  user: string;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface ExtendsPurchases extends Purchases {
  checked: boolean;
  disabled: boolean;
}
