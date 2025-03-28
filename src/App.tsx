import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useContext, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ErrorBoundary";
import AppProvider, { AppContext } from "./contexts/app.context";
import useRouteElement from "./hooks/useRouteElement";
import { localStorageEventTarget } from "./utils/auth";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import AccountManagement from './pages/admin/AccountManagement';
import OrderManagement from './pages/admin/OrderManagement';
import SalesManagement from './pages/admin/SalesManagement';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import Login from './pages/Login/Login';
import Register from './pages/Login/Register';
import MainLayout from './pages/MainLayout';
import HomePage from './pages/HomePage';

function App() {
  const routeElement = useRouteElement();
  const { clearData } = useContext(AppContext);

  useEffect(() => {
    localStorageEventTarget.addEventListener("clearData", () => {
      clearData();
    });

    return () => {
      localStorageEventTarget.removeEventListener("clearData", clearData);
    };
  }, [clearData]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes cho người dùng thông thường */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          {/* Các route khác cho người dùng */}
        </Route>
        
        {/* Route đăng nhập */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Routes cho admin - được bảo vệ bởi ProtectedAdminRoute */}
        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="accounts" element={<AccountManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="sales" element={<SalesManagement />} />
            <Route path="revenue" element={<SalesManagement />} />
            {/* Route không tồn tại - chuyển về dashboard */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer autoClose={1500} closeOnClick />
      <ReactQueryDevtools initialIsOpen={false} />
    </BrowserRouter>
  );
}

export default App;
