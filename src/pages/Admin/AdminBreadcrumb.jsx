import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const AdminBreadcrumb = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);
  
  // Loại bỏ 'admin' từ danh sách để tránh lặp lại
  const paths = pathSnippets[0] === 'admin' ? pathSnippets.slice(1) : pathSnippets;
  
  // Map các đường dẫn sang tiếng Việt
  const pathNameMap = {
    'dashboard': 'Dashboard',
    'products': 'Quản lý Sản phẩm',
    'accounts': 'Quản lý Tài khoản',
    'orders': 'Quản lý Đơn hàng',
    'sales': 'Quản lý Bán hàng',
    'revenue': 'Doanh thu'
  };
  
  const breadcrumbItems = [
    {
      title: <Link to="/admin/dashboard"><HomeOutlined /> Admin</Link>,
    },
    ...paths.map((path, index) => {
      const url = `/admin/${paths.slice(0, index + 1).join('/')}`;
      const displayName = pathNameMap[path] || path;
      
      return {
        title: <Link to={url}>{displayName}</Link>,
      };
    })
  ];
  
  return <Breadcrumb items={breadcrumbItems} style={{ margin: '16px 0' }} />;
};

export default AdminBreadcrumb; 