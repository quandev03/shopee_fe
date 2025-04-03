class Base {
    protected url = "http://localhost:8080";
    protected genUrl = (urlV2: string, path: string, paramField: string[], dataParam: string[]) =>{
        let urlFinal: string = this.url + urlV2 + path
        console.log(urlFinal)
        let param: string = "?"
        if(paramField.length !==0 && paramField.length === dataParam.length) {
            paramField.forEach((value:string ,index: number) =>{
                param += `${value}=${dataParam[index]}`
                if(index!==paramField.length-1){
                    param +="&"
                }
            })
            urlFinal += param
        }else if(paramField.length === dataParam.length){
            console.log("Loi set param")
        }
        return urlFinal;
    }
    protected genUrlNum = (urlV2: string, path: string, paramField: string[], dataParam: number[]) =>{
        let urlFinal: string = this.url + urlV2 + path
        console.log(urlFinal)
        let param: string = "?"
        if(paramField.length !==0 && paramField.length === dataParam.length) {
            paramField.forEach((value:string ,index: number) =>{
                param += `${value}=${dataParam[index]}`
                if(index!==paramField.length-1){
                    param +="&"
                }
            })
            urlFinal += param
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
    private createOrder: string="/create-order"
    private removeCart: string = "/remove-cart"
    private getOrderUser: string = "/get-order-by-status"
    public getUrlCreateOrder(field: string[] , param: string[]): string{
        return this.genUrl(this.urlV2, this.createOrder, field, param)
    }
    public getUrlRemoveCart(field: string[] , param: string[]): string {
        return this.genUrl(this.urlV2, this.removeCart, field, param)
    }
    public getUrlOrderUser(field: string[] , param: number[]): string {
        return this.genUrlNum(this.urlV2, this.getOrderUser, field, param)
    }
}

class ProductUrl {}

class AddressUrl extends Base {
    private urlV2: string = "/address-manage"
    private getListProvince: string = "/get-list-province";
    private getNextAddressLevel: string = "/get-list-next-level"
    private addNewAddressUser: string = "/add-new-my-address"
    private getUserAddress: string = "/get-my-address"
    private updateAddressUser:string ="/update-my-address"
    private deleteMyAddress: string ="/delete-my-address"

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

}
class AdminManager extends Base{
    private urlV2: string = "/api-admin-manager"
    private getDataDashBoard: string ="/get-data-dashboard"
    public getUrlGetDataDashBoard (){
        return this.url +this.urlV2 + this.getDataDashBoard
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