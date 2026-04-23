import React from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
>>>>>>> 9af0e322905d21eae0f46bf213a1507619559811
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
<<<<<<< HEAD
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Rewards from './pages/Rewards';
import Stores from './pages/Stores';
import Employees from './pages/Employees';
import PointsHistory from './pages/PointsHistory';
import Payments from './pages/Payments';
import './index.css';

import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Layout Component
const AdminLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
    <Sidebar />
    <main className="main-content">
      {children}
    </main>
  </div>
);

import { productApi } from './api';
import UserAuth from './pages/UserAuth';

// A more functional Customer View for testing
const CustomerHome = () => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('userData');
    if (savedUser) setUser(JSON.parse(savedUser));

    productApi.getAll().then(res => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: 'white', padding: '40px' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6366f1' }}>CARD LOYALTY</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 'bold' }}>{user.name}</p>
                <p style={{ fontSize: '0.75rem', color: '#10b981' }}>{user.level} Member • {user.totalPoints} pts</p>
              </div>
              <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #334155', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
            </div>
          ) : (
            <a href="/user-auth" style={{ background: '#6366f1', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none' }}>Login / Register</a>
          )}
          <a href="/login" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.8rem' }}>Admin Area</a>
        </div>
      </nav>
      
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Săn Thẻ Cào, Nhận Ưu Đãi</h2>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Hệ thống tích điểm tự động 1% cho mỗi giao dịch.</p>
        {!user && <p style={{ color: '#6366f1', marginTop: '10px' }}>Đăng ký ngay để nhận 100 điểm thưởng đầu tiên!</p>}
      </header>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.5rem' }}>Kho Thẻ Cào</h3>
            <span style={{ color: '#64748b' }}>{products.length} loại thẻ có sẵn</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '25px' }}>
          {loading ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>Đang tải sản phẩm...</div>
          ) : products.map(p => (
            <div key={p.id} style={{ 
                background: 'rgba(30, 41, 59, 0.5)', 
                padding: '25px', 
                borderRadius: '20px', 
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'transform 0.3s'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🎫</div>
              <h4 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>{p.name}</h4>
              <p style={{ color: '#6366f1', fontWeight: 800, fontSize: '1.3rem' }}>{p.price.toLocaleString()} <span style={{fontSize: '0.8rem'}}>VNĐ</span></p>
              <button style={{ 
                marginTop: '20px', width: '100%', padding: '12px', 
                background: '#6366f1', border: 'none',
                color: 'white', borderRadius: '10px', cursor: 'pointer',
                fontWeight: 'bold'
              }}>Mua & Tích Điểm</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<CustomerHome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user-auth" element={<UserAuth />} />

        {/* Protected Admin Routes */}
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
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
=======
import './index.css';

function App() {
  return (
    <Router>
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/orders" element={<div className="animate-in"><h1>Orders (Coming Soon)</h1></div>} />
          <Route path="/customers" element={<div className="animate-in"><h1>Customers (Coming Soon)</h1></div>} />
          <Route path="/stores" element={<div className="animate-in"><h1>Stores (Coming Soon)</h1></div>} />
          <Route path="/rewards" element={<div className="animate-in"><h1>Rewards (Coming Soon)</h1></div>} />
          <Route path="/payments" element={<div className="animate-in"><h1>Payments (Coming Soon)</h1></div>} />
        </Routes>
      </main>
>>>>>>> 9af0e322905d21eae0f46bf213a1507619559811
    </Router>
  );
}

export default App;
