import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import MainLayout from '../layouts/MainLayout.tsx';

// Lazy load các trang để tối ưu hiệu suất
const Home = lazy(() => import('../pages/ProductList/ProductList'));
const ProductList = lazy(() => import('../pages/ProductList/ProductList'));
const ProductDetail = lazy(() => import('../pages/ProductDetail/ProductDetail'));
const Cart = lazy(() => import('../pages/Cart/Cart'));
const Checkout = lazy(() => import('../pages/Checkout/Checkout'));
const UserProfile = lazy(() => import('../pages/UserProfile/UserProfile'));
const OrderHistory = lazy(() => import('../pages/OrderHistory/OrderHistory'));
const OrderDetail = lazy(() => import('../pages/OrderDetail/OrderDetail'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));

// Tạo component Loading để hiển thị khi đang lazy load
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
  </div>
);

const HomeRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={<MainLayout />}
      >
        {/* Trang chủ */}
        <Route 
          index 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Home />
            </Suspense>
          } 
        />

        {/* Danh sách sản phẩm */}
        <Route 
          path="products" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ProductList />
            </Suspense>
          } 
        />

        {/* Chi tiết sản phẩm */}
        <Route 
          path="products/:productId" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ProductDetail />
            </Suspense>
          } 
        />

        {/* Giỏ hàng */}
        <Route 
          path="cart" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Cart />
            </Suspense>
          } 
        />

        {/* Thanh toán */}
        <Route 
          path="checkout" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Checkout />
            </Suspense>
          } 
        />

        {/* Trang user profile - cần đăng nhập */}
        <Route 
          path="user" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <UserProfile />
            </Suspense>
          } 
        />

        {/* Lịch sử đơn hàng - cần đăng nhập */}
        <Route 
          path="user/orders" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <OrderHistory />
            </Suspense>
          } 
        />

        {/* Chi tiết đơn hàng - cần đăng nhập */}
        <Route 
          path="user/orders/:orderId" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <OrderDetail />
            </Suspense>
          } 
        />

        {/* Trang không tìm thấy - 404 */}
        <Route 
          path="*" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <NotFound />
            </Suspense>
          } 
        />
      </Route>
    </Routes>
  );
};

export default HomeRoutes; 