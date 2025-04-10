import api from './api';
import {BaseUrl} from "./base.url.ts";
import {ResponseSuccessType} from "../@types/utils.type.ts";
import {DashboardResponse} from "../Responses/DashboardResponse.ts";
import {RequestCreateVoucherDTO} from "../Request/RequestCreateVoucher.type.ts";
import {VoucherResponse} from "../Responses/VoucherResponse.ts";
import {CategoryResponse, ProductResponse} from "../Responses/ProductResponse.type.ts";
import {CreateProductRequest} from "../Request/CreateProductRequest.type.ts";
import {ResponseOrder} from "../Responses/order.type.ts";
export const AdminManager = {
    getDashBoard:()=>{
        return api.get<ResponseSuccessType<DashboardResponse>>(BaseUrl.AdminManage.getUrlGetDataDashBoard())
    },
    createVoucher:(body: RequestCreateVoucherDTO)=>{
        return api.post<ResponseSuccessType<any>>(BaseUrl.AdminManage.getUrlCreateVoucher(), body)
    },
    getAllVoucher:()=>{
        return api.get<ResponseSuccessType<VoucherResponse>>(BaseUrl.AdminManage.getUrlGetListVoucher())
    },
    getAllProduct:()=>{
        return api.get<ResponseSuccessType<ProductResponse>>(BaseUrl.AdminManage.getUrlGetAllProduct())
    },
    getCategory:()=>{
        return api.get<ResponseSuccessType<CategoryResponse>>(BaseUrl.AdminManage.getUrlGetCategory())
    },
    createCategory:(body: {name: string})=> {
        return api.post(BaseUrl.AdminManage.getUrlCreteCategory(), body)
    },
    createProduct:(body: CreateProductRequest)=>{
        return api.post<ResponseSuccessType<ProductResponse>>(BaseUrl.AdminManage.getUrlCreteProduct(), body)
    },
    uploadProductImage: (file: File, productId: string, isDefault: boolean) => {
        const formData = new FormData();
        formData.append("file", file);
        return api.post<ResponseSuccessType<any>>(
            BaseUrl.AdminManage.getUrlUploadImage([isDefault, productId]),
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
    },
    getUserAdmin: (field: string[], value: any[])=>{
        return api.get<ResponseSuccessType<any>>(BaseUrl.AdminManage.getUrlGetUser(field, value))
    },
    decentralization: (rule: string, id: string)=>{
        return api.put<ResponseSuccessType<any>>(BaseUrl.AdminManage.decentralization(rule, id))
    },
    getOrderAdmin:(field: string[], value: any[]) =>{
        return api.get<ResponseSuccessType<ResponseOrder>>(BaseUrl.AdminManage.getUrlOrderAdmin(field, value))
    },
    getOrderDash:()=>{
        return api.get<ResponseSuccessType<any>>(BaseUrl.AdminManage.getUrlOrderDash())
    }


}