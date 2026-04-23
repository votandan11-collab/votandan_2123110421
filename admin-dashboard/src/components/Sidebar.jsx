import React from 'react';
<<<<<<< HEAD
import { NavLink, useNavigate } from 'react-router-dom';
=======
import { NavLink } from 'react-router-dom';
>>>>>>> 9af0e322905d21eae0f46bf213a1507619559811
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Users, 
  Store, 
  Gift, 
<<<<<<< HEAD
  History,
  ShieldCheck,
  LogOut,
  CreditCard
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Tags size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Rewards', path: '/admin/rewards', icon: <Gift size={20} /> },
    { name: 'Payments', path: '/admin/payments', icon: <CreditCard size={20} /> },
    { name: 'Points History', path: '/admin/points-history', icon: <History size={20} /> },
    { name: 'Stores', path: '/admin/stores', icon: <Store size={20} /> },
    { name: 'Employees', path: '/admin/employees', icon: <ShieldCheck size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)' }}>
          <ShieldCheck size={24} />
        </div>
        <span className="logo-text">LOYALTY ADMIN</span>
=======
  CreditCard 
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/products', icon: <Package size={20} /> },
    { name: 'Categories', path: '/categories', icon: <Tags size={20} /> },
    { name: 'Orders', path: '/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
    { name: 'Stores', path: '/stores', icon: <Store size={20} /> },
    { name: 'Rewards', path: '/rewards', icon: <Gift size={20} /> },
    { name: 'Payments', path: '/payments', icon: <CreditCard size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <Store size={24} />
        </div>
        <span className="logo-text">ADMIN PANEL</span>
>>>>>>> 9af0e322905d21eae0f46bf213a1507619559811
      </div>
      <nav className="nav-links">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <i>{item.icon}</i>
            <span>{item.name}</span>
          </NavLink>
        ))}
<<<<<<< HEAD
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <NavLink to="/" className="nav-item">
            <Store size={20} />
            <span>View Customer Site</span>
          </NavLink>
          <button onClick={handleLogout} className="nav-item" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', color: '#ef4444' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
=======
>>>>>>> 9af0e322905d21eae0f46bf213a1507619559811
      </nav>
    </aside>
  );
};

export default Sidebar;
