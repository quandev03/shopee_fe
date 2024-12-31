import { HttpStatusCode } from 'axios';
import config from 'src/constants/config';
import { HttpResponse, http } from 'msw';

const loginResponse = {
  message: 'Đăng nhập thành công',
  data: {
    access_token:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NjY0YzViMWZhN2Q2MDMzOGJmYmU0ZiIsImVtYWlsIjoic2FuZzVAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNC0wMS0xMFQxNToxNjowOC43NzhaIiwiaWF0IjoxNzA0ODk5NzY4LCJleHAiOjI3MDQ4OTk3Njh9.GiiyRwRecMThWmU2-NnxwdlVYdzS2rrwWK7D8w1-9PE',
    expires: 1000000000,
    refresh_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NjY0YzViMWZhN2Q2MDMzOGJmYmU0ZiIsImVtYWlsIjoic2FuZzVAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNC0wMS0xMFQxNToxNjowOC43NzhaIiwiaWF0IjoxNzA0ODk5NzY4LCJleHAiOjI1Njg4OTk3Njh9.Ur0AG3AlUOhh9MhJeqB-l-rfGLhy-WspnD1dTTFRXjk',
    expires_refresh_token: 864000000,
    user: {
      _id: '64664c5b1fa7d60338bfbe4f',
      roles: [ 'User' ],
      email: 'sang5@gmail.com',
      createdAt: '2023-05-18T16:03:39.193Z',
      updatedAt: '2023-10-18T03:50:48.471Z',
      __v: 0,
      address: 'Việt Nam',
      date_of_birth: '1999-12-22T17:00:00.000Z',
      name: 'Hồ Hoàng Sang',
      phone: '0382374256',
      avatar: '2f3bd2ac-a01f-4e0e-8c4e-50bd8a38df30.jpg'
    }
  }
};

const refreshTokenResponse = {
  message: 'Refresh Token thành công',
  data: {
    access_token:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NjY0YzViMWZhN2Q2MDMzOGJmYmU0ZiIsImVtYWlsIjoic2FuZzVAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNC0wMS0xNFQwMDo0Mzo0Mi4xNzNaIiwiaWF0IjoxNzA1MTkzMDIyLCJleHAiOjE3MDU3OTc4MjJ9.DJOSszc3Xzo-zTO--d1UMhD_dFBtSHi9orz2Aulgefc'
  }
};

const registerResponse422 = { message: 'Lỗi', data: { email: 'Email đã tồn tại' } };

export const access_token_1s =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NjY0YzViMWZhN2Q2MDMzOGJmYmU0ZiIsImVtYWlsIjoic2FuZzVAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0xMC0yM1QxNTowMTo1NC4wODBaIiwiaWF0IjoxNjk4MDczMzE0LCJleHAiOjE2OTgwNzMzMTV9.4mqBSnWU0g5cHRm7lsYi-pRRJ2DMSY-FyhFR-du72oA';
export const refresh_token_1000days =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NjY0YzViMWZhN2Q2MDMzOGJmYmU0ZiIsImVtYWlsIjoic2FuZzVAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0xMC0yM1QxNTowMTo1NC4wODBaIiwiaWF0IjoxNjk4MDczMzE0LCJleHAiOjI1NjIwNzMzMTR9.nnOGkc9DbdoePJG7wAVQ1ebA6-okpLsOkSeh4MJDhVA';

export const accessToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NjY0YzViMWZhN2Q2MDMzOGJmYmU0ZiIsImVtYWlsIjoic2FuZzVAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNC0wMS0xMFQxNToxNjowOC43NzhaIiwiaWF0IjoxNzA0ODk5NzY4LCJleHAiOjI3MDQ4OTk3Njh9.GiiyRwRecMThWmU2-NnxwdlVYdzS2rrwWK7D8w1-9PE';

const loginRequest = http.post(`${config.baseUrl}/login`, ({ request }) => {
  return HttpResponse.json(loginResponse, { status: HttpStatusCode.Ok });
});

const refreshTokenRequest = http.post(`${config.baseUrl}/refresh-access-token`, ({ request }) => {
  return HttpResponse.json(refreshTokenResponse, { status: HttpStatusCode.Ok });
});

const registerHandler = http.post(`${config.baseUrl}/register`, async ({request}) => {
  const requestBody = await request.json();
  const email = (requestBody as any)?.email;

  if (email === "sang5@gmail.com") {
    return HttpResponse.json(registerResponse422, {status: HttpStatusCode.UnprocessableEntity})
  }
})

const authRestHandlers = [ loginRequest, refreshTokenRequest, registerHandler ];

export default authRestHandlers;
