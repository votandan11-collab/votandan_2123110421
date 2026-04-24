import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Rewards from './pages/Rewards';
import Stores from './pages/Stores';
import Employees from './pages/Employees';
import PointsHistory from './pages/PointsHistory';
import Payments from './pages/Payments';
import Banners from './pages/Banners';
import './index.css';

import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import UserAuth from './pages/UserAuth';
import { productApi } from './api';

// Admin Layout Component
const AdminLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
    <Sidebar />
    <main className="main-content">
      {children}
    </main>
  </div>
);

import CustomerHome from './pages/CustomerHome';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route Công khai */}
        <Route path="/" element={<CustomerHome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user-auth" element={<UserAuth />} />

        {/* Route Quản trị (Admin) - Được bảo vệ */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute><AdminLayout><Products /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute><AdminLayout><Categories /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute><AdminLayout><Orders /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/customers" element={<ProtectedRoute><AdminLayout><Customers /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/stores" element={<ProtectedRoute><AdminLayout><Stores /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/rewards" element={<ProtectedRoute><AdminLayout><Rewards /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/employees" element={<ProtectedRoute><AdminLayout><Employees /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/payments" element={<ProtectedRoute><AdminLayout><Payments /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/points-history" element={<ProtectedRoute><AdminLayout><PointsHistory /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/banners" element={<ProtectedRoute><AdminLayout><Banners /></AdminLayout></ProtectedRoute>} />
        
        {/* Chuyển hướng nếu không khớp */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
