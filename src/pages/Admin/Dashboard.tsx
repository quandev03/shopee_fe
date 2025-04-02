import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Statistic, Typography, DatePicker, 
  Table, Button, List, Tag, Space, Progress
} from 'antd';
import {
  DollarOutlined, UserOutlined, ShoppingOutlined, 
  AppstoreOutlined, ArrowUpOutlined, ArrowDownOutlined,
  ClockCircleOutlined, WarningOutlined, TagOutlined
} from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Link } from 'react-router-dom';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    setLoading(true);
    
    // Giả lập API call
    setTimeout(() => {
      const data = {
        stats: {
          totalRevenue: 350000000,
          totalOrders: 120,
          totalUsers: 85,
          totalProducts: 150,
          pendingOrders: 15,
          lowStockProducts: 8
        },
        recentOrders: [
          { id: 'DH001', customerName: 'Nguyễn Văn A', total: 2500000, status: 'pending', date: '2023-05-20 10:30:00' },
          { id: 'DH002', customerName: 'Trần Thị B', total: 3700000, status: 'confirmed', date: '2023-05-19 14:20:00' },
          { id: 'DH003', customerName: 'Lê Văn C', total: 15000000, status: 'shipping', date: '2023-05-18 09:15:00' },
          { id: 'DH004', customerName: 'Phạm Thị D', total: 800000, status: 'delivered', date: '2023-05-15 16:45:00' },
          { id: 'DH005', customerName: 'Hoàng Văn E', total: 5000000, status: 'cancelled', date: '2023-05-14 11:10:00' },
        ],
        salesData: [
          { date: '2023-05-14', revenue: 12000000 },
          { date: '2023-05-15', revenue: 15000000 },
          { date: '2023-05-16', revenue: 8000000 },
          { date: '2023-05-17', revenue: 10000000 },
          { date: '2023-05-18', revenue: 16000000 },
          { date: '2023-05-19', revenue: 20000000 },
          { date: '2023-05-20', revenue: 18000000 },
        ],
        lowStockProducts: [
          { id: 1, name: 'iPhone 13', stock: 2, minStock: 5, image: 'https://example.com/img1.jpg' },
          { id: 2, name: 'Samsung Galaxy S22', stock: 3, minStock: 5, image: 'https://example.com/img2.jpg' },
          { id: 3, name: 'Tai nghe Bluetooth', stock: 4, minStock: 10, image: 'https://example.com/img4.jpg' },
          { id: 4, name: 'Ốp lưng Samsung', stock: 5, minStock: 20, image: 'https://example.com/img3.jpg' },
        ]
      };
      
      setDashboardData(data);
      setLoading(false);
    }, 500);
  };
  
  const renderStatusTag = (status) => {
    let color = '';
    let text = '';
    
    switch (status) {
      case 'pending':
        color = 'gold';
        text = 'Chờ xác nhận';
        break;
      case 'confirmed':
        color = 'blue';
        text = 'Đã xác nhận';
        break;
      case 'shipping':
        color = 'cyan';
        text = 'Đang vận chuyển';
        break;
      case 'delivered':
        color = 'green';
        text = 'Đã giao hàng';
        break;
      case 'cancelled':
        color = 'red';
        text = 'Đã hủy';
        break;
      default:
        color = 'default';
        text = 'Không xác định';
    }
    
    return <Tag color={color}>{text}</Tag>;
  };
  
  const revenueChartData = dashboardData ? {
    labels: dashboardData?.salesData?.map(item => moment(item.date).format('DD/MM')),
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: dashboardData?.salesData ? dashboardData.salesData.map(item => item.revenue) : [],
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4
      }
    ]
  } : null;

  const recentOrderColumns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total) => new Intl.NumberFormat('vi-VN').format(total) + ' đ',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: renderStatusTag,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  if (loading || !dashboardData) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <Title level={2}>Dashboard</Title>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={dashboardData.stats.totalRevenue}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="đ"
              formatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">
                <ArrowUpOutlined style={{ color: '#3f8600' }} /> 12% so với tháng trước
              </Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={dashboardData.stats.totalOrders}
              valueStyle={{ color: '#1677ff' }}
              prefix={<ShoppingOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Button
                type="link"
                size="small"
                onClick={() => navigate('/admin/orders')}
              >
                <ClockCircleOutlined /> {dashboardData.stats.pendingOrders} đơn đang chờ xử lý
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={dashboardData.stats.totalUsers}
              valueStyle={{ color: '#722ed1' }}
              prefix={<UserOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">
                <ArrowUpOutlined style={{ color: '#3f8600' }} /> 8% so với tháng trước
              </Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={dashboardData.stats.totalProducts}
              valueStyle={{ color: '#fa541c' }}
              prefix={<AppstoreOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Button
                type="link"
                size="small"
                danger
                onClick={() => navigate('/admin/products')}
              >
                <WarningOutlined /> {dashboardData?.stats?.lowStockProducts} sản phẩm sắp hết hàng
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card
            title="Quản lý Voucher"
            extra={
              <Link to="/admin/vouchers">
                <Button type="primary" icon={<TagOutlined />}>
                  Quản lý Vouchers
                </Button>
              </Link>
            }
          >
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Tổng số voucher đang hoạt động"
                  value={10}
                  valueStyle={{ color: '#eb2f96' }}
                  prefix={<TagOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Voucher đã sử dụng trong tháng"
                  value={150}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<TagOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card title="Doanh thu 7 ngày gần nhất">
            {revenueChartData ? (
              <Line data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            ) : (
              <Text type="secondary">Không có dữ liệu doanh thu</Text>
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Sản phẩm sắp hết hàng" extra={<Button type="link" onClick={() => navigate('/admin/products')}>Xem tất cả</Button>}>
            <List
              itemLayout="horizontal"
              dataSource={dashboardData?.lowStockProducts}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<img src={item?.image} alt={item?.name} style={{ width: 40, height: 40, objectFit: 'cover' }} />}
                    title={item?.name}
                    description={
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text type="danger">Còn {item?.stock} sản phẩm</Text>
                        <Progress
                          percent={Math.round((item?.stock / item?.minStock) * 100)}
                          status="exception"
                          showInfo={false}
                          size="small"
                        />
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Đơn hàng gần đây" style={{ marginTop: 16 }} extra={<Button type="link" onClick={() => navigate('/admin/orders')}>Xem tất cả</Button>}>
        <Table
          columns={recentOrderColumns}
          dataSource={dashboardData?.recentOrders}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Dashboard;