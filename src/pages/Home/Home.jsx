import React from 'react';
import { Typography, Carousel, Card, Row, Col, Button } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const Home = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <Carousel autoplay>
        <div>
          <div className="h-80 bg-orange-100 flex items-center justify-center">
            <img src="https://cf.shopee.vn/file/vn-50009109-927316f8318a416e59ac6638c6437e63_xxhdpi" alt="Banner 1" className="max-h-full" />
          </div>
        </div>
        <div>
          <div className="h-80 bg-blue-100 flex items-center justify-center">
            <img src="https://cf.shopee.vn/file/vn-50009109-7e5485713dcf7e689b81f9fef89c6d9a_xxhdpi" alt="Banner 2" className="max-h-full" />
          </div>
        </div>
      </Carousel>

      <div className="my-8">
        <Title level={2}>Sản phẩm nổi bật</Title>
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item}>
              <Link to={`/products/${item}`}>
                <Card
                  hoverable
                  cover={<img alt={`Product ${item}`} src={`https://via.placeholder.com/300x300?text=Product+${item}`} />}
                >
                  <Card.Meta title={`Sản phẩm ${item}`} description={`Giá: ${(item * 100000).toLocaleString('vi-VN')}đ`} />
                  <Button 
                    type="primary" 
                    icon={<ShoppingOutlined />} 
                    className="mt-4 w-full bg-orange-500 hover:bg-orange-600"
                  >
                    Mua ngay
                  </Button>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Home; 