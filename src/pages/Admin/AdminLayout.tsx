import React, { useState } from 'react';
import {Layout, Menu, theme, Button, Alert, Modal} from 'antd';
import {
  UserOutlined,
  ShoppingOutlined,
  BarChartOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminBreadcrumb from './AdminBreadcrumb.tsx';
import {clearLS} from "../../utils/auth.ts";

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {

    clearLS()
    setIsModalOpen(false);
    navigate('/login');
    return <Alert message="Success Text" type="success" />
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: <Link to="/admin/products">Quản lý Sản phẩm</Link>,
    },
    {
      key: 'accounts',
      icon: <UserOutlined />,
      label: <Link to="/admin/accounts">Quản lý Tài khoản</Link>,
    },
    {
      key: 'address',
      icon: <EnvironmentOutlined />,
      label: <Link to="/admin/address">Quản lí địa chỉ</Link>,
    },
    {
      key: 'sales',
      icon: <BarChartOutlined />,
      label: <Link to="/admin/sales">Quản lý Bán hàng</Link>,
      children: [
        {
          key: 'orders',
          label: <Link to="/admin/orders">Quản lý Đơn hàng</Link>,
        },
        {
          key: 'revenue',
          label: <Link to="/admin/revenue">Doanh thu</Link>,
        }
      ]
    },
  ];

  // Xác định key được chọn dựa trên đường dẫn hiện tại
  const selectedKey = location.pathname.split('/')[2] || 'dashboard';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" style={{ height: 32, margin: 16, background: 'rgba(255,255,255,.2)' }} />
        <Menu
          theme="dark"
          defaultSelectedKeys={[selectedKey]}
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          style={{ position: 'absolute', top: 16, right: 16 }}
          onClick={() => {
            // Logic đăng xuất tại đây (ví dụ: xóa cookie, localStorage hoặc điều hướng về trang đăng nhập)
            setIsModalOpen(true)

          }}
        >
          Đăng xuất
        </Button>
        <Content style={{ margin: '0 16px' }}>
          <AdminBreadcrumb />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>Bạn có chắc sẽ đăng xuất chứ</p>
        </Modal>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;