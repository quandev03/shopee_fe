import api from './api';
import {BaseUrl} from "./base.url.ts";
import {ResponseSuccessType} from "../@types/utils.type.ts";
import {DashboardResponse} from "../Responses/DashboardResponse.ts";
export const AdminManager = {
    getDashBoard:()=>{
        return api.get<ResponseSuccessType<DashboardResponse>>(BaseUrl.AdminManage.getUrlGetDataDashBoard())
    }
}