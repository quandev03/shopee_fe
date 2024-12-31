import { describe, test, expect, beforeEach } from 'vitest';
import {
  clearLS,
  getAccessTokenFromLS,
  getProfileFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS
} from '../auth';

const access_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NjY0YzViMWZhN2Q2MDMzOGJmYmU0ZiIsImVtYWlsIjoic2FuZzVAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0xMC0xOVQwNDowMDowMS4zNTlaIiwiaWF0IjoxNjk3Njg4MDAxLCJleHAiOjE2OTc2ODgwMTF9.dITOsfm74qfb7RJVIftVOxWz1cRWra_5E3qHGJt2q64';
const refresh_token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NjY0YzViMWZhN2Q2MDMzOGJmYmU0ZiIsImVtYWlsIjoic2FuZzVAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0xMC0xOVQwNDowMDowMS4zNTlaIiwiaWF0IjoxNjk3Njg4MDAxLCJleHAiOjE2OTc2OTE2MDF9.so8GDS7T5O4Gr3uUsBUCfBZfDXrJwkL3Yp3MxK8YAwg';
const profile =
  '{"_id":"64664c5b1fa7d60338bfbe4f","roles":["User"],"email":"sang5@gmail.com","createdAt":"2023-05-18T16:03:39.193Z","updatedAt":"2023-10-18T03:50:48.471Z","__v":0,"address":"Việt Nam","date_of_birth":"1999-12-22T17:00:00.000Z","name":"Hồ Hoàng Sang","phone":"0382374256","avatar":"2f3bd2ac-a01f-4e0e-8c4e-50bd8a38df30.jpg"}';

//Clear data mỗi khi thực hiện test
beforeEach(() => {
  clearLS();
});

describe('access_token', () => {
  test('access_token should be set into LS', () => {
    setAccessTokenToLS(access_token);
    expect(getAccessTokenFromLS()).toEqual(access_token);
  });
});

describe('refresh_token', () => {
  test('refresh_token should be set into LS', () => {
    setRefreshTokenToLS(refresh_token);
    expect(getRefreshTokenFromLS()).toEqual(refresh_token);
  });
});

describe('profile', () => {
  test('profile shoule be set into LS', () => {
    const profileParsed = JSON.parse(profile);
    setProfileToLS(profileParsed);
    expect(getProfileFromLS());
  });
});

describe('clear all data in LS', () => {
  test('Data should be clear in LS', () => {
    clearLS();
    expect(getAccessTokenFromLS()).toBe('');
    expect(getRefreshTokenFromLS()).toBe('');
    expect(getProfileFromLS()).toBeNull();
  });
});
