// Test độc lập file gọi api
// Tránh việc gọi đên các file liên quan
import { HttpStatusCode } from 'axios';
import { AuthResponse } from 'src/@types/auth.type';
import { Category } from 'src/@types/category.type';
import { Product, ProductList } from 'src/@types/product.type';
import { ResponseSuccessType } from 'src/@types/utils.type';
import { Http } from 'src/api/api';
import { URL_LOGIN } from 'src/api/auth.api';
import { URL as URL_Categories } from 'src/api/category.api';
import { URL as URL_Products } from 'src/api/product.api';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  clearLS,
  getAccessTokenFromLS,
  getProfileFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS
} from '../auth';
import { isAxiosError } from '../utils';
import { access_token_1s, refresh_token_1000days } from 'src/msw/auth.msw';

const validAccount = {
  email: 'sang5@gmail.com',
  password: '123123123'
};

const invalidAccount = {
  email: 'sang5@gmail.com',
  password: '123321321'
};

describe('Test call api without attach access token', () => {
  let http = new Http().instance;

  beforeEach(() => {
    clearLS();
    http = new Http().instance;
  });

  test('get list product successfully', async () => {
    const res = await http.get<ResponseSuccessType<ProductList>>(URL_Products);
    const { products } = res.data.data;
    expect(res.statusText).toBe('OK');
    expect(res.status).toEqual(HttpStatusCode.Ok);
    expect(Array.isArray(products)).toBeTruthy();
    expect(res.data.data.pagination).toBeTruthy();
  });

  test('get one product successfully', async () => {
    const res = await http.get<ResponseSuccessType<Product>>(`${URL_Products}/60afb2c76ef5b902180aacba`);
    expect(res.status).toBe(HttpStatusCode.Ok);
    expect(res.data.data).toBeTruthy();
  });

  test('get all categories successfully', async () => {
    const res = await http.get<ResponseSuccessType<Category[]>>(URL_Categories);
    expect(res.status).toEqual(HttpStatusCode.Ok);
    expect(Array.isArray(res.data.data)).toBeTruthy();
  });
});

describe('Login/Register api', () => {
  let http = new Http().instance;
  beforeEach(() => {
    clearLS();
    http = new Http().instance;
  });

  test('Test logic login with valid account', async () => {
    const res = await http.post<AuthResponse>(URL_LOGIN, validAccount);
    expect(res.status).toBe(HttpStatusCode.Ok);
    expect(res.data.data.access_token).toBeTruthy();
    expect(res.data.data.refresh_token).toBeTruthy();
    expect(res.data.data.user).toBeTruthy();

    const access_token = getAccessTokenFromLS();
    const refresh_token = getRefreshTokenFromLS();
    const profile = getProfileFromLS();

    expect(access_token).toBeTruthy();
    expect(refresh_token).toBeTruthy();
    expect(profile).toBeTruthy();
  });

  test('Test logic login with invalid account', async () => {
    try {
      await http.post<AuthResponse>(URL_LOGIN, invalidAccount);
    } catch (e) {
      if (isAxiosError(e)) {
        expect(e.response?.status).toBe(HttpStatusCode.UnprocessableEntity);
      } else {
        console.log(e);
      }
    }
  });
});

describe('Test call api which attach access token for each calling api', () => {
  let http = new Http().instance;
  beforeEach(() => {
    // vi.useFakeTimers();
    clearLS();
    http = new Http().instance;
  });

  //Nếu trong quá trình test có sử dụng mock thì nên restore mock state change
  //sau mỗi lần test xong
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Get profile successfully', async () => {
    try {
      await http.post(URL_LOGIN, validAccount);
      const res = await http.get<AuthResponse>('/me');
      // vi.useFakeTimers();
      // const getProfile = vi.fn(async () => {
      //   const res = await http.get('/me');
      //   console.log(res);
      //   return res;
      // });
      // setTimeout(getProfile, 4000);
      // vi.runAllTimers();
      // expect(getProfile).toHaveBeenCalledTimes(1);
      expect(res.status).toBe(HttpStatusCode.Ok);
      expect(res.data.data).toBeTruthy();
    } catch (error) {
      if (isAxiosError(error)) {
        expect(error.response?.status).toBe(HttpStatusCode.Unauthorized);
        console.log('Unauthorized error');
      } else {
        console.log(error);
      }
    }
  });

  test('refresh access token successfully', async () => {
    try {
      setAccessTokenToLS(access_token_1s);
      setRefreshTokenToLS(refresh_token_1000days);

      const httpNew = new Http().instance;
      const res = await httpNew.get<AuthResponse>('/me');

      expect(res.status).toBe(HttpStatusCode.Ok);
    } catch (error) {
      console.log('error', error);
    }
  });
});
