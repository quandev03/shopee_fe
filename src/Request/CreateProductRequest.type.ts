export type CreateProductRequest = {
    nameProduct: string;
    description: string;
    price: number;
    quantity: number;
    soldQuantity: number;
    categoryId: string
};