export type UserAdmin = {
    id: string;
    username: string;
    phoneNumber: string;
    roles: 'ROLE_USER' | 'ROLE_ADMIN'; // có thể mở rộng nếu có thêm role
    birthday: string; // định dạng: "dd/MM/yyyy"
    avatar: string;
    fullName: string | null;
    admin: boolean;
    active: boolean;
    lastLogin: string | null; // hoặc Date nếu muốn xử lý ngày giờ
};
export type DataRenderUser = {
    id: string;
    username: string;
    fullName: string;
    role: string;
    status: string;
    lastLogin: string;
    phone: string
}
export type DataFilterUser = {
    username: string,
    fullname: string,
    phone: string,
    locked: boolean
}