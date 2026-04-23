import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
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
    </Router>
  );
}

export default App;
