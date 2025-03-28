import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Statistic, Typography, DatePicker, 
  Table, Button, List, Tag, Space, Progress, Select, Divider
} from 'antd';
import {
  DollarOutlined, UserOutlined, ShoppingOutlined, 
  AppstoreOutlined, ArrowUpOutlined, ArrowDownOutlined,
  ClockCircleOutlined, WarningOutlined, LineChartOutlined, FilterOutlined
} from '@ant-design/icons';
import { Line, Pie, Bar } from 'react-chartjs-2';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const SalesManagement = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [dateRange, setDateRange] = useState([moment().startOf('week'), moment().endOf('week')]);
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
        ],
        categoryData: [
          { category: 'Điện thoại', revenue: 100000000 },
          { category: 'Laptop', revenue: 75000000 },
          { category: 'Tai nghe', revenue: 50000000 },
          { category: 'Ốp lưng', revenue: 30000000 },
          { category: 'Phụ kiện', revenue: 25000000 },
        ],
        topProducts: [
          { id: 1, name: 'iPhone 13', totalSold: 50, revenue: 10000000 },
          { id: 2, name: 'Samsung Galaxy S22', totalSold: 40, revenue: 8000000 },
          { id: 3, name: 'Tai nghe Bluetooth', totalSold: 30, revenue: 6000000 },
          { id: 4, name: 'Ốp lưng Samsung', totalSold: 25, revenue: 5000000 },
          { id: 5, name: 'Phụ kiện điện thoại', totalSold: 20, revenue: 4000000 },
        ],
        topCustomers: [
          { id: 1, name: 'Nguyễn Văn A', orderCount: 10, totalSpent: 2000000 },
          { id: 2, name: 'Trần Thị B', orderCount: 8, totalSpent: 1500000 },
          { id: 3, name: 'Lê Văn C', orderCount: 6, totalSpent: 1000000 },
          { id: 4, name: 'Phạm Thị D', orderCount: 5, totalSpent: 750000 },
          { id: 5, name: 'Hoàng Văn E', orderCount: 4, totalSpent: 500000 },
        ]
      };
      
      setDashboardData(data);
      setLoading(false);
    }, 500);
  };
  
  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    if (value === 'custom') {
      setDateRange([moment().startOf('day'), moment().endOf('day')]);
    } else {
      setDateRange([moment().startOf(value), moment().endOf(value)]);
    }
  };
  
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };
  
  const revenueChartData = {
    labels: dashboardData.salesData.map(item => moment(item.date).format('DD/MM')),
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: dashboardData.salesData.map(item => item.revenue),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };
  
  const orderChartData = {
    labels: dashboardData.salesData.map(item => moment(item.date).format('DD/MM')),
    datasets: [
      {
        label: 'Số đơn hàng',
        data: dashboardData.salesData.map(item => item.orderCount),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      }
    ]
  };
  
  const categoryChartData = {
    labels: dashboardData.categoryData.map(item => item.category),
    datasets: [
      {
        label: 'Doanh thu theo danh mục',
        data: dashboardData.categoryData.map(item => item.revenue),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const productColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={record.image} 
            alt={text} 
            style={{ width: 40, height: 40, marginRight: 10, objectFit: 'cover' }} 
          />
          <span>{text}</span>
        </div>
      )
    },
    {
      title: 'Số lượng đã bán',
      dataIndex: 'totalSold',
      key: 'totalSold',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => new Intl.NumberFormat('vi-VN').format(value) + ' đ',
    },
  ];

  const customerColumns = [
    {
      title: 'Khách hàng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số đơn hàng',
      dataIndex: 'orderCount',
      key: 'orderCount',
    },
    {
      title: 'Tổng chi tiêu',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (value) => new Intl.NumberFormat('vi-VN').format(value) + ' đ',
    },
  ];

  return (
    <div>
      <Title level={2}>Quản lý Doanh thu</Title>
      
      <div style={{ marginBottom: 20 }}>
        <Row gutter={16} align="middle">
          <Col span={4}>
            <Text strong>Thời gian:</Text>
          </Col>
          <Col span={6}>
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              style={{ width: 200 }}
            >
              <Option value="week">7 ngày qua</Option>
              <Option value="month">30 ngày qua</Option>
              <Option value="year">365 ngày qua</Option>
              <Option value="custom">Tùy chỉnh</Option>
            </Select>
          </Col>
          <Col span={10}>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={4}>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={fetchDashboardData}
            >
              Áp dụng
            </Button>
          </Col>
        </Row>
      </div>
      
      <Row gutter={16}>
        <Col span={8}>
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
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={dashboardData.stats.totalOrders}
              valueStyle={{ color: '#1677ff' }}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Giá trị đơn hàng trung bình"
              value={dashboardData.stats.totalOrders ? Math.round(dashboardData.stats.totalRevenue / dashboardData.stats.totalOrders) : 0}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<LineChartOutlined />}
              suffix="đ"
              formatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}
            />
          </Card>
        </Col>
      </Row>
      
      <Divider orientation="left">Biểu đồ doanh thu</Divider>
      
      <Row gutter={16}>
        <Col span={16}>
          <Card title="Doanh thu theo ngày" loading={loading}>
            <Line data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false, height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Phân bố danh mục" loading={loading}>
            <Pie data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card title="Số lượng đơn hàng theo ngày" loading={loading}>
            <Bar data={orderChartData} options={{ responsive: true, maintainAspectRatio: false, height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Doanh thu theo danh mục" loading={loading}>
            <Table 
              dataSource={dashboardData.categoryData} 
              rowKey="category"
              pagination={false}
              columns={[
                {
                  title: 'Danh mục',
                  dataIndex: 'category',
                  key: 'category',
                },
                {
                  title: 'Doanh thu',
                  dataIndex: 'revenue',
                  key: 'revenue',
                  render: (value) => new Intl.NumberFormat('vi-VN').format(value) + ' đ',
                },
                {
                  title: '%',
                  dataIndex: 'percentage',
                  key: 'percentage',
                  render: (value) => value + '%',
                }
              ]} 
            />
          </Card>
        </Col>
      </Row>
      
      <Divider orientation="left">Phân tích sản phẩm & khách hàng</Divider>
      
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Top 5 sản phẩm bán chạy" loading={loading}>
            <Table
              dataSource={dashboardData.topProducts}
              columns={productColumns}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Top 5 khách hàng" loading={loading}>
            <Table
              dataSource={dashboardData.topCustomers}
              columns={customerColumns}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SalesManagement; 