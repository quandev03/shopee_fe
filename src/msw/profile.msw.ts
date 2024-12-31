import { HttpStatusCode } from 'axios';
import { HttpResponse, http } from 'msw';
import config from 'src/constants/config';
import { access_token_1s } from './auth.msw';

const meResponse = {
  message: 'Lấy người dùng thành công',
  data: {
    _id: '64664c5b1fa7d60338bfbe4f',
    roles: ['User'],
    email: 'sang5@gmail.com',
    createdAt: '2023-05-18T16:03:39.193Z',
    updatedAt: '2023-10-18T03:50:48.471Z',
    address: 'Việt Nam',
    date_of_birth: '1999-12-22T17:00:00.000Z',
    name: 'Hồ Hoàng Sang',
    phone: '0382374256',
    avatar: '2f3bd2ac-a01f-4e0e-8c4e-50bd8a38df30.jpg'
  }
};

const expireTokenReponse: any = {
  message: 'Lỗi',
  data: {
    message: 'Token hết hạn',
    name: 'EXPIRED_TOKEN'
  }
};
//Hàm này sẽ run 2 lần nếu bị lỗi 401
const meRequest = http.get(`${config.baseUrl}/me`, ({ request }) => {
  const access_token = request.headers.get('Authorization');
  if (access_token === access_token_1s) {
    return HttpResponse.json(expireTokenReponse, { status: HttpStatusCode.Unauthorized });
  }

  return HttpResponse.json(meResponse, { status: HttpStatusCode.Ok });
});

const profileRestHandler = [meRequest];

export default profileRestHandler;
