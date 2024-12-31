import { HttpStatusCode } from 'axios';
import { HttpResponse, http } from 'msw';
import config from 'src/constants/config';

const productResponse = {
  message: 'Lấy categories thành công',
  data: [
    {
      _id: '60afacca6ef5b902180aacaf',
      name: 'Đồng hồ'
    },
    {
      _id: '60aba4e24efcc70f8892e1c6',
      name: 'Áo thun'
    },
    {
      _id: '60afafe76ef5b902180aacb5',
      name: 'Điện thoại'
    }
  ]
};

const categoriesRequest = http.get(`${config.baseUrl}/categories`, () => {
  return HttpResponse.json(productResponse, { status: HttpStatusCode.Ok });
});

const categoriesRestHandler = [categoriesRequest];

export default categoriesRestHandler;
