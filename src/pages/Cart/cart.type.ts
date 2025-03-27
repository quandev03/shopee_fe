interface ProductCategory {
    name: string;
    id: string;
}

interface CartProduct {
    id: string;
    nameProduct: string;
    description: string;
    price: number;
    availableQuantity: number;
    soldQuantity: number;
    viewedQuantity: number;
    images: string[] | null;
    image: string;
    category: ProductCategory;
    createdDate: string | null;
    rating: number;
}

interface CartItem {
    id: string;
    product: CartProduct;
    quantity: number;
    checked : boolean
}
interface AddressUserRequest {
    provincialAddress: string; // ID của Address (dạng UUID)
    districtId: string; // ID của Address district (dạng UUID)
    commercalAddress: string; // ID của Address commercal (dạng UUID)
    detailAddress: string; // Địa chỉ chi tiết
    isDefault: boolean; // Trạng thái mặc định (true/false)
    phone: string; // Số điện thoại
    fullName: string; // Tên đầy đủ
}
type CartResponse = CartItem[];