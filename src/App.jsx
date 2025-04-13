import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useContext } from 'react';
import { AppContext } from './contexts/app.context';

// Lazy load các Routes
const HomeRoutes = lazy(() => import('./routes/HomeRoutes.js'));
const AdminRoutes = lazy(() => import('./routes/AdminRoutes'));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
  </div>
);

// Component bảo vệ Admin Routes
const ProtectedAdminRoute = () => {
  const { isAuthenticated, profile } = useContext(AppContext);
  
  // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Nếu đã đăng nhập nhưng không có quyền admin, chuyển hướng về trang chủ
  const isAdmin = profile?.roles?.includes('Admin');
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // Nếu là admin, cho phép truy cập
  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Các trang đăng nhập, đăng ký */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Route cho Admin */}
          <Route path="/admin" element={<ProtectedAdminRoute />}>
            <Route path="*" element={<AdminRoutes />} />
          </Route>
          
          {/* Routes cho trang người dùng */}
          <Route path="/*" element={<HomeRoutes />} />
          
          {/* Trang không tìm thấy */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App; 