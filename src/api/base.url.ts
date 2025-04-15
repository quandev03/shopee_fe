import {ProductListConfig} from "../@types/product.type.ts";
import config from 'src/constants/config';
class Base {
    protected url = config.baseUrl;
    protected genUrl = (urlV2: string, path: string, paramField: string[], dataParam: any[]) =>{
        let urlFinal: string = this.url + urlV2 + path
        console.log(urlFinal)
        if(paramField.length !== 0 && paramField.length === dataParam.length) {
            const params: string[] = [];
            paramField.forEach((key: string, index: number) => {
                const value = dataParam[index];
                if (value !== null && value !== undefined) {
                    params.push(`${key}=${value}`);
                }
            });
            if (params.length > 0) {
                urlFinal += "?" + params.join("&");
            }
        }else if(paramField.length === dataParam.length){
            console.log("Loi set param")
        }
        return urlFinal;
    }
    protected genUrlNum = (urlV2: string, path: string, paramField: string[], dataParam: number[]) =>{
        let urlFinal: string = this.url + urlV2 + path
        console.log(urlFinal)
        if(paramField.length !== 0 && paramField.length === dataParam.length) {
            const params: string[] = [];
            paramField.forEach((key: string, index: number) => {
                const value = dataParam[index];
                if (value !== null && value !== undefined) {
                    params.push(`${key}=${value}`);
                }
            });
            if (params.length > 0) {
                urlFinal += "?" + params.join("&");
            }
        }else if(paramField.length === dataParam.length){
            console.log("Loi set param")
        }
        return urlFinal;
    }
}

class AuthUrl extends Base {
    private urlV2: string = "/auth"
    private login: string = "";
    private register: string = "";
    private infoMy: string = "/info-me"
    private update: string = "/update"
    private updateAvatart: string = "/update-avatar"
    private resetPassword: string = "/reset-password"
    public getUrlCreateOrder(field: string[] , param: string[]): string{
        return this.genUrl(this.urlV2, this.infoMy, field, param)
    }
    public getUrlUpdate(field: string[] , param: string[]): string{
        return this.genUrl(this.urlV2, this.update, field, param)
    }
    public getUrlUpdateAvatar(field: string[] , param: string[]): string{
        return this.genUrl(this.urlV2, this.updateAvatart, field, param)
    }
    public getUrlResetPassword(field: string[] , param: string[]): string{
        return this.genUrl(this.urlV2, this.resetPassword, field, param)
    }
}

class CartUrl extends Base{
    private urlV2: string = "/cart-order"
    private urlV2_voucher: string = "/api-admin-manager"
    private createOrder: string="/create-order"
    private removeCart: string = "/remove-cart"
    private getOrderUser: string = "/get-order-by-status"
    private getVoucher: string = "/get-list-voucher-can-apply"
    public getUrlCreateOrder(field: string[] , param: string[]): string{
        return this.genUrl(this.urlV2, this.createOrder, field, param)
    }
    public getUrlRemoveCart(field: string[] , param: string[]): string {
        return this.genUrl(this.urlV2, this.removeCart, field, param)
    }
    public getUrlOrderUser(field: string[] , param: number[]): string {
        return this.genUrlNum(this.urlV2, this.getOrderUser, field, param)
    }
    public getListVoucher(){
        return this.url +this.urlV2_voucher +  this.getVoucher
    }
}

class ProductUrl extends Base{
    private urlV2: string = "/product"
    private getList: string = "/get-list"
    public getUrlGetList(param: ProductListConfig){
        return this.genUrl(this.urlV2, this.getList, ['page', 'size', 'order', 'sorty', 'category', 'exclude', 'rating', 'priceMin', "priceMax", 'nameProduct'],
            [param.page, param.size, param.order, param.sorty, param.category, param.exclude, param.rating, param.priceMin, param.priceMax, param.nameProduct])
    }
}

class AddressUrl extends Base {
    private urlV2: string = "/address-manage"
    private getListProvince: string = "/get-list-province";
    private getNextAddressLevel: string = "/get-list-next-level"
    private addNewAddressUser: string = "/add-new-my-address"
    private getUserAddress: string = "/get-my-address"
    private updateAddressUser:string ="/update-my-address"
    private deleteMyAddress: string ="/delete-my-address"
    private addNewAddress: string = "/add-new-address"

    public getUrlGetListProvince(): string {
        console.log(this.url + this.getListProvince);
        return this.genUrl(this.urlV2, this.getListProvince, [], [])
    }
    public getUrlGetNextAddressLevel(field: string[], value: string[]):string{
        return this.genUrl(this.urlV2, this.getNextAddressLevel,field, value)
    }
    public getUrlAddNewAddressUser(): string{
        return this.genUrl(this.urlV2, this.addNewAddressUser, [], [])
    }
    public getUrlGetUserAddress(): string{
        return this.genUrl(this.urlV2, this.getUserAddress, [], [])
    }
    public getUrlUpdateAddressUser(field: string[], value: string[]): string{
        return this.genUrl(this.urlV2, this.updateAddressUser,field, value)
    }
    public getUrlDeleteAddressUser(field: string[], value: string[]): string{
        return this.genUrl(this.urlV2, this.deleteMyAddress,field, value)
    }
    public getUrlAddNewAddress(): string{
        return this.genUrl(this.urlV2, this.addNewAddress, [], [])
    }

}
class AdminManager extends Base{
    private urlV2: string = "/api-admin-manager"
    private urlV2_product: string = "/product"
    private urlV2_order: string = "/cart-order"
    private getDataDashBoard: string ="/get-data-dashboard"
    private createVoucher: string = "/create-new-voucher"
    private getAllVoucher: string = "/get-all-voucher"
    private getAllProduct: string = "/get-all-product-mode-admin"
    private getCategory:string = "/get-list-category"
    private createCategory:string = "/create-new-category"
    private createProduct: string = "/create"
    private uploadImage: string = "/upload-image"
    private getUser: string = "/get-all-user-for-admin"
    private decentralizationAdmin: string = "/decentralization-admin"
    private decentralizationUser: string = "/decentralization-user"
    private decentralizationCensorship: string = "/decentralization-censorship"
    private lockUnlockAccount: string = "/lock-unlock"
    private getOrderAdmin: string = "/get-order-admin"
    private getOrderDash: string = ""
    private changeStatusOrder: string = "/change-status-order"
    public getUrlGetDataDashBoard (){
        return this.url +this.urlV2 + this.getDataDashBoard
    }
    public getUrlCreateVoucher(){
        return this.url +this.urlV2 + this.createVoucher
    }
    public getUrlGetListVoucher(){
        return this.url +this.urlV2 + this.getAllVoucher
    }
    public getUrlGetAllProduct(){
        return this.url +this.urlV2 + this.getAllProduct
    }
    public getUrlGetCategory(){
        return this.url + this.urlV2_product + this.getCategory
    }
    public getUrlCreteCategory(){
        return this.url + this.urlV2_product + this.createCategory
    }
    public getUrlCreteProduct(){
        return this.url + this.urlV2_product + this.createProduct
    }
    public getUrlUploadImage(param: any[]){
        return this.genUrl(this.urlV2_product, this.uploadImage, ["isDefault", "productId"],param )
    }
    public getUrlGetUser(field: string[], value: any[]){
        return this.genUrl(this.urlV2, this.getUser, field, value)
    }
    public decentralization(rule: string, userId: string){
        let urlResponse: string = this.url + this.urlV2
        let urlV3
        if(rule == "user"){
            urlV3 = this.decentralizationUser
        }else if (rule == "admin") {
            urlV3 = this.decentralizationAdmin
        }else if(rule == "lock"){
            urlV3 = this.lockUnlockAccount
        }
        else {
            urlV3 = this.decentralizationCensorship
        }

        return `${urlResponse}${urlV3}?id=${userId}`
    }
    public getUrlOrderAdmin(field: string[], value: any[]){
        console.log(this.genUrl(this.urlV2, this.getOrderAdmin, field, value))
        return this.genUrl(this.urlV2, this.getOrderAdmin, field, value)
    }
    public getUrlOrderDash(){
        return this.url + this.urlV2 + this.getOrderDash
    }

    public getUrlChangeStatus(orderId: string, status: string){
        return this.url + this.urlV2_order + this.changeStatusOrder + `?orderStatus=${status}&orderId=${orderId}`
    }

}

export class BaseUrl {
    public static Address: AddressUrl;
    public static AuthUrl: AuthUrl;
    public static CartUrl: CartUrl;
    public static ProductUrl: ProductUrl;
    public static AdminManage: AdminManager

    // Phương thức khởi tạo các đối tượng tĩnh
    static initialize() {
        this.Address = new AddressUrl();
        this.AuthUrl = new AuthUrl();
        this.CartUrl = new CartUrl();
        this.ProductUrl = new ProductUrl();
        this.AdminManage = new AdminManager()
    }
}


// Khởi tạo các đối tượng tĩnh trong lớp BaseUrl
BaseUrl.initialize();

// Sau khi khởi tạo, bạn có thể gọi phương thức của AddressUrl
console.log(BaseUrl.Address.getUrlGetListProvince()); // Output: http://localhost:8080/address-manage/get-list-province