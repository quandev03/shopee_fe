import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "react-toastify/dist/ReactToastify.css";
import { useContext, useEffect } from "react";

import AppProvider, { AppContext } from "./contexts/app.context";
import useRouteElement from "./hooks/useRouteElement";
import ErrorBoundary from "./components/ErrorBoundary";

import MainLayout from './layouts/MainLayout';
import HomePage from './pages/ProductList';

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

function App() {
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
        <HelmetProvider>
            <ErrorBoundary>
                <ToastContainer />
                <Routes>
                    {/* Routes người dùng */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<HomePage />} />
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