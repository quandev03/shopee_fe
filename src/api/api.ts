import axios, { AxiosError, AxiosInstance, HttpStatusCode, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import config from 'src/constants/config';
import { AuthResponse, RefreshTokenResponse } from 'src/@types/auth.type';
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

export class Http {
  instance: AxiosInstance;
  private accessToken: string;
  private refreshToken: string;
  private refreshTokenRequest: Promise<string> | null;
  constructor() {
    this.accessToken = getAccessTokenFromLS(); //Khởi tạo 1 lần duy nhất và lưu access_token vào trong ram
    this.refreshToken = getRefreshTokenFromLS(); //Khởi tạo 1 lần duy nhất và lưu access_token vào trong ram
    this.refreshTokenRequest = null;
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 5, //5 giây
        'expire-refresh-token': 60 * 60 // 1 giờ
      }
    });

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = this.accessToken;
          /**
           * Lấy accessToken từ đối thượng HTTP tức là lấy dữ liệu từ RAM
           * Lấy accessToken từ localStorage tức là lấy dữ liệu từ ROM
           * ==> lấy từ RAM sẽ cho tốc độ tải dữ liệu nhanh hơn lấy từ ROM
           */
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        // console.log(response);
        const { url } = response.config;

        if (url === URL_LOGIN || url === URL_REGISTER) {
          const result = response.data as AuthResponse;

          const { access_token, user, refresh_token } = result.data;
          this.accessToken = access_token;
          this.refreshToken = refresh_token;
          setAccessTokenToLS(access_token);
          setRefreshTokenToLS(refresh_token);
          setProfileToLS(user);
        } else if (url === URL_LOGOUT) {
          this.accessToken = '';
          this.refreshToken = '';
          clearLS();
        }

        return response;
      },
      (error: AxiosError) => {
        //Chỉ toast những lỗi không liên quan 422 và 401
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          const data: any = error.response?.data;
          const message = data?.message || error.message;
          toast.error(message);
        }

        //Lỗi 401 có nhiều trường hợp
        // - trường hợp không truyền lên access_token
        // - trường hợp truyền lên access_token không đúng
        // - trường hợp refresh_token hết hạn
        // - trường hợp truyền lên access_token hết hạn ==> tiến hành xử lý refresh_token

        if (isAxiosErrorUnauthorized<ResponseErrorType<{ name: string; message: string }>>(error)) {
          const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig);

          const { url } = config;
          //Trường hợp token hết hạn và request truyền đi không phải là api gọi refresh token
          if (isExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken()?.finally(() => {
                  //Giữ refreshToken trong 3s tiếp theo để những request tiếp theo bị 401 thì vẫn dùng requestTokenRequest này
                  //Và số giây giữ phải nhỏ hơn thời gian hết hạn của refreshToken
                  setTimeout(() => {
                    this.refreshTokenRequest = null;
                  }, 3000);
                });

            return this.refreshTokenRequest?.then((access_token) => {
              if (config?.headers) {
                //Nghĩa là chúng ta tiếp tục gọi lại request củ vừa bị lỗi
                return this.instance({ ...config, headers: { ...config.headers, Authorization: access_token } });
              }
            });
          }

          //Còn những trường hợp như truyền sai token, token hết hạn và refreshToken cũng hết hạn thì toast message
          // Và xóa toàn bộ token trong http và LS
          this.accessToken = '';
          this.refreshToken = '';
          clearLS();
          toast.error(error.response?.data.data?.message || error.response?.data.message);
        }

        return Promise.reject(error);
      }
    );
  }

  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, { refresh_token: this.refreshToken })
      .then((res) => {
        const { access_token } = res.data.data;
        this.accessToken = access_token;
        setAccessTokenToLS(access_token);
        return access_token;
      })
      .catch(() => {
        clearLS();
        this.accessToken = '';
        this.refreshToken = '';
        throw new Error();
      });
  }
}

const api = new Http().instance;

export default api;
