import { HttpStatusCode } from 'axios';
import { HttpResponse, http } from 'msw';
import config from 'src/constants/config';

const pruchasesResponse = {
  message: 'Lấy đơn mua thành công',
  data: [
    {
      _id: '64b25fbb1afc2e1a1f96b7f8',
      buy_count: 63,
      price: 79000,
      price_before_discount: 150000,
      status: -1,
      user: '64664c5b1fa7d60338bfbe4f',
      product: {
        _id: '60ad04392fb52902585972ac',
        images: [
          'https://api-ecom.duthanhduoc.com/images/ef8fcfa8-c006-486e-9660-462efa93ad43.jpg',
          'https://api-ecom.duthanhduoc.com/images/5d172cad-1bcf-4d9d-99d1-0181e3aafdae.jpg',
          'https://api-ecom.duthanhduoc.com/images/f6ad0955-51bd-444b-bd74-b5bb4166ccfb.jpg',
          'https://api-ecom.duthanhduoc.com/images/9064e6d7-1315-4109-bbfa-6003f3a7227b.jpg',
          'https://api-ecom.duthanhduoc.com/images/789df15f-0298-4083-a559-7f567abb9adc.jpg',
          'https://api-ecom.duthanhduoc.com/images/1204c73a-151c-4b31-9e4e-bcee60db0b68.jpg'
        ],
        price: 79000,
        rating: 4.8,
        price_before_discount: 150000,
        quantity: 23210,
        sold: 898,
        view: 2227,
        name: '[XẢ KHO GIÁ SỐC] Áo thun nam cổ tim ngắn tay đẹp nhiều màu đủ size ( có size lớn cho người 100 kg )',
        description:
          '<p>&Aacute;o Thun nam cổ tim Ngắn tay nhiều m&agrave;u<br />✔ &Aacute;o thun l&agrave; item kh&ocirc;ng thể thiếu trong tủ đồ ng&agrave;y h&egrave; v&igrave; sự thoải m&aacute;i, dễ chịu, lại rất dễ phối đồ.<br />✔ &Aacute;o thun trơn basic được l&agrave;m bằng chất liệu thun lạnh co gi&atilde;n 4 chiều, cực k&igrave; đẹp, vải rất m&aacute;t, sờ mịn tay<br />✔ Kh&ocirc;ng ra m&agrave;u, kh&ocirc;ng bai nh&atilde;o, kh&ocirc;ng chảy xệ.<br />✔ Bo cổ kiểu cắt (qu&yacute; kh&aacute;ch vui l&ograve;ng xem kĩ h&igrave;nh ảnh chi tiết cổ &aacute;o)<br />✔ M&agrave;u sắc trẻ trung, như h&igrave;nh hoặc c&oacute; hơi nhạt hơn 1 t&yacute; v&igrave; mỗi lần vải về c&oacute; ch&ecirc;nh lệch 1 t&iacute; m&agrave;u ạ (hỗ trợ đổi trả nếu kh&ocirc;ng h&agrave;i l&ograve;ng)<br />✔ C&oacute; 6 m&agrave;u: trắng, đen, x&aacute;m, xanh r&ecirc;u , đỏ đ&ocirc;, xanh đen<br />&Aacute;o thun nam s&agrave;nh điệu c&oacute; thiết kế cổ tr&ograve;n, tay ngắn mang lại cho ph&aacute;i mạnh phong c&aacute;ch nam t&iacute;nh v&agrave; lịch l&atilde;m khi mặc h&agrave;ng ng&agrave;y<br />&bull; Form &aacute;o &ocirc;m vừa vặn thoải m&aacute;i khi mặc hằng ng&agrave;y hay c&aacute;c hoạt động mang lại sự tự tin v&agrave; năng động cho ph&aacute;i mạnh<br />&bull; &Aacute;o trơn m&agrave;u đơn giản tạo n&ecirc;n n&eacute;t nam t&iacute;nh mạnh mẽ cho nam giới khi mặc, gi&uacute;p ph&aacute;i mạnh lu&ocirc;n c&aacute; t&iacute;nh, thời thượng<br />&bull; Đường chỉ may đẹp, tinh tế mang đến sự an t&acirc;m tuyệt đối cho nam giới khi sử dụng sản phẩm<br />&bull; M&agrave;u sắc đa dạng, c&aacute; t&iacute;nh, nổi bật, dễ phối đồ, rất cuốn h&uacute;t khi mặc vận động thể thao hay đi chơi<br />&bull; Chất liệu thun mềm mại, tho&aacute;ng m&aacute;t, thấm h&uacute;t tốt, kh&ocirc;ng lo hầm b&iacute; khi mặc<br />&bull; Kết hợp h&agrave;i h&ograve;a được với c&aacute;c trang phục từ bụi bặm c&aacute; t&iacute;nh như quần short, quần jean đến những phong c&aacute;ch đơn giản cổ điển như quần t&acirc;y quần kaki,..<br />&bull; K&iacute;ch thước: <br />Size S : ( 45kg - 52kg )<br />Size M : ( 53kg - 59kg )<br />size L : ( 60kg - 69kg )<br />Size XL : (70kg - 78kg)<br />size 2XL : (79kg - 89kg)<br />Size 3XL : (90kg-105kg)<br />Xuất xứ: Việt Nam</p><p>#aothun #aothunnam #aocotim #aothuncotim #aothuntron #aothundep #aothuncotim #aophongnamcotron #aophongnam #aothunnamgiare #aothunnamre #aothunnamrẻnhất #aothun #&aacute;othunnam<br />#&aacute;othun #aothunnam #aothunnamcotron #&aacute;othunnamrẻđẹp #&aacute;othunnamcổtr&ograve;n #aothunnamdep #aophongnam #aophongnamdep #aophongnamgiare #aophongnamdep #&aacute;othunnamđẹp</p>',
        category: {
          _id: '60aba4e24efcc70f8892e1c6',
          name: 'Áo thun',
          __v: 0
        },
        image: 'https://api-ecom.duthanhduoc.com/images/ef8fcfa8-c006-486e-9660-462efa93ad43.jpg',
        createdAt: '2021-05-25T14:05:45.785Z',
        updatedAt: '2024-01-13T15:05:31.220Z',
        __v: 0
      },
      createdAt: '2023-07-15T08:58:35.790Z',
      updatedAt: '2023-09-12T04:14:08.258Z',
      __v: 0
    },
    {
      _id: '64b25eac1afc2e1a1f96b7f7',
      buy_count: 1,
      price: 194555,
      price_before_discount: 299999,
      status: -1,
      user: '64664c5b1fa7d60338bfbe4f',
      product: {
        _id: '60af722af1a3041b289d8ba1',
        images: [
          'https://api-ecom.duthanhduoc.com/images/8fdcc6d3-70ea-4853-954e-b8776fbab6fa.jpg',
          'https://api-ecom.duthanhduoc.com/images/531834bf-0bc0-4cdc-941e-9b5204d97b0d.jpg',
          'https://api-ecom.duthanhduoc.com/images/4cec69e1-0cc8-4c2c-8f2e-19340cc89469.jpg',
          'https://api-ecom.duthanhduoc.com/images/fb0cb1b5-8987-4d0b-bf40-428e91cb417c.jpg',
          'https://api-ecom.duthanhduoc.com/images/21643c6a-8e9f-46c7-a587-f7c5aa5034c9.jpg',
          'https://api-ecom.duthanhduoc.com/images/735f43ba-992c-4ace-a3fe-e097da0c8877.jpg',
          'https://api-ecom.duthanhduoc.com/images/e3371592-f52a-43f4-82dc-bc8da71a023b.jpg',
          'https://api-ecom.duthanhduoc.com/images/344baaa7-6507-4a1c-a619-9e199638cbff.jpg',
          'https://api-ecom.duthanhduoc.com/images/37b8be77-cb17-4126-8dae-97ff7bb19014.jpg'
        ],
        price: 194555,
        rating: 4.1,
        price_before_discount: 299999,
        quantity: 75,
        sold: 55,
        view: 5553,
        name: '[KHUYẾN MÃI 35%] Áo Thun POLO Nam, Tay Ngắn Áo Cổ Sọc, Chất Liệu Cá Sấu Cao Cấp - Nhiều màu- Đủ Size',
        description:
          '<p>&Aacute;o Polo nam tay ngắn ph&ugrave; hợp với nhiều ho&agrave;n cảnh: c&ocirc;ng sở, mặc nh&agrave;, đi học, đi chơi, du lịch, thể thao, Gym, l&agrave;m qu&agrave; tặng&hellip;&hellip; Tạo cảm gi&aacute;c trẻ trung cho người mặc, phối hợp được với nhiều loại quần như quần kaki, quần t&acirc;y, quần jeans, quần short&hellip;..</p><p><br />Th&ocirc;ng tin sản phẩm</p><p>T&ecirc;n sản phẩm: &Aacute;o Thun POLO Nam, Tay Ngắn &Aacute;o Cổ Sọc, &aacute;o thun nam, &aacute;o c&aacute; sấu<br />Xuất xứ: Việt Nam<br />M&agrave;u sắc: 10 M&agrave;u: Trắng, Đen, Xanh l&aacute;, Xanh R&ecirc;u, Cam Đất, Đỏ Đ&ocirc;, Xanh Biển, X&aacute;m Kh&oacute;i, Coffee, Xanh Đen<br />Size: S, M, L, XL<br />--------------------------------------</p><p>Hướng dẫn chọn size theo chiều cao c&acirc;n nặng</p><p>Th&ocirc;ng số: <br />Size S: C&acirc;n nặng từ 53 - 60kg <br />Size M: C&acirc;n nặng từ 60 - 68kg <br />Size L: C&acirc;n nặng từ 68 - 78kg <br />Size XL: C&acirc;n nặng từ 78 - 85kg<br />--------------------------------------</p><p>V&igrave; sao n&ecirc;n mua h&agrave;ng tại Lozano</p><p>Chất lượng vải: Chất liệu thun C&aacute; Sấu 100% cotton, bề mặt mềm mịn, th&ocirc;ng tho&aacute;ng, co d&atilde;n gi&uacute;p giảm nhiệt cực nhanh. (c&oacute; thể th&ecirc;m đặc điểm m&agrave;u sắc v&agrave;o nếu &aacute;o c&oacute; những đặc điểm ri&ecirc;ng biệt)Độ d&agrave;y vừa phải đảm bảo giữ form d&aacute;ng, bền m&agrave;u sau nhiều lần giặt. Những đường may tỉ mỉ cũng l&agrave; một đặc điểm đ&aacute;ng ch&uacute; &yacute; của &aacute;o Polo b&ecirc;n Lozano, chất liệu tho&aacute;ng m&aacute;t thấm h&uacute;t mồ h&ocirc;i tốt gi&uacute;p hoạt động thoải m&aacute;i trong c&ocirc;ng việc h&agrave;ng ng&agrave;y<br />Gi&aacute; cả &aacute;o Polo b&ecirc;n shop Lozano &ldquo;hời&rdquo; nhưng chất lượng &aacute;o tốt, với ti&ecirc;u ch&iacute; đưa đến kh&aacute;ch h&agrave;ng sản phẩm chất lượng đảm bảo, gi&aacute; cả phải chăng. <br />Sự uy t&iacute;n của shop được đưa l&ecirc;n h&agrave;ng đầu. <br />D&ugrave; vậy, nhưng với lượng sản phẩm b&aacute;n đi h&agrave;ng ng&agrave;y của Lozano tại cửa h&agrave;ng v&agrave; c&aacute;c s&agrave;n thương mại điện tử rất nhiều, n&ecirc;n sẽ kh&ocirc;ng tr&aacute;nh khỏi sai s&oacute;t khi sản phẩm đến tay kh&aacute;ch h&agrave;ng. Lozano mong sự th&ocirc;ng cảm đến từ qu&yacute; kh&aacute;ch v&agrave; c&oacute; cam kết về việc đổi h&agrave;ng nếu h&agrave;ng h&oacute;a bị lỗi</p><p>CH&Uacute;NG T&Ocirc;I CAM KẾT:</p><p>Cam kết chất lượng v&agrave; mẫu quần &aacute;o giống 100% trong h&igrave;nh ảnh v&agrave; th&ocirc;ng tin m&ocirc; tả<br />Cam kết được đổi sản phẩm trong v&ograve;ng 14 ng&agrave;y <br />Li&ecirc;n hệ đổi h&agrave;ng ngay với bộ phận b&aacute;n h&agrave;ng qua hotline 0775.922.123</p><p><br />Nhận ship COD to&agrave;n quốc, với dịch vụ giao h&agrave;ng rẻ, tiết kiệm<br />Ch&uacute;ng t&ocirc;i mong qu&yacute; kh&aacute;ch khi nhận được sản phẩm sẽ đ&aacute;nh gi&aacute; ch&uacute;ng t&ocirc;i một c&aacute;ch kh&aacute;ch quan nhất dựa v&agrave;o những dấu * v&agrave; những h&igrave;nh ảnh, video cụ thể. Đ&oacute; l&agrave; những đ&oacute;ng g&oacute;p v&ocirc; c&ugrave;ng qu&yacute; gi&aacute; để Lozano VietNam c&oacute; thể thay đổi v&agrave; ho&agrave;n thiện hơn<br />Địa chỉ cửa h&agrave;ng: 1148 C&aacute;ch Mạng Th&aacute;ng 8, Phường 4, Quận T&acirc;n B&igrave;nh, TP. HCM<br />Hotline: 0775.922.123</p><p>#aothunnam #aopolo #thunpolo #aophongnam #aocobe #aonam #aothunnamcobe #thunnam #ao #polonam #aothuntay #aococtaynam #aothuntayngan #aothuncobe #aothun #aophong #aopolocosoc #aothunsoc #aopolosoc #polosoc #polotayngan #aothunpolo</p>',
        category: {
          _id: '60aba4e24efcc70f8892e1c6',
          name: 'Áo thun',
          __v: 0
        },
        image: 'https://api-ecom.duthanhduoc.com/images/8fdcc6d3-70ea-4853-954e-b8776fbab6fa.jpg',
        createdAt: '2021-05-27T10:19:22.177Z',
        updatedAt: '2024-01-13T10:22:17.460Z',
        __v: 0
      },
      createdAt: '2023-07-15T08:54:04.060Z',
      updatedAt: '2023-07-15T08:54:04.060Z',
      __v: 0
    },
    {
      _id: '64b25dfa1afc2e1a1f96b7f6',
      buy_count: 1,
      price: 399000,
      price_before_discount: 500000,
      status: -1,
      user: '64664c5b1fa7d60338bfbe4f',
      product: {
        _id: '60af6f7bf1a3041b289d8b9c',
        images: [
          'https://api-ecom.duthanhduoc.com/images/edbdcca1-7a53-47fe-b3b5-4f356992eb36.jpg',
          'https://api-ecom.duthanhduoc.com/images/6d0eac12-c3c2-40e9-b72c-27b3c4b40482.jpg',
          'https://api-ecom.duthanhduoc.com/images/3ffc6422-e0df-46c4-96f2-0c35928be981.jpg',
          'https://api-ecom.duthanhduoc.com/images/14258b71-44a4-4ee9-a2ff-cc260123660c.jpg',
          'https://api-ecom.duthanhduoc.com/images/e82ef1bc-ba16-44f9-938d-edb415e09eee.jpg',
          'https://api-ecom.duthanhduoc.com/images/9e15917b-8b10-483b-9c83-88fc8de6e554.jpg',
          'https://api-ecom.duthanhduoc.com/images/ffc043dd-60ba-48b8-ba4b-d1e8c3f5371c.jpg',
          'https://api-ecom.duthanhduoc.com/images/13cff076-860d-4e98-ad03-049eaf636930.jpg',
          'https://api-ecom.duthanhduoc.com/images/8767ce97-f0de-4f49-9c05-7571dca74edd.jpg'
        ],
        price: 399000,
        rating: 4.2,
        price_before_discount: 500000,
        quantity: 552,
        sold: 11,
        view: 3362,
        name: 'Áo Polo nam HEBOZ vải cotton pha co giãn 4 chiều đẹp in logo cao bên ngực trái cao cấp, form slimfit basic - 00000673',
        description:
          '<p>&Aacute;o Thun ngắn tay unisex Tie Dye, form oversize, vải cotton loang mầu 2SClothing.</p><p>Th&ocirc;ng tin sản phẩm<br />- Kiểu d&aacute;ng: &Aacute;o thun nam nữ oversize<br />- M&agrave;u sắc: Tie Dye Hồng<br />- Chất liệu: vải thun cotton cao cấp, độ co gi&atilde;n tốt, mềm mịn, tho&aacute;ng m&aacute;t, kh&ocirc;ng nhăn, kh&ocirc;ng x&ugrave;<br />- Đường may tỉ mỉ, chắc chắn, kh&ocirc;ng chỉ thừa<br />- Mặc ở nh&agrave;, đi học hay đi chơi hoặc khi vận động thể thao đều si&ecirc;u hợp nha. Mix cũng quần jeans, ch&acirc;n v&aacute;y,&hellip; được ngay set đồ c&aacute; t&iacute;nh<br />- Thiết kế hiện đại, trẻ trung, năng động</p><p>Th&ocirc;ng số chọn size:<br />Size S: 1m45-1m50 (41-45kg)<br />Size M: 1m50-1m60 (46-53kg)<br />Size L: 1m60-1m65 (53-62kg)<br />Size XL: 1m65- 1m75 (63-74kg)<br />Size XXL: 1m75- 1m84 (74-84kg)<br />(Bảng size mang t&iacute;nh chất tham khảo v&agrave; ph&ugrave; hợp 80-90% sở th&iacute;ch mặc của bạn. C&aacute;c bạn muốn chọn size ph&ugrave; hợp c&oacute; thể inbox cho shop nh&eacute;)</p><p>Hướng dẫn sử dụng sản phẩm:<br />- Lần đầu đem về chỉ xả nước lạnh rồi phơi kh&ocirc; để đảm bảo chất in tr&ecirc;n &aacute;o kh&ocirc;ng bong tr&oacute;c nh&eacute;<br />- Nhớ lộn tr&aacute;i &aacute;o khi giặt v&agrave; kh&ocirc;ng giặt ng&acirc;m<br />- Kh&ocirc;ng giặt m&aacute;y trong 10 ng&agrave;y đầu<br />- Kh&ocirc;ng sử dụng thuốc tẩy<br />- Khi phơi lộn tr&aacute;i v&agrave; kh&ocirc;ng phơi trực tiếp dưới &aacute;nh nắng mặt trời</p><p>2S Clothing XIN CAM KẾT:<br />+ Sản phẩm chất lượng, giống h&igrave;nh, giống m&ocirc; tả 100%<br />+ &Aacute;o được kiểm tra kĩ c&agrave;ng, cẩn thận v&agrave; tư vấn nhiệt t&igrave;nh trước khi g&oacute;i h&agrave;ng giao cho qu&yacute; kh&aacute;ch<br />+ Ho&agrave;n tiền 100% nếu sản phẩm lỗi, kh&ocirc;ng giống với m&ocirc; tả.<br />+ Chấp nhận đổi h&agrave;ng khi size kh&ocirc;ng vừa<br />+ H&agrave;ng c&oacute; sẵn, giao h&agrave;ng ngay khi nhận được đơn đặt h&agrave;ng<br />+ Giao h&agrave;ng to&agrave;n quốc, thanh to&aacute;n khi nhận h&agrave;ng (ship COD)</p><p>Hỗ trợ đổi trả theo quy định của Shopee<br />1. Điều kiện &aacute;p dụng đổi sản phẩm (trong v&ograve;ng 07 ng&agrave;y kể từ khi nhận sản phẩm)<br />- H&agrave;ng ho&aacute; vẫn c&ograve;n mới nguy&ecirc;n tem m&aacute;c, chưa qua sử dụng<br />- H&agrave;ng ho&aacute; bị lỗi hoặc hư hỏng do vận chuyển hoặc do nh&agrave; sản xuất<br />2. Trường hợp kh&ocirc;ng đủ điều kiện &aacute;p dụng ch&iacute;nh s&aacute;ch:<br />- Qu&aacute; 07 ng&agrave;y kể từ khi Qu&yacute; kh&aacute;ch nhận h&agrave;ng từ shopee<br />- Gửi lại h&agrave;ng kh&ocirc;ng đ&uacute;ng mẫu m&atilde;, kh&ocirc;ng phải sản phẩm của 2S Clothing<br />- Kh&ocirc;ng th&iacute;ch, kh&ocirc;ng hợp, đặt nhầm m&atilde;, nhầm m&agrave;u, y&ecirc;u cầu kiểm tra h&agrave;ng trước khi thanh to&aacute;n.</p><p>Lưu &Yacute;:<br />H&igrave;nh ảnh sản phẩm ho&agrave;n to&agrave;n do shop tự chụp, với m&agrave;n h&igrave;nh v&agrave; điều kiện &aacute;nh s&aacute;ng kh&aacute;c nhau, m&agrave;u sắc thực tế của sản phẩm c&oacute; thể ch&ecirc;nh lệch<br />Trong trường hợp nhận được c&aacute;c sản phẩm c&oacute; vấn đề kh&ocirc;ng đ&aacute;ng kể v&iacute; dụ như bề mặt hơi bẩn c&oacute; thể hết sau khi giặt, c&oacute; chỉ thừa... ch&uacute;ng t&ocirc;i hy vọng bạn c&oacute; thể tự m&igrave;nh giải quyết c&aacute;c vấn đề đ&oacute;. Nếu bạn l&agrave; người cầu to&agrave;n v&agrave; sẽ bận t&acirc;m về c&aacute;c vấn đề đ&oacute;, mong bạn c&acirc;n nhắc cẩn thận trước khi đặt sản phẩm<br />Nếu bạn c&oacute; bất kỳ y&ecirc;u cầu g&igrave;, xin vui l&ograve;ng li&ecirc;n hệ với ch&uacute;ng t&ocirc;i</p><p>Cảm ơn &hearts; Tr&acirc;n trọng<br />Th&ocirc;ng tin li&ecirc;n hệ của shop c&oacute; trong phần m&ocirc; tả shop <br />___________ ++++++++++ _____________</p><p>#&aacute;othunngắntay<br />#&aacute;o_thun_ngắn_tay<br />#ao_thun_ngan_tay<br />#&aacute;othuntaylỡ<br />#&aacute;o_thun_tay_lỡ<br />#aothuntaylo<br />#ao_thun_tay_lo<br />#&aacute;o_form_rộng<br />#aoformrong<br />#ao_form_rong<br />#thuntayngắn<br />#thun_tay_ngắn<br />#thuntayngan<br />#thun_tay_ngan<br />#2sclothing<br />#&aacute;o_thun_nữ<br />#&Aacute;othunnữ</p>',
        category: {
          _id: '60aba4e24efcc70f8892e1c6',
          name: 'Áo thun',
          __v: 0
        },
        image: 'https://api-ecom.duthanhduoc.com/images/edbdcca1-7a53-47fe-b3b5-4f356992eb36.jpg',
        createdAt: '2021-05-27T10:07:55.092Z',
        updatedAt: '2024-01-13T10:02:36.238Z',
        __v: 0
      },
      createdAt: '2023-07-15T08:51:06.977Z',
      updatedAt: '2023-07-15T08:51:06.977Z',
      __v: 0
    },
    {
      _id: '64b25d441afc2e1a1f96b7f5',
      buy_count: 1,
      price: 2130000,
      price_before_discount: 2690000,
      status: -1,
      user: '64664c5b1fa7d60338bfbe4f',
      product: {
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
        description:
          '<p>Th&ocirc;ng số kĩ thuật<br />X&aacute;m Hạt Ti&ecirc;u - Xanh Bạc H&agrave;<br />M&agrave;n h&igrave;nh rộng<br />K&iacute;ch thước m&agrave;n h&igrave;nh 6.5<br />C&ocirc;ng nghệ m&agrave;n h&igrave;nh: Tấm nền m&agrave;n h&igrave;nh LCD<br />Độ ph&acirc;n giải: Độ ph&acirc;n giải m&agrave;n h&igrave;nh 1600*720, HD+, tỷ lệ hiển thị m&agrave;n h&igrave;nh l&ecirc;n đến 88%<br />M&agrave;u sắc của m&agrave;n h&igrave;nh 16.7 triệu m&agrave;u<br />Mặt k&iacute;nh cảm ứng: Loại k&iacute;nh cảm ứng Corning Gorilla Glass 3<br />Chụp ảnh<br />Camera sau: Camera ch&iacute;nh: 13MP f/2.2 Camera ch&acirc;n dung: 2MP f/2.4<br />Quay phim<br />Độ ph&acirc;n giải video quay phim Quay video 1080@30fps 720@30fps<br />Chụp ảnh n&acirc;ng cao<br />C&aacute;c t&iacute;nh năng chụp: Panorama, beauty AI 2.0, ch&acirc;n dung, chụp đ&ecirc;m, chuy&ecirc;n gia<br />Camera trước 5 MP, f/2.4<br />Đ&egrave;n Flash<br />T&iacute;nh năng chụp ảnh camera trước: <br />C&aacute;c t&iacute;nh năng chụp: L&agrave;m đẹp, Bộ lọc m&agrave;u, HDR, Selfie to&agrave;n cảnh, Ch&acirc;n dung, Timelapse, chụp h&igrave;nh bằng cử chỉ<br />Hệ điều h&agrave;nh: Realme UI 1.0<br />Loại CPU (Chipset) Helio G35 Cortex A53 8 nh&acirc;n 64 bit, xung nhịp l&ecirc;n đến 2.3 GHz<br />Tốc độ CPU: 8 nh&acirc;n, 2.3 GHz<br />Chip đồ hoạ: (GPU) GE8320<br />RAM: 2GB<br />Bộ nhớ trong: 32GB<br />Thẻ nhớ ngo&agrave;i Micro SD<br />Hỗ trợ thẻ tối đa 256GB</p><p>Loại SIM Dual-SIM (Nano SIM)<br />Hỗ trợ 4G <br />Chuẩn Wifi: 2.4GHz, 802.1.1b/g/n<br />Jack tai nghe 3.5mm<br />C&ocirc;̉ng k&ecirc;́t n&ocirc;́i/sạc: Kết nối với m&aacute;y t&iacute;nh qua cổng USB hoặc sạc cho m&aacute;y: Micro USB<br />Hỗ trợ kết nối kh&aacute;c: OTG<br />Thực thiện cuộc gọi: Quay số thủ c&ocirc;ng, Trợ l&yacute; Google<br />Thiết kế &amp; Trọng lượng <br />Thiết kế<br />Thiết kế m&aacute;y: Nguy&ecirc;n khối, Pin rời, Pin liền,... Nguy&ecirc;n khối<br />Chất liệu<br />Chất liệu được sử dụng để sản xuất vỏ m&aacute;y (nhựa, nh&ocirc;m....) Nhựa 3D cao cấp<br />K&iacute;ch thước<br />Đ&Uacute;NG CHUẨN (Đơn vị, dấu chấm, dấu c&aacute;ch): D&agrave;i 151.5 mm - Ngang 74.9 mm - D&agrave;y 8.1 mm164.4 x 75.9 x 9.1mm<br />Trọng lượng Khoảng 196g bao gồm Pin<br />Pin &amp; Dung lượng <br />Loại pin<br />T&ecirc;n h&atilde;ng v&agrave; t&ecirc;n pin: Li-po<br />Dung lượng pin 5000mAh<br />C&ocirc;ng nghệ pin<br />C&ocirc;ng nghệ pin đi k&egrave;m: Sạc nhanh, QuickCharge, VOOC, Tiết kiệm pin, Si&ecirc;u tiết kiệm pin,...5V2A, 10W, hỗ trợ sạc ngược với c&aacute;p OTG<br />Tiện &iacute;ch <br />Bảo mật n&acirc;ng cao<br />Bảo mật mở kho&aacute; m&aacute;y: Khu&ocirc;n mặt, Face ID, Mống mắt<br />Mở kho&aacute; nhận diện gương mặt trong 0,91s<br />T&iacute;nh năng đặc biệt<br />C&aacute;c chức năng kh&aacute;c của điện thoại: AOD, Sạc pin nhanh, Nh&acirc;n bản ứng dụng, Chặn cuộc gọi, Đ&egrave;n pin, kh&aacute;ng nước kh&aacute;ng bụi, chạm 2 lần mở kh&oacute;a...4G - LTE <br />Bluetooth 5.0 <br />C&ocirc;ng nghệ sạc ngược<br />Ghi &acirc;m m&ocirc;i trường: C&oacute; ứng dụng ghi &acirc;m mặc định tr&ecirc;n m&aacute;y v&agrave; c&oacute; mic chống ồn kh&ocirc;ng? C&oacute;<br />Ghi &acirc;m cuộc gọi C&oacute;<br />Xem phim: Định dạng phim hỗ trợ xem được: mp4, .3gp, .3g2, .3gpp, .3gpp2, .m4v , .mkv<br />Xem phim: L&ecirc;n đến 9 giờ li&ecirc;n tục<br />Nghe nhạc: Định dạng &acirc;m thanh hỗ trợ nghe được: MP3, Lossless, WAV,... AAC,HE-AAC v1, HE-AAC v2,AMR,AWB,MIDI,MP3,OGG VORBIS<br />Nghe nhạc: L&ecirc;n đến 40 giờ li&ecirc;n tục<br />Danh bạ: Bộ nhớ m&aacute;y chứa được tối đa bao nhi&ecirc;u số danh bạKh&ocirc;ng c&oacute; dữ liệu<br />Radio: C&oacute; ứng dụng radio FM mặc định tr&ecirc;n m&aacute;y kh&ocirc;ng? C&oacute; cần tai nghe để sử dụng Radio kh&ocirc;ng?: Kh&ocirc;ng<br />Bộ sản phẩm gồm: Sạc ,S&aacute;ch hướng dẫn ,Hộp, C&aacute;p sạc.</p><p>Th&ocirc;ng tin bảo h&agrave;nh<br />Sản phẩm được bảo h&agrave;nh 12 th&aacute;ng tại c&aacute;c trung t&acirc;m bảo h&agrave;nh Realme<br />1 đổi 1 trong 30 ng&agrave;y đầu sử dụng (Lỗi sản xuất).<br />Giao h&agrave;ng miễn ph&iacute; tr&ecirc;n to&agrave;n quốc.<br />Hotline: 1800 6067 (miễn ph&iacute;)</p>',
        category: {
          _id: '60afafe76ef5b902180aacb5',
          name: 'Điện thoại',
          __v: 0
        },
        image: 'https://api-ecom.duthanhduoc.com/images/51ef469d-0eb5-48fb-958d-ce2b9c664adc.jpg',
        createdAt: '2021-05-27T14:48:45.577Z',
        updatedAt: '2024-01-13T15:05:01.992Z',
        __v: 0
      },
      createdAt: '2023-07-15T08:48:04.721Z',
      updatedAt: '2023-07-15T08:48:04.721Z',
      __v: 0
    },
    {
      _id: '64af6b431afc2e1a1f96b617',
      buy_count: 5,
      price: 199000,
      price_before_discount: 250000,
      status: -1,
      user: '64664c5b1fa7d60338bfbe4f',
      product: {
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
        view: 5681,
        name: 'Đồng Hồ Nam FNGEEN Dây Thép Cao Cấp Không Gỉ, Có Lịch Ngày, Phong Cách Doanh Nhân Sang Trọng',
        description:
          '<p>TH&Ocirc;NG TIN VỀ SẢN PHẨM<br />Lời khẳng định của FNGEEN khi sản xuất d&ograve;ng đồng hồ n&agrave;y l&agrave; &ldquo;Gi&aacute; rẻ - Chất lượng kh&ocirc;ng hề rẻ&rdquo;. Đồng hồ được thiết kế sang trọn, qu&yacute; ph&aacute;i với những đường n&eacute;t mạng mẽ, mang lại phong c&aacute;ch quyến rũ cho c&aacute;c qu&yacute; &ocirc;ng.</p><p>Sản phẩm đồng hồ nam thời trang FNGEEN với mặt đồng hồ được thiết kế đơn giản, tinh tế, to&aacute;t l&ecirc;n sự thanh lịch, sang trọng nhưng kh&ocirc;ng k&eacute;m phần thời trang, khỏe khoắn, c&aacute; t&iacute;nh<br />- Mặt đồng hồ tr&ograve;n, thiết kế đẹp mắt, s&aacute;ng b&oacute;ng với t&iacute;nh năng hiện đại cho ph&aacute;i mạnh tự tin, mạng mẽ v&agrave; thời trang<br />- Ngo&agrave;i ra mặt đồng hồ c&ograve;n được sử dụng chất liệu k&iacute;nh kho&aacute;ng cao cấp gi&uacute;p chịu lực tốt, bền đẹp v&agrave; dễ d&agrave;ng theo d&otilde;i từng chuyển động.<br />- D&acirc;y th&eacute;p kh&ocirc;ng gỉ thiết kế &ocirc;m tay, sang b&oacute;ng.<br />- Khả năng chống thấm cho ph&eacute;p bạn y&ecirc;n t&acirc;m khi rửa tay hay đi mưa</p><p>- Thương hiệu: FNGEEN<br />- Sản xuất tại: Hồng K&ocirc;ng<br />- Kiểu m&aacute;y: Quartz, M&aacute;y Nhật<br />- D&agrave;nh cho: Nam<br />- K&iacute;ch thước mặt: 41 mm x 10 mm<br />- K&iacute;ch thước d&acirc;y: D&agrave;i x rộng: 24 x 2.0 cm<br />- Độ ch&iacute;nh x&aacute;c: +- 20 gi&acirc;y 1 th&aacute;ng<br />- Số kim: 3 kim chạy, (c&aacute;c kim nhỏ trang tr&iacute;)<br />_ Chịu nước: 3ATM đi mưa rửa tay<br />_ Bảo h&agrave;nh 12 th&aacute;ng</p><p>❤ D&agrave;nh tặng Voucher giảm 10% khi mua sản phẩm của shop cho những kh&aacute;ch h&agrave;ng th&acirc;n thiết. (Kh&aacute;ch h&agrave;ng mua tr&ecirc;n 3 đơn h&agrave;ng hoặc đơn h&agrave;ng trị gi&aacute; 500k trở l&ecirc;n)<br />❤ Quy định Bảo h&agrave;nh: đổi trả trong 7 ng&agrave;y nếu h&agrave;ng bị lỗi do nh&agrave; sản xuất như l&agrave; hết pin, rớt kim, hư kh&oacute;a, đồng hồ kh&ocirc;ng chạy. <br />Bảo h&agrave;nh pin v&agrave; m&aacute;y trong 6 th&aacute;ng. Bị bất cứ vấn đề g&igrave; bạn cứ inbox shop sẽ lu&ocirc;n tư vấn v&agrave; hỗ trợ bạn<br />❤ Thời gian giao h&agrave;ng : từ 1-5 ng&agrave;y t&ugrave;y tỉnh , huyện hay nội th&agrave;nh Giao nội tỉnh HCM &ndash; HN thường nhanh hơn, tỉnh v&agrave; huyện thường l&acirc;u hơn 1 ch&uacute;t <br />❤ Về size , d&acirc;y đồng hồ ph&ugrave; hợp cho kh&aacute;ch : Tất cả đồng hồ tại shop kh&aacute;ch đều c&oacute; thể cắt ( gỡ mắt) cho vừa với tay kh&aacute;ch nh&eacute; . Nếu kh&ocirc;ng tự l&agrave;m ở nh&agrave; được th&igrave; kh&aacute;ch c&oacute; thể mang ra quầy đồng hồ gần nhất, thợ sẽ cắt cho kh&aacute;ch. Ph&iacute; tầm 10k VND<br />#A97</p>',
        category: {
          _id: '60afacca6ef5b902180aacaf',
          name: 'Đồng hồ',
          __v: 0
        },
        image: 'https://api-ecom.duthanhduoc.com/images/37256021-1e7c-40f4-8e0f-d665f7cb95bd.jpg',
        createdAt: '2021-05-27T14:37:04.282Z',
        updatedAt: '2024-01-13T15:21:12.377Z',
        __v: 0
      },
      createdAt: '2023-07-13T03:10:59.113Z',
      updatedAt: '2023-07-15T08:51:21.805Z',
      __v: 0
    },
    {
      _id: '64aec2301afc2e1a1f96b5d2',
      buy_count: 4,
      price: 20990000,
      price_before_discount: 26990000,
      status: -1,
      user: '64664c5b1fa7d60338bfbe4f',
      product: {
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
        view: 20966,
        name: 'Điện thoại Apple Iphone 12 64GB - Hàng chính hãng VNA',
        description:
          '<p>H&agrave;ng Ch&iacute;nh h&atilde;ng m&atilde; VN/A, mới 100%, chưa k&iacute;ch hoạt</p><p>iPhone 12 64GB- Sự n&acirc;ng cấp chỉnh chu cho thế hệ tiền nhiệm<br />M&agrave;n h&igrave;nh iPhone 12 64GB - N&acirc;ng cấp đ&aacute;ng gi&aacute; từ tấm nền OLED<br />Hai năm qua, Apple vẫn trung th&agrave;nh với tấm nền IPS LCD d&agrave;nh cho c&aacute;c phi&ecirc;n bản điện thoại gi&aacute; rẻ. Trong đ&oacute;, iPhone XR, iPhone 11 v&agrave; thậm ch&iacute; l&agrave; SE 2020 l&agrave; những đại diện ti&ecirc;u biểu. Thế nhưng, điều n&agrave;y sẽ thay đổi khi m&agrave; giờ đ&acirc;y, thế hệ kế nhiệm đ&atilde; được n&acirc;ng cấp l&ecirc;n tấm nền OLED sắc n&eacute;t.</p><p>iPhone 12 64GB sở hữu m&agrave;n h&igrave;nh 6,1 inch (tương tự XR v&agrave; 11) với tấm nền OLED XDR tương tự c&aacute;c bản cao cấp. Ngo&agrave;i ra, một điểm nổi bật kh&ocirc;ng thể kh&ocirc;ng nhắc đến ch&iacute;nh l&agrave; việc n&acirc;ng cấp độ ph&acirc;n giải chuẩn HD+ vốn bị c&aacute;c fan đ&aacute;nh gi&aacute; k&eacute;m qua hai thế hệ l&ecirc;n chuẩn Full HD+. Do đ&oacute;, Cupertino đ&atilde; ch&iacute;nh thức thay đổi điểm yếu cố hữu tr&ecirc;n c&aacute;c phi&ecirc;n bản gi&aacute; rẻ của h&atilde;ng. Ngay cả bản 5,4 inch cũng được trang bị tấm nền OLED Super Retina.</p><p>Ngo&agrave;i ra, theo c&ocirc;ng bố của h&atilde;ng, m&agrave;n h&igrave;nh của thế hệ mới sẽ c&oacute; độ s&aacute;ng l&ecirc;n tới 1200 knits v&agrave; hỗ trợ c&aacute;c c&ocirc;ng nghệ HDR v&agrave; Dolby Vision. Đặc biệt, lớp k&iacute;nh sẽ được phủ một lớp &ldquo;Ceramic Shield&rdquo; gi&uacute;p m&aacute;y cứng c&aacute;p v&agrave; sống s&oacute;t cao hơn trong những t&igrave;nh huống &ldquo;tiếp đất&rdquo;.</p><p>Thiết kế iPhone 12 64GB mang n&eacute;t ho&agrave;i cổ<br />Năm nay c&aacute;c sản phẩm &ldquo;t&aacute;o khuyết&rdquo; đều sở hữu chung ng&ocirc;n ngữ thiết kế. Đ&oacute; l&agrave; sự kết hợp giữa iPhone 11 v&agrave; iPhone 5 với c&aacute;c cạnh viền được l&agrave;m vu&ocirc;ng vức hơn. Mặt trước vẫn l&agrave; m&agrave;n h&igrave;nh với notch &ldquo;tai thỏ&rdquo; chứa camera selfie v&agrave; Face ID. Thiết kế n&agrave;y khiến series smartphone năm nay của nh&agrave; T&aacute;o tr&ocirc;ng sang trọng v&agrave; mang d&aacute;ng dấp ho&agrave;i cổ từ ng&ocirc;n ngữ thiết kế của thế hệ thứ 5 trước đ&acirc;y.<br />C&ograve;n mặt sau của m&aacute;y vẫn sẽ l&agrave; một cụm m&aacute;y ảnh k&eacute;p đặt trong khung vu&ocirc;ng tương tự như thế hệ năm 2019. Do l&agrave; bản ti&ecirc;u chuẩn, thiết bị sẽ c&oacute; khung l&agrave;m từ nh&ocirc;m thay v&igrave; bằng th&eacute;p kh&ocirc;ng gỉ như bản cao cấp.</p><p>Hiệu năng iPhone 12 64GB mạnh mẽ<br />Cung cấp sức mạnh cho m&aacute;y ch&iacute;nh l&agrave; chip A14 Bionic. Theo c&ocirc;ng bố của Cupertino, A14 l&agrave; vi xử l&yacute; c&oacute; tới 6 nh&acirc;n CPU, chứa hơn 11,8 tỷ b&oacute;ng b&aacute;n dẫn, hứa hẹn sẽ cho hiệu năng hơn khoảng 40% so với A13. Điểm số benchmark của một mẫu m&aacute;y cũng sở hữu chipset n&agrave;y l&agrave; iPad Air 4 đ&atilde; cho thấy A14 thật sự vượt trội. Điểm số đơn nh&acirc;n 1583 va đa nh&acirc;n l&agrave; 4918, chỉ thua k&eacute;m một ch&uacute;t so với A12Z tr&ecirc;n iPad Pro 2020.<br />Ngo&agrave;i ra, nh&agrave; T&aacute;o c&ograve;n trang bị th&ecirc;m chip U1 với băng tần rộng (ultra-wideband) cho ph&eacute;p định vị vị tr&iacute; th&ocirc;ng qua AirDrop v&agrave; kết nối c&aacute;c thiết bị c&ugrave;ng hệ sinh th&aacute;i trong gia đ&igrave;nh</p><p>Camera iPhone 12 64GB - Thay đổi đến từ b&ecirc;n trong <br />Du l&agrave; thế hệ kế nhiệm iPhone 11, thế nhưng thiết bị n&agrave;y kh&ocirc;ng c&oacute; cải tiến nhiều về m&aacute;y ảnh. M&aacute;y vẫn sở hữu cụm camera k&eacute;p với 2 cảm biến 12MP (1 g&oacute;c rộng v&agrave; 1 g&oacute;c si&ecirc;u rộng). Apple đ&atilde; sắp xếp lại v&agrave; bổ sung th&ecirc;m thấu k&iacute;nh để cho chất lượng ảnh chụp trong v&agrave; sắc n&eacute;t hơn.</p>',
        category: {
          _id: '60afafe76ef5b902180aacb5',
          name: 'Điện thoại',
          __v: 0
        },
        image: 'https://api-ecom.duthanhduoc.com/images/a7fb7a18-743a-42bb-bead-36370c1d1aba.jpg',
        createdAt: '2021-05-27T14:50:45.708Z',
        updatedAt: '2024-01-13T15:12:17.800Z',
        __v: 0
      },
      createdAt: '2023-07-12T15:09:36.182Z',
      updatedAt: '2023-08-14T15:55:19.603Z',
      __v: 0
    }
  ]
};

const purchasesRequest = http.get(`${config.baseUrl}/purchases`, ({ request }) => {
  const url = new URL(request.url);
  url.searchParams.set('status', '-1');
  return HttpResponse.json(pruchasesResponse, { status: HttpStatusCode.Ok });
});

const purchasesRestHandler = [purchasesRequest];

export default purchasesRestHandler;
