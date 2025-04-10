export type ProductCategory = {
    name: string;
    id: string;
};

export type ProductDTO = {
    id: string;
    nameProduct: string;
    description: string;
    price: number;
    quantity: number;
    soldQuantity: number;
    viewedQuantity: number;
    images: any; // Assuming images can be of any type
    image: string;
    category: ProductCategory;
    createDate: string | null;
    rating: number;
};

export type ProvincialAddress = {
    id: string;
    nameAddress: string;
    addressLevel: string;
    createdAt: string;
    updatedAt: string;
    hibernateLazyInitializer: object;
};

export type DistrictAddress = {
    id: string;
    nameAddress: string;
    addressLevel: string;
    createdAt: string;
    updatedAt: string;
    hibernateLazyInitializer: object;
};

export type CommercialAddress = {
    id: string;
    nameAddress: string;
    addressLevel: string;
    createdAt: string;
    updatedAt: string;
    hibernateLazyInitializer: object;
};

export type AddressUser = {
    id: string;
    createdAt: string;
    updatedAt: string;
    provincialAddress: ProvincialAddress;
    districtAddress: DistrictAddress;
    commercalAddress: CommercialAddress;
    specailAddress: any; // Assuming it can be null or any other type
    detailAddress: string;
    fullName: string;
    phone: string;
    defaultAddress: boolean;
};

export type Order = {
    orderId: string;
    productDTO: ProductDTO;
    quantity: number;
    addressUser: AddressUser;
    statusOrder: string;
    createTime: string;
    orderCode: string;
};

export type Pageable = {
    pageNumber: number;
    pageSize: number;
    sort: {
        empty: boolean;
        unsorted: boolean;
        sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
};

export type ResponseOrder = {
    content: Order[];
    pageable: Pageable;
    last: boolean;
    totalElements: number;
    totalPages: number;
    first: boolean;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        unsorted: boolean;
        sorted: boolean;
    };
    numberOfElements: number;
    empty: boolean;
};

export type OrderItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

export type OrderRender = {
    code:string
    id: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    total: number;
    status: string;
    items: OrderItem[];
    address: string;
    createdAt: string;
    paymentMethod: string;
    note: string;
};