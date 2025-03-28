import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../pages/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import ProductManagement from '../pages/admin/ProductManagement';
import AccountManagement from '../pages/admin/AccountManagement';
import OrderManagement from '../pages/admin/OrderManagement';
import SalesManagement from '../pages/admin/SalesManagement';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        {/* Chuyển hướng trang chính admin tới dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        {/* Trang Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Quản lý Sản phẩm */}
        <Route path="products" element={<ProductManagement />} />
        
        {/* Quản lý Tài khoản */}
        <Route path="accounts" element={<AccountManagement />} />
        
        {/* Quản lý Đơn hàng */}
        <Route path="orders" element={<OrderManagement />} />
        
        {/* Quản lý Bán hàng - Doanh thu */}
        <Route path="sales" element={<SalesManagement />} />
        <Route path="revenue" element={<SalesManagement />} />
        
        {/* Đường dẫn không tồn tại - chuyển hướng về dashboard */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes; 