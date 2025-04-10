import axios, { AxiosError, AxiosInstance, HttpStatusCode, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import config from 'src/constants/config';
import { RefreshTokenResponse } from 'src/@types/auth.type';
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS
} from 'src/utils/auth';
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from './auth.api';
import { isAxiosErrorUnauthorized, isExpiredTokenError } from 'src/utils/utils';
import { ResponseErrorType } from 'src/@types/utils.type';
import { accessToken } from "../msw/auth.msw.ts";
import * as jwt_decode from "jwt-decode";
import { User } from "../@types/user.type.ts";

type Role = 'Admin' | 'User';
interface JwtPayload {
  exp: number;
  iat: number;
  [key: string]: any;  // Các trường khác trong token
}

// Hàm kiểm tra xem token đã hết hạn chưa
function isTokenExpired(token: string): boolean {
  try {
    const decoded: JwtPayload = jwt_decode.jwtDecode(token);
    console.log(decoded)
    const currentTime = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại tính bằng giây

    // Kiểm tra nếu thời gian hết hạn < thời gian hiện tại
    return decoded.exp < currentTime;
  } catch (error) {
    // Nếu giải mã không thành công (token không hợp lệ)
    console.error("Invalid token", error);
    return true;
  }
}
export class Http {
  instance: AxiosInstance;
  private accessToken: string;
  private refreshToken: string;
  private refreshTokenRequest: Promise<string> | null;

  private mapBackendRoleToFrontend = (backendRoles: string | string[]): Role[] => {
    if (typeof backendRoles === 'string') {
      return backendRoles === 'ROLE_ADMIN' ? ['Admin'] : ['User'];
    }
    return backendRoles.map((role) => {
      if (role === 'ROLE_ADMIN') return 'Admin';
      if (role === 'ROLE_USER') return 'User';
      return role as Role;
    });
  };

  constructor() {
    this.accessToken = getAccessTokenFromLS();
    this.refreshToken = getRefreshTokenFromLS();
    this.refreshTokenRequest = null;
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 5,
        'expire-refresh-token': 60 * 60,
      },
    });

    this.instance.interceptors.request.use(
        (config) => {

          const noAuthRequired = config.url?.includes('/login') ||
              config.url?.includes('/register') ||
              config.url?.includes('get-list') ||
              config.url?.includes('dataProduct') ||
              config.url?.includes('/refresh-token')
          ;

          if (this.accessToken && config.headers && !noAuthRequired) {
            config.headers.Authorization = `Bearer ${this.accessToken}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
        (response) => {
          const { url } = response.config;

          if (url === URL_LOGIN || url === URL_REGISTER) {
            const result = response.data;
            let access: string = result.accessToken;
            let refresh: string = result.refreshToken;
            let user: User = {
              roles: this.mapBackendRoleToFrontend(result.roles),
              _id: result.id,
              username: result.username,
              name: result.username,
              avatar: result.avatar,
              createdAt: "string",
              updatedAt: "",
            };
            this.accessToken = access;
            this.refreshToken = refresh;
            setAccessTokenToLS(access);
            setRefreshTokenToLS(refresh);
            setProfileToLS(user);
          } else if (url === URL_LOGOUT) {
            this.accessToken = '';
            this.refreshToken = '';
            clearLS();
          }
          return response;
        },
        (error: AxiosError) => {
          if (![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)) {
            const data: any = error.response?.data;
            const message = data?.message || error.message;
            toast.error(message);
          console.log(message)
          }
          console.log(error)

          if (error.status==403 && !isTokenExpired(getRefreshTokenFromLS())) {
            const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig);
            const { url } = config;
            console.log(config)

            // Nếu token hết hạn, tiến hành refresh token
            if (url !== URL_REFRESH_TOKEN) {
              console.log('Refreshing token...');
              this.refreshTokenRequest = this.refreshTokenRequest
                  ? this.refreshTokenRequest
                  : this.handleRefreshToken()?.finally(() => {
                    // Đảm bảo chỉ gọi refreshTokenRequest một lần trong vòng 3 giây
                    setTimeout(() => {
                      this.refreshTokenRequest = null;
                    }, 3000);
                  });


              return this.refreshTokenRequest?.then((access_token) => {
                console.log('New access token:', access_token);
                if (config?.headers) {
                  return this.instance({
                    ...config,
                    headers: { ...config.headers, Authorization: `Bearer ${access_token}` },
                  });
                }
              });
            }

            // Nếu refresh token cũng hết hạn, xóa toàn bộ token
            // this.accessToken = '';
            // this.refreshToken = '';
            // clearLS();
            // toast.error(error.response?.data?.message || 'Session expired. Please log in again.');
          }

          return Promise.reject(error);
        }
    );
  }

  private handleRefreshToken() {
    console.log("Attempting to refresh token...");
    return this.instance
        .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, { refreshToken: this.refreshToken })
        .then((res:any) => {
          console.log(res)
          this.accessToken = res.data;
          setAccessTokenToLS(res.data);
          return res.data;
        })
        .catch(() => {
          clearLS();
          this.accessToken = '';
          this.refreshToken = '';
          throw new Error('Unable to refresh token');
        });
  }
}

const api = new Http().instance;

export default api;