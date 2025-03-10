export interface ProductType {
  priceBeforeDiscount: number;
  rating: number;
  id: string;
  nameProduct: string;
  description?: string;
  price: number;
  quantity: number;
  soldQuantity: number;
  viewedQuantity: number;
  images: string[]; // Nếu có nhiều hình ảnh, có thể là mảng
  image: string | null; // Nếu không có ảnh, có thể là null
  category?: {
    _id: string;
    name: string;
  };
}

export interface ProductList {
  pagination: any;
  data: any;
  content: ProductType[]; // Mảng các sản phẩm
  pageable: any; // Có thể thay bằng kiểu chính xác tùy thuộc vào cấu trúc API
  totalElements: number;
  totalPages: number;
  size: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ProductListConfig {
  page?: number | string;
  size?: number | string;
  order?: 'desc' | 'asc';
  sort_by?: 'createdAt' | 'view' | 'sold' | 'price';
  category?: string;
  exclude?: string;
  rating_filter?: number | string;
  price_max?: number | string;
  price_min?: number | string;
  name?: string;
}
