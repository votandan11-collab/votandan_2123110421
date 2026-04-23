<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Package, Tags, ShoppingCart, Users, TrendingUp, ArrowUpRight, DollarSign, Award, Gift } from 'lucide-react';
import { productApi, orderApi, customerApi, rewardApi } from '../api';

const Dashboard = () => {
    const [stats, setStats] = useState([
        { label: 'Products', value: '...', icon: <Package />, color: '#6366f1' },
        { label: 'Orders', value: '...', icon: <ShoppingCart />, color: '#f59e0b' },
        { label: 'Revenue', value: '...', icon: <DollarSign />, color: '#10b981' },
        { label: 'Customers', value: '...', icon: <Users />, color: '#3b82f6' },
    ]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [products, orders, customers, rewards] = await Promise.all([
                productApi.getAll(),
                orderApi.getAll(),
                customerApi.getAll(),
                rewardApi.getAll()
            ]);

            const totalRevenue = orders.data.reduce((acc, curr) => acc + curr.totalAmount, 0);

            setStats([
                { label: 'Total Products', value: products.data.length, icon: <Package />, color: '#6366f1' },
                { label: 'Total Orders', value: orders.data.length, icon: <ShoppingCart />, color: '#f59e0b' },
                { label: 'Total Revenue', value: totalRevenue.toLocaleString() + ' VNĐ', icon: <DollarSign />, color: '#10b981' },
                { label: 'Total Customers', value: customers.data.length, icon: <Users />, color: '#3b82f6' },
            ]);

            setRecentOrders(orders.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in">
            <div className="top-bar">
                <div className="page-title">
                    <h1>Dashboard Overview</h1>
                    <p>Real-time analytics for your loyalty program</p>
                </div>
                <div className="user-profile">
                    <button className="btn btn-primary" onClick={fetchDashboardData}>Refresh Data</button>
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
                                Live <TrendingUp size={14} style={{ marginLeft: '4px' }} />
                            </div>
                        </div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="table-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>Recent Transactions</h2>
                        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>View All</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Tier</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td><span style={{ fontWeight: 600 }}>#{order.id}</span></td>
                                    <td>{order.customer?.fullName || 'Guest'}</td>
                                    <td>{order.totalAmount.toLocaleString()} VNĐ</td>
                                    <td>
                                        <span className="status-pills" style={{ 
                                            background: 'rgba(99, 102, 241, 0.1)', 
                                            color: 'var(--primary)' 
                                        }}>
                                            {order.customer?.level || 'Silver'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentOrders.length === 0 && !loading && (
                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No recent orders</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="table-container">
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Loyalty Highlights</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                            <div style={{ padding: '8px', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', borderRadius: '8px' }}>
                                <Award size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Top Tier</div>
                                <div style={{ fontWeight: 600 }}>Diamond Members</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                            <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '8px' }}>
                                <Gift size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Redemptions</div>
                                <div style={{ fontWeight: 600 }}>Pending Rewards</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
=======
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
>>>>>>> 9af0e322905d21eae0f46bf213a1507619559811
};

export default Dashboard;
