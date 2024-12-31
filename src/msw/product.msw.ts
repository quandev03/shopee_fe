import { HttpStatusCode } from 'axios';
import { HttpResponse, http } from 'msw';
import config from 'src/constants/config';

const productListResponse = {
  message: 'Lấy các sản phẩm thành công',
  data: {
    products: [
      {
        _id: '60afb2c76ef5b902180aacba',
        images: [
          'https://api-ecom.duthanhduoc.com/images/bbea6d3e-e5b1-494f-ab16-02eece816d50.jpg',
          'https://api-ecom.duthanhduoc.com/images/6c4f6bde-6242-40fd-be52-d06033636e04.jpg',
          'https://api-ecom.duthanhduoc.com/images/1385ed69-6843-4edb-a1fb-e5fc795a99e5.jpg',
          'https://api-ecom.duthanhduoc.com/images/7f4f7a5b-b003-462a-a6b9-c0e69175def3.jpg',
          'https://api-ecom.duthanhduoc.com/images/1c323bdd-c0ef-4538-b09d-34c1a4478baa.jpg',
          'https://api-ecom.duthanhduoc.com/images/5054f46f-d317-40f6-a804-6b22dc92e946.jpg',
          'https://api-ecom.duthanhduoc.com/images/eed30991-df2d-41b5-afb2-697a06ba3299.jpg',
          'https://api-ecom.duthanhduoc.com/images/2922fee1-448c-4302-bcc2-804e0fe44f84.jpg',
          'https://api-ecom.duthanhduoc.com/images/84f7bf91-685c-4be9-bd8c-1f0a4e2e21c3.jpg'
        ],
        price: 3190000,
        rating: 4.6,
        price_before_discount: 3990000,
        quantity: 138,
        sold: 1200,
        view: 85924,
        name: 'Điện Thoại Vsmart Active 3 6GB/64GB - Hàng Chính Hãng',
        category: { _id: '60afafe76ef5b902180aacb5', name: 'Điện thoại', __v: 0 },
        image: 'https://api-ecom.duthanhduoc.com/images/bbea6d3e-e5b1-494f-ab16-02eece816d50.jpg',
        createdAt: '2021-05-27T14:55:03.113Z',
        updatedAt: '2024-01-13T15:05:26.154Z'
      },
      {
        _id: '60afb2426ef5b902180aacb9',
        images: [
          'https://api-ecom.duthanhduoc.com/images/aa374023-7a5b-46ea-aca3-dad1b29fb015.jpg',
          'https://api-ecom.duthanhduoc.com/images/b997dac2-2674-4e20-b5ee-459566b077e7.jpg',
          'https://api-ecom.duthanhduoc.com/images/ac328d77-6014-4a2d-8626-924ac35876df.jpg',
          'https://api-ecom.duthanhduoc.com/images/5061fefa-bded-4fb0-80e5-3623656a4816.jpg',
          'https://api-ecom.duthanhduoc.com/images/02c08a86-4d9b-437b-ae02-f1d49cf2933b.jpg',
          'https://api-ecom.duthanhduoc.com/images/12c405e3-b24f-46ef-8969-54050e1022e9.jpg',
          'https://api-ecom.duthanhduoc.com/images/d448057c-3d3d-45d2-a9bc-e984bc80555f.jpg'
        ],
        price: 2590000,
        rating: 4.2,
        price_before_discount: 3490000,
        quantity: 73,
        sold: 6800,
        view: 35795,
        name: 'Điện thoại OPPO A12 (3GB/32GB) - Hàng chính hãng',
        category: { _id: '60afafe76ef5b902180aacb5', name: 'Điện thoại', __v: 0 },
        image: 'https://api-ecom.duthanhduoc.com/images/aa374023-7a5b-46ea-aca3-dad1b29fb015.jpg',
        createdAt: '2021-05-27T14:52:50.392Z',
        updatedAt: '2024-01-13T15:05:28.109Z'
      },
      {
        _id: '60afb1c56ef5b902180aacb8',
        images: [
          'https://api-ecom.duthanhduoc.com/images/a7fb7a18-743a-42bb-bead-36370c1d1aba.jpg',
          'https://api-ecom.duthanhduoc.com/images/b09ff60d-c6bd-4d3a-b778-0fc2708a65fb.jpg',
          'https://api-ecom.duthanhduoc.com/images/fc5ecd4c-47eb-4f12-ae82-ef26fd492887.jpg',
          'https://api-ecom.duthanhduoc.com/images/a87f854d-37a9-4252-a2f7-243fc21f8b55.jpg',
          'https://api-ecom.duthanhduoc.com/images/3ecf878d-6742-43d4-abe7-044c15c84120.jpg'
        ],
        price: 20990000,
        rating: 5,
        price_before_discount: 26990000,
        quantity: 17,
        sold: 482,
        view: 20964,
        name: 'Điện thoại Apple Iphone 12 64GB - Hàng chính hãng VNA',
        category: { _id: '60afafe76ef5b902180aacb5', name: 'Điện thoại', __v: 0 },
        image: 'https://api-ecom.duthanhduoc.com/images/a7fb7a18-743a-42bb-bead-36370c1d1aba.jpg',
        createdAt: '2021-05-27T14:50:45.708Z',
        updatedAt: '2024-01-13T10:02:25.316Z'
      },
      {
        _id: '60afb14d6ef5b902180aacb7',
        images: [
          'https://api-ecom.duthanhduoc.com/images/51ef469d-0eb5-48fb-958d-ce2b9c664adc.jpg',
          'https://api-ecom.duthanhduoc.com/images/32d2b004-6a6c-4605-af12-8f8f2e4f6aff.jpg',
          'https://api-ecom.duthanhduoc.com/images/00f74b87-0750-4cc9-9b91-24907a2b1721.jpg',
          'https://api-ecom.duthanhduoc.com/images/f08f305b-e237-444d-9f1e-430ce15acd96.jpg',
          'https://api-ecom.duthanhduoc.com/images/2442b133-7801-47a5-ae7d-5fc5196a1a51.jpg',
          'https://api-ecom.duthanhduoc.com/images/19a98c2f-3ab4-4d72-bbc9-3525fd89859c.jpg',
          'https://api-ecom.duthanhduoc.com/images/9123a99f-e71c-49e7-a87b-974541fcb607.jpg'
        ],
        price: 2130000,
        rating: 5,
        price_before_discount: 2690000,
        quantity: 269,
        sold: 5600,
        view: 8073,
        name: 'Điện Thoại Realme C11 (2GB/32GB) - Hàng Chính Hãng',
        category: { _id: '60afafe76ef5b902180aacb5', name: 'Điện thoại', __v: 0 },
        image: 'https://api-ecom.duthanhduoc.com/images/51ef469d-0eb5-48fb-958d-ce2b9c664adc.jpg',
        createdAt: '2021-05-27T14:48:45.577Z',
        updatedAt: '2024-01-13T15:05:01.992Z'
      },
      {
        _id: '60afb07e6ef5b902180aacb6',
        images: [
          'https://api-ecom.duthanhduoc.com/images/4e9c8364-7604-4b61-8658-9f18655bae40.jpg',
          'https://api-ecom.duthanhduoc.com/images/794c2b24-922a-4cc2-8c24-87551af917df.jpg',
          'https://api-ecom.duthanhduoc.com/images/e5ae5753-c153-4a29-9254-48cde48f814f.jpg',
          'https://api-ecom.duthanhduoc.com/images/24ceb22a-d9a2-4936-a53d-1d8c508b5eeb.jpg',
          'https://api-ecom.duthanhduoc.com/images/db1900e0-245c-437f-9e7e-9a5f15045d0f.jpg',
          'https://api-ecom.duthanhduoc.com/images/d4be2e97-e131-4cc6-93ed-432593ba9245.jpg',
          'https://api-ecom.duthanhduoc.com/images/1866d116-06a0-4657-936e-256c8ed09bd0.jpg',
          'https://api-ecom.duthanhduoc.com/images/77c6c7ec-25dc-4d5e-b572-22e7916c1cb2.jpg',
          'https://api-ecom.duthanhduoc.com/images/6492ca72-6451-414c-8653-f31693ebe1e6.jpg'
        ],
        price: 1949000,
        rating: 5,
        price_before_discount: 1990000,
        quantity: 409,
        sold: 1000,
        view: 6778,
        name: 'Điện Thoại Xiaomi Redmi 9A 2GB/32GB - Hàng Chính Hãng',
        category: { _id: '60afafe76ef5b902180aacb5', name: 'Điện thoại', __v: 0 },
        image: 'https://api-ecom.duthanhduoc.com/images/4e9c8364-7604-4b61-8658-9f18655bae40.jpg',
        createdAt: '2021-05-27T14:45:18.517Z',
        updatedAt: '2024-01-13T15:02:08.212Z'
      },
      {
        _id: '60afafb76ef5b902180aacb4',
        images: [
          'https://api-ecom.duthanhduoc.com/images/1881b221-e9df-4b91-8d13-9d46c995a5d6.jpg',
          'https://api-ecom.duthanhduoc.com/images/806160a8-f96b-4bfd-bfa5-a821016e5b30.jpg',
          'https://api-ecom.duthanhduoc.com/images/07d99599-bf3e-4b23-baa3-72b81669f5a7.jpg',
          'https://api-ecom.duthanhduoc.com/images/06125fad-e4a5-4a1c-9179-cab3eec4d237.jpg',
          'https://api-ecom.duthanhduoc.com/images/f9a7461e-7d3c-4f21-8a0e-4bb630d543bc.jpg',
          'https://api-ecom.duthanhduoc.com/images/bb01fb3b-a5a6-4a0c-a2cd-97655f074203.jpg',
          'https://api-ecom.duthanhduoc.com/images/21f5ece2-7e35-4d77-832f-e3546848979f.jpg',
          'https://api-ecom.duthanhduoc.com/images/efc35076-3bb6-4527-bdb2-b273db3012bd.jpg'
        ],
        price: 244550,
        rating: 3.8,
        price_before_discount: 489000,
        quantity: 9920,
        sold: 728,
        view: 10854,
        name: 'Đồng Hồ Nam WWOOR 8826 Máy Nhật Dây Thép Mành Cao Cấp - Nhiều Màu',
        category: { _id: '60afacca6ef5b902180aacaf', name: 'Đồng hồ', __v: 0 },
        image: 'https://api-ecom.duthanhduoc.com/images/1881b221-e9df-4b91-8d13-9d46c995a5d6.jpg',
        createdAt: '2021-05-27T14:41:59.307Z',
        updatedAt: '2024-01-13T08:59:03.220Z'
      },
      {
        _id: '60afaf286ef5b902180aacb3',
        images: [
          'https://api-ecom.duthanhduoc.com/images/ffa092a6-c35e-4de3-b955-99f368f57546.jpg',
          'https://api-ecom.duthanhduoc.com/images/c8a8c12e-aef6-436b-b114-4db528ca3542.jpg',
          'https://api-ecom.duthanhduoc.com/images/0d3a7e41-f0b8-47aa-843b-db994f661682.jpg',
          'https://api-ecom.duthanhduoc.com/images/517e6837-beb7-4c8a-8df0-259f267828dd.jpg',
          'https://api-ecom.duthanhduoc.com/images/ea3c7cdf-71c5-4e0b-9a0e-1305737b5aee.jpg',
          'https://api-ecom.duthanhduoc.com/images/264418f7-f239-4405-82bf-b2e0ec05891d.jpg',
          'https://api-ecom.duthanhduoc.com/images/fd5c8918-ef84-4bf8-b20f-bb514e415686.jpg',
          'https://api-ecom.duthanhduoc.com/images/f6cb802c-9a43-4804-9a30-e56be8e41a19.jpg',
          'https://api-ecom.duthanhduoc.com/images/133ec1a8-fe1f-4ffe-a7a9-28880de79838.jpg'
        ],
        price: 300000,
        rating: 5,
        price_before_discount: 450000,
        quantity: 4034,
        sold: 2400,
        view: 5996,
        name: 'Đồng Hồ Nam CRRJU CR8940 Dây Thép Cao Cấp',
        category: { _id: '60afacca6ef5b902180aacaf', name: 'Đồng hồ', __v: 0 },
        image: 'https://api-ecom.duthanhduoc.com/images/ffa092a6-c35e-4de3-b955-99f368f57546.jpg',
        createdAt: '2021-05-27T14:39:36.099Z',
        updatedAt: '2024-01-13T10:21:48.854Z'
      },
      {
        _id: '60afae906ef5b902180aacb2',
        images: [
          'https://api-ecom.duthanhduoc.com/images/37256021-1e7c-40f4-8e0f-d665f7cb95bd.jpg',
          'https://api-ecom.duthanhduoc.com/images/cae19f00-7a2a-4d79-9446-2868a613b4b7.jpg',
          'https://api-ecom.duthanhduoc.com/images/314ab003-20e1-455f-a585-7514a388a9ae.jpg',
          'https://api-ecom.duthanhduoc.com/images/eba3ed37-74f2-460e-84be-c651907b2536.jpg',
          'https://api-ecom.duthanhduoc.com/images/f0255207-359f-44a9-8b06-aea6d80408cd.jpg',
          'https://api-ecom.duthanhduoc.com/images/1939becb-3b6f-4798-b67d-66e9997efee8.jpg',
          'https://api-ecom.duthanhduoc.com/images/5990d6b5-894b-4c9c-81a2-3f039dd7b867.jpg',
          'https://api-ecom.duthanhduoc.com/images/3b5f3f84-6ff0-454f-bafb-883fce1cc3f9.jpg',
          'https://api-ecom.duthanhduoc.com/images/e97515b5-d474-40c9-b984-28d6b3ffbd08.jpg'
        ],
        price: 199000,
        rating: 5,
        price_before_discount: 250000,
        quantity: 3091,
        sold: 2500,
        view: 5679,
        name: 'Đồng Hồ Nam FNGEEN Dây Thép Cao Cấp Không Gỉ, Có Lịch Ngày, Phong Cách Doanh Nhân Sang Trọng',
        category: { _id: '60afacca6ef5b902180aacaf', name: 'Đồng hồ', __v: 0 },
        image: 'https://api-ecom.duthanhduoc.com/images/37256021-1e7c-40f4-8e0f-d665f7cb95bd.jpg',
        createdAt: '2021-05-27T14:37:04.282Z',
        updatedAt: '2024-01-13T14:46:44.688Z'
      },
      {
        _id: '60afadff6ef5b902180aacb1',
        images: [
          'https://api-ecom.duthanhduoc.com/images/a7dfed1e-6beb-4390-af5e-24413bf619a6.jpg',
          'https://api-ecom.duthanhduoc.com/images/29fe140f-3280-4724-a246-ede984d75559.jpg',
          'https://api-ecom.duthanhduoc.com/images/c500e2d3-85ab-4cbb-b3b0-bd4b622a2cb2.jpg',
          'https://api-ecom.duthanhduoc.com/images/70ac3d12-9f6a-4447-8283-58fd9d63e319.jpg',
          'https://api-ecom.duthanhduoc.com/images/e00804e6-6884-47ca-acb0-0bd9a246266a.jpg',
          'https://api-ecom.duthanhduoc.com/images/534cff9b-d05f-40b2-a777-f043d382fd38.jpg',
          'https://api-ecom.duthanhduoc.com/images/4cce1f66-8393-4f82-b3f0-5e81face5346.jpg',
          'https://api-ecom.duthanhduoc.com/images/07c573b3-67f3-4c59-9ad8-441cb803a9ec.jpg',
          'https://api-ecom.duthanhduoc.com/images/33d2727b-68ed-4454-a1fb-4c66d454dbf7.jpg'
        ],
        price: 260000,
        rating: 5,
        price_before_discount: 500000,
        quantity: 4050,
        sold: 2300,
        view: 3149,
        name: 'Đồng Hồ Điện Tử Thể Thao Nam Chính Hãng SMAEL JAPAN 2020 - Phong Cách Quân Đội',
        category: { _id: '60afacca6ef5b902180aacaf', name: 'Đồng hồ', __v: 0 },
        image: 'https://api-ecom.duthanhduoc.com/images/a7dfed1e-6beb-4390-af5e-24413bf619a6.jpg',
        createdAt: '2021-05-27T14:34:39.366Z',
        updatedAt: '2024-01-13T02:16:30.730Z'
      },
      {
        _id: '60afad846ef5b902180aacb0',
        images: [
          'https://api-ecom.duthanhduoc.com/images/a04c55a2-9569-4a59-a6de-2b3bbdcb570a.jpg',
          'https://api-ecom.duthanhduoc.com/images/7d131757-51eb-43af-bc2a-4eb479186fc9.jpg',
          'https://api-ecom.duthanhduoc.com/images/89ca357b-cd4a-4389-b290-166bb78a987b.jpg',
          'https://api-ecom.duthanhduoc.com/images/869051b5-ce64-4107-82d1-891daa969700.jpg',
          'https://api-ecom.duthanhduoc.com/images/7586bd50-7d86-4fd9-b728-812753fdbe8d.jpg',
          'https://api-ecom.duthanhduoc.com/images/aaf5a147-d8f9-44dd-914c-ba52298fd354.jpg',
          'https://api-ecom.duthanhduoc.com/images/df1c6c76-3658-4657-a678-ca53197cef7e.jpg',
          'https://api-ecom.duthanhduoc.com/images/b117fb99-cc14-4090-9e12-1f269485b80d.jpg',
          'https://api-ecom.duthanhduoc.com/images/cb4f7da2-267f-4dc7-bd6e-aab30e04067a.jpg'
        ],
        price: 229000,
        rating: 5,
        price_before_discount: 399000,
        quantity: 100123,
        sold: 31500,
        view: 9161,
        name: 'Đồng Hồ Nam WWOOR 8018 Dây Thép Nhật Cao Cấp Nhiều Màu',
        category: { _id: '60afacca6ef5b902180aacaf', name: 'Đồng hồ', __v: 0 },
        image: 'https://api-ecom.duthanhduoc.com/images/a04c55a2-9569-4a59-a6de-2b3bbdcb570a.jpg',
        createdAt: '2021-05-27T14:32:36.605Z',
        updatedAt: '2024-01-13T15:05:07.370Z'
      }
    ],
    pagination: { page: 1, limit: 10, page_size: 5 }
  }
};

const productResponse = {
  message: 'Lấy sản phẩm thành công',
  data: {
    _id: '60afb2c76ef5b902180aacba',
    images: [
      'https://api-ecom.duthanhduoc.com/images/bbea6d3e-e5b1-494f-ab16-02eece816d50.jpg',
      'https://api-ecom.duthanhduoc.com/images/6c4f6bde-6242-40fd-be52-d06033636e04.jpg',
      'https://api-ecom.duthanhduoc.com/images/1385ed69-6843-4edb-a1fb-e5fc795a99e5.jpg',
      'https://api-ecom.duthanhduoc.com/images/7f4f7a5b-b003-462a-a6b9-c0e69175def3.jpg',
      'https://api-ecom.duthanhduoc.com/images/1c323bdd-c0ef-4538-b09d-34c1a4478baa.jpg',
      'https://api-ecom.duthanhduoc.com/images/5054f46f-d317-40f6-a804-6b22dc92e946.jpg',
      'https://api-ecom.duthanhduoc.com/images/eed30991-df2d-41b5-afb2-697a06ba3299.jpg',
      'https://api-ecom.duthanhduoc.com/images/2922fee1-448c-4302-bcc2-804e0fe44f84.jpg',
      'https://api-ecom.duthanhduoc.com/images/84f7bf91-685c-4be9-bd8c-1f0a4e2e21c3.jpg'
    ],
    price: 3190000,
    rating: 4.6,
    price_before_discount: 3990000,
    quantity: 138,
    sold: 1200,
    view: 85958,
    name: 'Điện Thoại Vsmart Active 3 6GB/64GB - Hàng Chính Hãng',
    description:
      '<p>Điện Thoại Vsmart Active 3 6GB/64GB - H&agrave;ng Ch&iacute;nh H&atilde;ng<br />Bộ sản phẩm bao gồm: Th&acirc;n m&aacute;y, sạc, c&aacute;p USB, tai nghe, ốp lưng, dụng cụ lấy sim, s&aacute;ch hướng dẫn sử dụng.</p><p>Chất sang chảnh, chuẩn m&agrave;n h&igrave;nh<br />M&agrave;n h&igrave;nh sống động 6.39 AMOLED tr&agrave;n viền<br />Camera Selfie trượt 16MP ấn tượng, đầy m&ecirc; hoặc<br />Bộ 3 Camera AI 48MP si&ecirc;u chụp b&oacute;ng đ&ecirc;m<br />Thiết kế mặt lưng tr&agrave;n &aacute;nh s&aacute;ng<br />Nổi bật trong đ&ecirc;m sắc m&agrave;u. Lấy cảm hứng từ sắc đ&ecirc;m huyền ảo, được chế t&aacute;c tinh xảo tạo n&ecirc;n mặt lưng 3D chuyển m&agrave;u khi tương t&aacute;c với &aacute;nh s&aacute;ng. Với 4 m&agrave;u sắc Xanh Sapphire, Xanh Lục Bảo, T&iacute;m Ngọc v&agrave; Đen Thạch Anh, sẽ khiến bạn trở bạn trở th&agrave;nh t&acirc;m điểm của sự ch&uacute; &yacute;<br />Thật ấn tượng với camera selfie sẽ tự động bật l&ecirc;n v&agrave; thu lại theo thao t&aacute;c chụp ảnh selfie c&ugrave;ng thuật to&aacute;n l&agrave;m đẹp AI Beauty, ảnh selfie cực k&igrave; th&uacute; vị<br />K&iacute;ch thước 66.25 x 75.62 x 8.83 (mm)<br />Trọng lượng 183 g<br />Camera trước 16MP f/2.2 Popup <br />Camera sau 48MP f/1.7 - Camera chụp đ&ecirc;m<br /> 8MP f/2.2 - Camera g&oacute;c rộng<br /> 2MP f/2.4 - Camera x&oacute;a ph&ocirc;ng <br />Độ ph&acirc;n giải FHD+ ( 1080 x 2340 )<br />Cổng USB USB Type-C<br />Điện Thoại Vsmart Active 3 6GB/64GB - H&agrave;ng Ch&iacute;nh H&atilde;ng</p><p>Cảm ơn qu&yacute; kh&aacute;ch đ&atilde; quan t&acirc;m đến sản phẩm b&ecirc;n shop, qu&yacute; kh&aacute;ch vui l&ograve;ng d&agrave;nh &iacute;t thời gian đọc kĩ ch&iacute;nh s&aacute;ch bảo h&agrave;nh đổi trả:<br />- Sản phẩm được bao test 7 ng&agrave;y kể từ ng&agrave;y nhận được sản phẩm v&agrave; sẽ được đổi m&aacute;y mới c&ugrave;ng model hoặc gi&aacute; trị tương đương sau khi được thẩm định lỗi kĩ thuật.<br />- Sản phẩm lỗi kĩ thuật được x&aacute;c nhận bởi trung t&acirc;m bảo h&agrave;nh ủy quyền ch&iacute;nh h&atilde;ng (bằng văn bản); kh&aacute;ch h&agrave;ng c&oacute; thể gửi lại shop để x&aacute;c nhận lỗi hoặc tới trạm bảo h&agrave;nh gần nhất để thẩm định lỗi.<br />- Sản phẩm đổi trả phải c&ograve;n nguy&ecirc;n hiện trạng m&aacute;y kh&ocirc;ng trầy xước, kh&ocirc;ng bể vỡ, v&ocirc; nước, g&atilde;y ch&acirc;n sim, khung thẻ nhớ&hellip; (tất cả c&aacute;c t&aacute;c động ngoại lực từ ph&iacute;a kh&aacute;ch h&agrave;ng đều TỪ CHỐI BẢO H&Agrave;NH)<br />- Sản phẩm đổi trả phải c&ograve;n nguy&ecirc;n hộp tr&ugrave;ng imei, phụ kiện k&egrave;m theo m&aacute;y kh&ocirc;ng trầy xước, ch&aacute;y nổ, đứt d&acirc;y (nếu trầy xước shop kh&ocirc;ng đổi phụ kiện mới)<br />- Sau 7 ng&agrave;y bao test, sản phẩm vẫn nhận ch&iacute;nh s&aacute;ch bảo h&agrave;nh 18 th&aacute;ng kể từ ng&agrave;y k&iacute;ch hoạt bảo h&agrave;nh (kh&aacute;ch chịu ph&iacute; vận chuyển tới shop bảo h&agrave;nh hộ hoặc tự đến trung t&acirc;m bảo h&agrave;nh gần nhất để được hỗ trợ)<br />- Trong một số trường hợp sản phẩm đ&atilde; được k&iacute;ch hoạt bảo h&agrave;nh điện tử để tham gia chương tr&igrave;nh khuyến m&atilde;i c&oacute; gi&aacute; tốt cho kh&aacute;ch h&agrave;ng. Vui l&ograve;ng chat với nh&acirc;n vi&ecirc;n tư vấn để được hỗ trợ th&ecirc;m th&ocirc;ng tin.<br />- Sản phẩm bị TỪ CHỐI BẢO H&Agrave;NH khi ch&aacute;y nổ, bể vỡ, t&aacute;c động ngoại lực v&agrave;o th&acirc;n v&agrave; b&ecirc;n trong m&aacute;y, c&oacute; thay đổi sửa chữa b&ecirc;n ngo&agrave;i.<br />- C&aacute;c sản phẩm bị kh&oacute;a t&agrave;i khoản như Gmail, Samsung account&hellip; Kh&aacute;ch tự chịu ph&iacute; mở kh&oacute;a nếu kh&ocirc;ng nhớ mật khẩu.<br />Điện Thoại Vsmart Active 3 6GB/64GB - H&agrave;ng Ch&iacute;nh H&atilde;ng<br />#điện_thoại #dienthoai #di_động #didong #điện_thoại_di_động #dien_thoai_di_dong #điện_thoại_ch&iacute;nh_h&atilde;ng #h&agrave;ng_ch&iacute;nh_h&atilde;ng #điện_thoại_gi&aacute;_rẻ #dien_thoai_gia_re #gi&aacute; rẻ #khuyen_mai #freeship #mobile #smartphone #điện_thoại_vsmart #vsmart #vsmart_ active_3</p>',
    category: {
      _id: '60afafe76ef5b902180aacb5',
      name: 'Điện thoại',
      __v: 0
    },
    image: 'https://api-ecom.duthanhduoc.com/images/bbea6d3e-e5b1-494f-ab16-02eece816d50.jpg',
    createdAt: '2021-05-27T14:55:03.113Z',
    updatedAt: '2024-01-14T00:50:31.053Z'
  }
};

const productListRequest = http.get(`${config.baseUrl}/products`, ({ request }) => {
  const params: any = {
    page: 1,
    limit: 10
  };

  const url = new URL(request.url);

  Object.keys(params).forEach((key) => url.searchParams.set(key, params[key]));

  return HttpResponse.json(productListResponse, { status: HttpStatusCode.Ok });
});

const productRequest = http.get(`${config.baseUrl}/products/:id`, ({ request }) => {
  return HttpResponse.json(productResponse, { status: HttpStatusCode.Ok });
});

const productRestHandler = [productListRequest, productRequest];

export default productRestHandler;
