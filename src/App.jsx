import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
// Import các routes khác hoặc các component
import HomeRoutes from './routes/HomeRoutes'; // Giả sử đã có routes cho phần người dùng
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes cho người dùng */}
        <Route path="/*" element={<HomeRoutes />} />
        
        {/* Routes cho admin với bảo vệ */}
        <Route path="/admin/*" element={
          <ProtectedAdminRoute>
            <AdminRoutes />
          </ProtectedAdminRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App; 