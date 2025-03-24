import api from './api';
import {BaseUrl} from "./base.url.ts";
import {ResponseSuccessType} from "../@types/utils.type.ts";
import {AddressList} from "../Responses/address.type.ts";

export const AddressApi = {
    getListProvince :() =>{
        return api.get<ResponseSuccessType<AddressList>>(BaseUrl.Address.getUrlGetListProvince())
    },
    getNextAddressLevel:(nextLevelId: string)=>{
        return api.get<ResponseSuccessType<AddressList>>(BaseUrl.Address.getUrlGetNextAddressLevel(["beforeLevel"], [nextLevelId]))
    },
    addNewAddressUser: (body:AddressUserRequest)=>{
        return api.post<ResponseSuccessType<any>>(BaseUrl.Address.getUrlAddNewAddressUser(), body)
    },
    getUserAddress:()=>{
        return api.get<ResponseSuccessType<any>>(BaseUrl.Address.getUrlGetUserAddress())
    },
    updateAddressUser:(addressId: string, body:AddressUserRequest)=>{
        return api.put<ResponseSuccessType<any>>(BaseUrl.Address.getUrlUpdateAddressUser(["addressId"], [addressId]), body)
    },
    deleteAddressUser: (addressId: string)=>{
        return api.delete<ResponseSuccessType<any>>(BaseUrl.Address.getUrlDeleteAddressUser(["id"], [addressId]))
    }

}