export type CategoryResponse = {
    id: string;
    name: string;
};

export type ProductResponse = {
    id: string;
    nameProduct: string;
    description: string;
    price: number;
    quantity: number;
    soldQuantity: number;
    viewedQuantity: number;
    images: string | null;
    image: string;
    category: CategoryResponse;
    createDate: string | null;
    rating: number;
};