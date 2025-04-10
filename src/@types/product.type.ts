export interface ProductType {
  _id: string;
  images: string[];
  price: number;
  rating: number;
  price_before_discount: number;
  quantity: number;
  sold: number;
  view: number;
  description?: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductList {
  products: ProductType[];
  pagination: {
    page: number;
    limit: number;
    page_size: number;
  };
}

export interface ProductListConfig {
  page?: number | string;
  size?: number | string;
  order?: 'desc' | 'asc';
  sorty?: 'createdAt' | 'view' | 'sold' | 'price';
  category?: string | null;
  exclude?: string | null;
  rating?: number | null
  priceMax?: number | null;
  priceMin?: number | null ;
  nameProduct?: string | null;
}
export interface Category {
  id: string;
  name: string;
}

export interface ProductResponse {
  id: string;
  nameProduct: string;
  description: string;
  price: number;
  quantity: number;
  soldQuantity: number;
  viewedQuantity: number;
  images: string[] | null; // Nếu có nhiều hình ảnh, có thể là mảng; nếu không có, có thể là null
  image: string;
  category: Category;
  rating:number|null
}