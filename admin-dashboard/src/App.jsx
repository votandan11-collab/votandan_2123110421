import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Customers from './pages/Customers';
import UserAuth from './pages/UserAuth'; 
import CustomerHome from './pages/CustomerHome';
import ProductDetail from './pages/ProductDetail'; 
import Sidebar from './components/Sidebar';

// Giao diện Layout dành riêng cho Admin
const AdminLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
    <Sidebar />
    <div style={{ flex: 1, padding: '2rem', height: '100vh', overflowY: 'auto' }}>
      {children}
    </div>
  </div>
);

// Bảo vệ đường dẫn Admin
const ProtectedRoute = ({ children }) => {
  // Tùy theo logic auth hiện tại của bạn
  const token = localStorage.getItem('adminToken') || localStorage.getItem('employeeToken');
  if (!token) return <Navigate to="/login" replace />;
  return <AdminLayout>{children}</AdminLayout>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* TRANG CHỦ & CHI TIẾT DÀNH CHO KHÁCH */}
        <Route path="/" element={<CustomerHome />} />
        <Route path="/buy/:categoryId" element={<ProductDetail />} />
        
        {/* ĐĂNG NHẬP ADMIN */}
        <Route path="/login" element={<LoginPage />} />

        {/* CÁC TRANG QUẢN TRỊ (ADMIN) */}
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
        <Route path="/admin/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><UserAuth /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
