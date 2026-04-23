import React, { useState, useEffect } from 'react';
import { Package, Tags, ShoppingCart, Users, TrendingUp, DollarSign, Award, Gift } from 'lucide-react';
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
            const [products, orders, customers] = await Promise.all([
                productApi.getAll(),
                orderApi.getAll(),
                customerApi.getAll()
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
                <button className="btn btn-primary" onClick={fetchDashboardData}>Refresh Data</button>
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
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Recent Transactions</h2>
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
                                    <td>{order.customer?.name || 'Guest'}</td>
                                    <td>{order.totalAmount.toLocaleString()} VNĐ</td>
                                    <td>
                                        <span className="status-pills" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                                            {order.customer?.level || 'Normal'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
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
                                <div style={{ fontWeight: 600 }}>VIP Members</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                            <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '8px' }}>
                                <Gift size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Redemptions</div>
                                <div style={{ fontWeight: 600 }}>Available Rewards</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
