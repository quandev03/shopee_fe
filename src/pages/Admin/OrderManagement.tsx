import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Modal, Tabs, Tag, 
  Typography, Card, Statistic, Row, Col, Steps,
  Descriptions, Badge, message, Popconfirm, Input, DatePicker
} from 'antd';
import { 
  EyeOutlined, CheckCircleOutlined, CloseCircleOutlined,
  CarOutlined, ShopOutlined, SearchOutlined, FilterOutlined,
  DollarOutlined, ShoppingOutlined, FileTextOutlined, CalendarOutlined
} from '@ant-design/icons';
import moment from 'moment';
import {useMutation} from "@tanstack/react-query";
import {AdminManager} from "../../api/admin.api.ts";
import {OrderRender, ResponseOrder, Order} from "../../Responses/order.type.ts";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Step } = Steps;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dateRange, setDateRange] = useState(null);


  const getOrders = useMutation({
    mutationFn: (data: {field: string[], value: any[]})=> AdminManager.getOrderAdmin(data.field, data.value),
    onSuccess: (res)=>{
      let dataOrder: ResponseOrder = res?.data
      console.log(dataOrder)
      let ordersRender: OrderRender[] =dataOrder.content.map((order: Order)=>({
        code: order.orderCode,
        id: order.orderId,
        customerName: order.addressUser.fullName,
        customerPhone: order.addressUser.phone,
        customerEmail: "",
        total: order.quantity * order.productDTO.price,
        status: order.statusOrder,
        items: [
          { id: order.productDTO.id, name: order.productDTO.nameProduct, price: order.productDTO.price, quantity: order.quantity, image: order.productDTO.image }
        ],
        address: `${order.addressUser.detailAddress} ,${order.addressUser.commercalAddress.nameAddress} , ${order.addressUser.districtAddress.nameAddress}, ${order.addressUser.provincialAddress.nameAddress}`,
        createdAt: order.createTime,
        paymentMethod: 'COD',
        note: ""
      }))
      setOrders(ordersRender);

    },
    onError:(error)=> {
      console.error("Loi")
    }
  })

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, activeTab, searchKeyword, dateRange]);

  const fetchOrders = async () => {
    setLoading(true);
    getOrders.mutate({field:[ ], value: []})
    try {
      // Giả lập API call
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      message.error('Lỗi khi tải danh sách đơn hàng');
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let result = [...orders];
    
    // Lọc theo trạng thái
    if (activeTab !== 'all') {
      result = result.filter(order => order?.status === activeTab);
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(order =>
        order.code.toLowerCase().includes(keyword) ||
        order.customerName.toLowerCase().includes(keyword) ||
        order.customerPhone.includes(keyword) ||
        order.customerEmail.toLowerCase().includes(keyword)
      );
    }
    
    // Lọc theo khoảng thời gian
    if (dateRange) {
      const [startDate, endDate] = dateRange;
      result = result.filter(order => {
        const orderDate = moment(order.createdAt);
        return orderDate.isBetween(startDate, endDate, 'day', '[]');
      });
    }
    
    setFilteredOrders(result);
  };

  const showDetailModal = (order) => {
    setCurrentOrder(order);
    setDetailModalVisible(true);
  };

  const changeStatus = useMutation({
    mutationFn: (data:{orderId: string, status: string}) => AdminManager.changeOrderStatus(data.orderId, data.status),
    onSuccess:()=>{
      message.success("Cập nhật thành công");
      fetchOrders();
    }
  })

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );

      console.log(`change status order id ${orderId}: ${newStatus}`)

      changeStatus.mutate({orderId: orderId, status: newStatus})
      // setOrders(updatedOrders);
      
      // Cập nhật trạng thái của đơn hàng hiện tại (nếu đang xem chi tiết)
      if (currentOrder && currentOrder.id === orderId) {
        setCurrentOrder({ ...currentOrder, status: newStatus });
      }
      
      message.success(`Cập nhật trạng thái đơn hàng thành công`);
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái đơn hàng');
    }
  };

  const renderStatusTag = (status) => {
    let color = '';
    let text = '';
    
    switch (status) {
      case 0:
        color = 'gold';
        text = 'Chờ xác nhận';
        break;
      case 1:
        color = 'blue';
        text = 'Đã xác nhận';
        break;
      case 2:
        color = 'cyan';
        text = 'Đang vận chuyển';
        break;
      case 3:
        color = 'green';
        text = 'Đã giao hàng';
        break;
      case 4:
        color = 'red';
        text = 'Đã hủy';
        break;
      default:
        color = 'default';
        text = 'Không xác định';
    }
    
    return <Tag color={color}>{text}</Tag>;
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 0: return 0;
      case 1: return 1;
      case 2: return 2;
      case 3: return 3;
      case 4: return -1;
      default: return 0;
    }
  };
  console.log(orders)

  let allTotal: number = orders
    .filter(order => order.status === 3)
    .reduce((sum, order) => sum + order.total, 0);
  console.log(allTotal)
  const renderActionButtons = (record) => {
    const { status, id  } = record;
    
    switch (status) {
      case 0:
        return (
          <Space>
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />}
              onClick={() => handleUpdateStatus(id, 'confirmed')}
            >
              Xác nhận
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn muốn hủy đơn hàng này?"
              onConfirm={() => handleUpdateStatus(id, 'cancelled')}
              okText="Có"
              cancelText="Không"
            >
              <Button danger icon={<CloseCircleOutlined />}>Hủy đơn</Button>
            </Popconfirm>
          </Space>
        );
        
      case 1:
        return (
          <Space>
            <Button 
              type="primary" 
              icon={<CarOutlined />}
              onClick={() => handleUpdateStatus(id, 'shipping')}
            >
              Bắt đầu giao hàng
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn muốn hủy đơn hàng này?"
              onConfirm={() => handleUpdateStatus(id, 'cancelled')}
              okText="Có"
              cancelText="Không"
            >
              <Button danger icon={<CloseCircleOutlined />}>Hủy đơn</Button>
            </Popconfirm>
          </Space>
        );
        
      case 2:
        return (
          <Button 
            type="primary" 
            icon={<CheckCircleOutlined />}
            onClick={() => handleUpdateStatus(id, 'delivered')}
          >
            Xác nhận đã giao
          </Button>
        );
        
      case 3:
        return (
          <Button type="default" disabled>Đã hoàn thành</Button>
        );
        
      case 4:
        return (
          <Button type="default" disabled>Đã hủy</Button>
        );
        
      default:
        return null;
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'code',
      key: 'id',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.customerPhone}</div>
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total) => new Intl.NumberFormat('vi-VN').format(total) + ' đ',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: renderStatusTag,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => showDetailModal(record)}
            type="primary"
            ghost
          >
            Chi tiết
          </Button>
          {renderActionButtons(record)}
        </Space>
      ),
    },
  ];

  // Thống kê đơn hàng
  const pendingCount = orders.filter(o => o.status === 0).length;
  const confirmedCount = orders.filter(o => o.status === 1).length;
  const shippingCount = orders.filter(o => o.status === 2).length;
  const deliveredCount = orders.filter(o => o.status === 3).length;
  const cancelledCount = orders.filter(o => o.status === 4).length;
  console.log(orders)
  const orderTabs = [
    { key: 'all', tab: `Tất cả (${orders.length})` },
    { key: 0, tab: `Chờ xác nhận (${pendingCount})` },
    { key: 1, tab: `Đã xác nhận (${confirmedCount})` },
    { key: 2, tab: `Đang vận chuyển (${shippingCount})` },
    { key: 3, tab: `Đã giao hàng (${deliveredCount})` },
    { key: 4, tab: `Đã hủy (${cancelledCount})` },
  ];



  return (
    <div>
      <Title level={2}>Quản lý Đơn hàng</Title>
      
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={orders.length}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Chờ xác nhận"
              value={pendingCount}
              valueStyle={{ color: '#faad14' }}
              prefix={<ShopOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đang vận chuyển"
              value={shippingCount}
              valueStyle={{ color: '#1677ff' }}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đã giao hàng"
              value={deliveredCount}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đã hủy"
              value={cancelledCount}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={orders
                .filter(o => o.status === 3)
                .reduce((sum, order) => sum + order.total, 0)}
              valueStyle={{ color: '#52c41a' }}
              prefix={<DollarOutlined />}
              formatter={value => `${new Intl.NumberFormat('vi-VN').format(value)} đ`}
            />
          </Card>
        </Col>
      </Row>
      
      <div style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm theo mã đơn, tên khách hàng, SĐT..."
              prefix={<SearchOutlined />}
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={8}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['Từ ngày', 'Đến ngày']}
              onChange={value => setDateRange(value)}
              format="DD/MM/YYYY"
            />
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              onClick={filterOrders}
              icon={<FilterOutlined />}
            >
              Lọc đơn hàng
            </Button>
          </Col>
        </Row>
      </div>
      
      <Tabs
        defaultActiveKey="all"
        items={orderTabs.map(item => ({
          key: item.key,
          label: item.tab,
        }))}
        onChange={key => setActiveTab(key)}
      />

      <Table 
        columns={columns} 
        dataSource={filteredOrders} 
        rowKey="id" 
        loading={loading} 
        pagination={{ pageSize: 5 }}
      />

      {/* Modal xem chi tiết đơn hàng */}
      <Modal
        title={<div>Chi tiết đơn hàng <Text strong>{currentOrder?.code}</Text></div>}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={
          currentOrder && [
            <Button key="back" onClick={() => setDetailModalVisible(false)}>
              Đóng
            </Button>,
            renderActionButtons(currentOrder)
          ]
        }
      >
        {currentOrder && (
          <div>
            {currentOrder.status !== 'cancelled' && (
              <Steps current={getStatusStep(currentOrder.status)} status={currentOrder.status === 'cancelled' ? 'error' : 'process'}>
                <Step title="Đặt hàng" description="Chờ xác nhận" />
                <Step title="Xác nhận" description="Đã xác nhận" />
                <Step title="Vận chuyển" description="Đang giao hàng" />
                <Step title="Hoàn thành" description="Đã giao hàng" />
              </Steps>
            )}
            
            {currentOrder.status === 'cancelled' && (
              <div style={{ textAlign: 'center', margin: '20px 0', color: '#ff4d4f' }}>
                <CloseCircleOutlined style={{ fontSize: 32 }} />
                <Title level={4} style={{ color: '#ff4d4f', margin: '10px 0' }}>Đơn hàng đã bị hủy</Title>
              </div>
            )}
            
            <Descriptions title="Thông tin đơn hàng" bordered style={{ marginTop: 24 }}>
              <Descriptions.Item label="Mã đơn hàng" span={3}>{currentOrder.id}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={3}>
                {renderStatusTag(currentOrder.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian đặt" span={3}>{currentOrder.createdAt}</Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán" span={3}>
                {currentOrder.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={3}>{currentOrder.note || 'Không có ghi chú'}</Descriptions.Item>
            </Descriptions>
            
            <Descriptions title="Thông tin khách hàng" bordered style={{ marginTop: 24 }}>
              <Descriptions.Item label="Họ tên" span={3}>{currentOrder.customerName}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại" span={3}>{currentOrder.customerPhone}</Descriptions.Item>
              <Descriptions.Item label="Email" span={3}>{currentOrder.customerEmail}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng" span={3}>{currentOrder.address}</Descriptions.Item>
            </Descriptions>
            
            <Title level={4} style={{ margin: '24px 0 16px' }}>Danh sách sản phẩm</Title>
            <Table
              dataSource={currentOrder.items}
              pagination={false}
              rowKey="id"
              columns={[
                {
                  title: 'Sản phẩm',
                  dataIndex: 'name',
                  render: (text, record) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img 
                        src={record.image} 
                        alt={text} 
                        style={{ width: 50, height: 50, marginRight: 10, objectFit: 'cover' }} 
                      />
                      <span>{text}</span>
                    </div>
                  )
                },
                {
                  title: 'Đơn giá',
                  dataIndex: 'price',
                  render: (price) => new Intl.NumberFormat('vi-VN').format(price) + ' đ'
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'quantity',
                },
                {
                  title: 'Thành tiền',
                  render: (_, record) => new Intl.NumberFormat('vi-VN').format(record.price * record.quantity) + ' đ'
                }
              ]}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={3} style={{ textAlign: 'right' }}>
                    <strong>Tổng tiền:</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <strong>{new Intl.NumberFormat('vi-VN').format(currentOrder.total)} đ</strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagement; 