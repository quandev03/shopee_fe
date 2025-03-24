interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    nameProduct: string;
    description: string;
    price: number;
    quantity: number;
    soldQuantity: number;
    viewedQuantity: number;
    images: string | null;
    image: string;
    category: Category;
}

interface Pageable {
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
}

export interface Pagination {
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
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
}

export interface ProductResponseAPI {
    content: Product[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
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
}