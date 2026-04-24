import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Customers from './pages/Customers';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import CustomerHome from './pages/CustomerHome';
import ProductDetail from './pages/ProductDetail'; 
import AdminLayout from './components/AdminLayout';

// Giả lập check login (Bạn có thể thay bằng logic thật)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('employeeToken');
  if (!token) return <Navigate to="/login" />;
  return <AdminLayout>{children}</AdminLayout>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES (CUSTOMER PORTAL) */}
        <Route path="/" element={<CustomerHome />} />
        <Route path="/buy/:categoryId" element={<ProductDetail />} />
        
        {/* LOGIN ROUTE */}
        <Route path="/login" element={<LoginPage />} />

        {/* ADMIN PRIVATE ROUTES */}
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
        <Route path="/admin/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
