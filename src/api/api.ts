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

type BackendRole = 'ROLE_ADMIN' | 'ROLE_USER';
type Role = 'Admin' | 'User';
const mapBackendRolesToFrontend = (backendRoles: BackendRole | BackendRole[]): Role[] => {
  const rolesArray = Array.isArray(backendRoles) ? backendRoles : [backendRoles];
  return rolesArray.map(role => role === 'ROLE_ADMIN' ? 'Admin' : 'User');
};

export class Http {
  instance: AxiosInstance;
  private accessToken: string;
  private refreshToken: string;
  private refreshTokenRequest: Promise<string> | null;
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
        'expire-refresh-token': 60 * 60
      }
    });

    this.instance.interceptors.request.use(
        (config) => {
          if (this.accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${this.accessToken}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
    );

    this.instance.interceptors.response.use(
        (response) => {
          const { url } = response.config;
          if (url === URL_LOGIN || url === URL_REGISTER) {
            const result = response.data;

            console.log( "data response: ", response.data)

            const { id, username, accessToken, refreshToken, roles, avatar } = response.data;
            console.log(username)
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            const formattedRoles: Role[] = mapBackendRolesToFrontend(roles);
            setAccessTokenToLS(accessToken);
            setRefreshTokenToLS(refreshToken);
            setProfileToLS({ id, username, roles: formattedRoles, avatar: avatar ?? undefined });
          } else if (url === URL_LOGOUT) {
            this.accessToken = '';
            this.refreshToken = '';
            clearLS();
          }
          return response;
        },
        (error: AxiosError) => {
          if (
              ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
          ) {
            const data: any = error.response?.data;
            const message = data?.message || error.message;
            toast.error(message);
          }

          if (isAxiosErrorUnauthorized<ResponseErrorType<{ name: string; message: string }>>(error)) {
            const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig);
            const { url } = config;
            if (isExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
              this.refreshTokenRequest = this.refreshTokenRequest
                  ? this.refreshTokenRequest
                  : this.handleRefreshToken()?.finally(() => {
                    setTimeout(() => {
                      this.refreshTokenRequest = null;
                    }, 3000);
                  });

              return this.refreshTokenRequest?.then((access_token) => {
                if (config?.headers) {
                  return this.instance({ ...config, headers: { ...config.headers, Authorization: `Bearer ${access_token}` } });
                }
              });
            }
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
          if (!res.data || !res.data.data || !res.data.data.access_token) {
            console.error('Invalid refresh token response:', res);
            return Promise.reject(new Error('Invalid refresh token response'));
          }
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