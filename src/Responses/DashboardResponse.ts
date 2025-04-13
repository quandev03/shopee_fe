export interface DashboardResponse {
    totalRevenue: number;
    totalOrders: number;
    totalUser: number;
    totalOrderPending:number;
    totalProducts: number;
    voucherCount: VoucherCount;
    productOutOfStockLong: Product[];
    recentOrders: Order[];
    revenue7DayRecent: RevenueResponse
}

export interface VoucherCount {
    sumVoucherActive: number;
    sumVoucherUsed: number;
}

export interface Product {
    id: string;
    nameProduct: string;
    description: string;
    price: number;
    quantity: number;
    soldQuantity: number;
    viewedQuantity: number;
    images: string[] | null;
    image: string;
    category: Category;
    createDate: string | null;
    rating: number;
}

export interface Category {
    name: string;
    id: string;
}

export interface Order {
    orderId: string;
    orderCode:string;
    productDTO: Product;
    quantity: number;
    addressUser: AddressUser;
    statusOrder: string,
    createTime: string
}

export interface AddressUser {
    id: string;
    createdAt: string;
    updatedAt: string;
    provincialAddress: Address;
    districtAddress: Address;
    commercalAddress: Address;
    specailAddress: string | null;
    detailAddress: string;
    fullName: string;
    phone: string;
    defaultAddress: boolean;
    hibernateLazyInitializer: any;
}

export interface Address {
    id: string;
    nameAddress: string;
    addressLevel: string;
    createdAt: string;
    updatedAt: string;
    hibernateLazyInitializer: any;
}
export type RevenueItem = {
    amount: number;
    date: string; // định dạng 'DD/MM/YYYY'
};

type RevenueResponse = {
    revenue7DayRecent: RevenueItem[];
};