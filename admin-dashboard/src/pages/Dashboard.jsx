import React from 'react';
import { Package, Tags, ShoppingCart, Users, TrendingUp, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Products', value: '124', icon: <Package />, color: '#6366f1', trend: '+12%' },
    { label: 'Total Categories', value: '18', icon: <Tags />, color: '#10b981', trend: '+2' },
    { label: 'Total Orders', value: '1,420', icon: <ShoppingCart />, color: '#f59e0b', trend: '+18%' },
    { label: 'Total Customers', value: '892', icon: <Users />, color: '#3b82f6', trend: '+5%' },
  ];

  return (
    <div className="animate-in">
      <div className="top-bar">
        <div className="page-title">
          <h1>Dashboard</h1>
          <p>Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="user-profile">
          <button className="btn btn-primary">Download Report</button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                {stat.icon}
              </div>
              <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                {stat.trend} <ArrowUpRight size={14} />
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Recent Activity</h2>
          <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>View All</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#12543</td>
              <td>John Doe</td>
              <td>Iced Coffee</td>
              <td><span className="status-pills status-active">Completed</span></td>
              <td>$4.50</td>
            </tr>
            <tr>
              <td>#12542</td>
              <td>Jane Smith</td>
              <td>Latte</td>
              <td><span className="status-pills status-inactive">Cancelled</span></td>
              <td>$5.00</td>
            </tr>
            <tr>
              <td>#12541</td>
              <td>Mike Ross</td>
              <td>Croissant</td>
              <td><span className="status-pills status-active">Processing</span></td>
              <td>$3.50</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
