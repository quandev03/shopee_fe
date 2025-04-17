import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "react-toastify/dist/ReactToastify.css";
import React, {Suspense, useContext, useEffect} from "react";

import AppProvider, { AppContext } from "./contexts/app.context";
import ErrorBoundary from "./components/ErrorBoundary";

import MainLayout from './layouts/MainLayout/index.ts';
import HomePage from './pages/ProductList/index.ts';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminLayout from './pages/Admin/AdminLayout.tsx';
import Dashboard from './pages/Admin/Dashboard.tsx';
import ProductManagement from './pages/Admin/ProductManagement';
import AccountManagement from './pages/Admin/AccountManagement';
import OrderManagement from './pages/Admin/OrderManagement';
import SalesManagement from './pages/Admin/SalesManagement';
import {localStorageEventTarget} from "./utils/auth.ts";
import Vouchers from "./pages/Admin/Vouchers.tsx";
import ProductDetail from './pages/ProductDetail/ProductDetail.tsx';
import Cart from "./pages/Cart/index.ts";
import Profile from "./pages/User/pages/Profile/index";
import PurchaseHistory from  "./pages/User/pages/PurchaseHistory/index"
import UserProfile from  "./pages/User/layout/UserLayout/index"
import ChangePassword from  "./pages/User/pages/ChangePassword/index"
import AddressManager from "./pages/Admin/AddressManager.tsx";
function App() {
    const { setIsAuthenticated, setProfile } = useContext(AppContext);

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const profile = localStorage.getItem('profile');

        if (accessToken && refreshToken && profile) {
            // Thiết lập lại trạng thái đăng nhập và thông tin người dùng từ localStorage
            setIsAuthenticated(true);
            setProfile(JSON.parse(profile)); // Cập nhật profile từ localStorage
        } else {
            setIsAuthenticated(false);
        }
    }, [setIsAuthenticated, setProfile]);


    return (
        <HelmetProvider>
            <ErrorBoundary>
                <ToastContainer />
                <Routes>
                    {/* Routes người dùng */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path=':nameId' element={<ProductDetail />} />
                        <Route path='cart' element = {<Cart/>} />

                        <Route path="user/" element={<UserProfile/>} >
                            <Route path= 'profile' element={<Profile/>} />
                            <Route path= "purchase" element={<PurchaseHistory/>} />
                            <Route path= "password" element={<ChangePassword/>} />
                        </Route>

                    </Route>

                    {/* Auth */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Admin */}
                    <Route path="/admin" element={<ProtectedAdminRoute />}>
                        <Route element={<AdminLayout />}>
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="products" element={<ProductManagement />} />
                            <Route path="accounts" element={<AccountManagement />} />
                            <Route path="orders" element={<OrderManagement />} />
                            <Route path="sales" element={<SalesManagement />} />
                            <Route path="revenue" element={<SalesManagement />} />
                            <Route path= "vouchers" element={<Vouchers/>} />
                            <Route path= "address" element={<AddressManager/>} />
                            <Route path="*" element={<Navigate to="dashboard" replace />} />
                        </Route>
                    </Route>
                </Routes>
                <ReactQueryDevtools initialIsOpen={false} />
            </ErrorBoundary>
        </HelmetProvider>
    );
}

export default App;