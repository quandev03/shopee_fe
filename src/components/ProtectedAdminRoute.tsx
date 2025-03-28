import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from 'src/contexts/app.context';

export default function ProtectedAdminRoute() {
  const { isAuthenticated, profile } = useContext(AppContext);

  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Kiểm tra xem người dùng có phải là admin không
  const isAdmin = profile?.roles?.includes('Admin');
  
  if (!isAdmin) {
    // Nếu không phải admin, chuyển hướng về trang chủ
    return <Navigate to="/" replace />;
  }
  
  // Nếu là admin đã đăng nhập, cho phép truy cập
  return <Outlet />;
} 