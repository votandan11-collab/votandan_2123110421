import React, { useState, useEffect } from 'react';
import { Package, Tags, ShoppingCart, Users, TrendingUp, DollarSign, Award, Gift } from 'lucide-react';
import { productApi, orderApi, customerApi, rewardApi } from '../api';

const Dashboard = () => {
    const [stats, setStats] = useState([
        { label: 'Products', value: '...', icon: <Package />, color: 'var(--primary)' },
        { label: 'Orders', value: '...', icon: <ShoppingCart />, color: 'var(--secondary)' },
        { label: 'Revenue', value: '...', icon: <DollarSign />, color: 'oklch(70% 0.15 150)' },
        { label: 'Customers', value: '...', icon: <Users />, color: 'oklch(65% 0.18 210)' },
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
                { label: 'Total Products', value: products.data.length, icon: <Package />, color: 'var(--primary)' },
                { label: 'Total Orders', value: orders.data.length, icon: <ShoppingCart />, color: 'var(--secondary)' },
                { label: 'Total Revenue', value: totalRevenue.toLocaleString() + ' VNĐ', icon: <DollarSign />, color: 'oklch(70% 0.15 150)' },
                { label: 'Total Customers', value: customers.data.length, icon: <Users />, color: 'oklch(65% 0.18 210)' },
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
                    <h1 style={{ fontSize: '2.5rem', letterSpacing: '-0.03em', fontWeight: 800 }}>Dashboard</h1>
                    <p style={{ fontSize: '1rem', opacity: 0.7 }}>Real-time analytics & loyalty health</p>
                </div>
                <button 
                    className="btn-premium btn-primary-premium" 
                    onClick={fetchDashboardData}
                    style={{ borderRadius: '14px', padding: '12px 24px' }}
                >
                    Refresh Data
                </button>
            </div>

            <div className="stats-grid">
                {stats.map((stat, i) => (
                    <div key={i} className="stat-card" style={{ padding: '2rem', border: '1px solid var(--glass-border)', background: 'var(--card-bg)', backdropFilter: 'blur(20px)' }}>
                        <div className="stat-header" style={{ marginBottom: '1.5rem' }}>
                            <div className="stat-icon" style={{ 
                                width: '48px', 
                                height: '48px', 
                                borderRadius: '14px', 
                                background: `oklch(from ${stat.color} l c h / 0.1)`, 
                                color: stat.color,
                                border: `1px solid oklch(from ${stat.color} l c h / 0.2)`
                            }}>
                                {stat.icon}
                            </div>
                            <div style={{ color: 'oklch(70% 0.15 150)', display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                <TrendingUp size={14} style={{ marginRight: '6px' }} /> Live
                            </div>
                        </div>
                        <div className="stat-value" style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{stat.value}</div>
                        <div className="stat-label" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="table-container" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Recent Transactions</h2>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last 5 orders</div>
                    </div>
                    <table style={{ borderSpacing: '0 12px', borderCollapse: 'separate' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '0 1rem 1rem' }}>Order ID</th>
                                <th style={{ padding: '0 1rem 1rem' }}>Customer</th>
                                <th style={{ padding: '0 1rem 1rem' }}>Amount</th>
                                <th style={{ padding: '0 1rem 1rem' }}>Tier</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id} style={{ background: 'oklch(100% 0 0 / 0.02)', borderRadius: '12px' }}>
                                    <td style={{ padding: '1.25rem 1rem', borderBottom: 'none' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>#{order.id}</span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', borderBottom: 'none', fontWeight: 500 }}>
                                        {order.customer?.name || 'Guest User'}
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', borderBottom: 'none', fontWeight: 600 }}>
                                        {order.totalAmount.toLocaleString()} <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>VNĐ</span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', borderBottom: 'none' }}>
                                        <span className="status-pills" style={{ 
                                            background: 'oklch(from var(--primary) l c h / 0.1)', 
                                            color: 'var(--primary)',
                                            border: '1px solid oklch(from var(--primary) l c h / 0.1)',
                                            padding: '6px 12px',
                                            borderRadius: '8px'
                                        }}>
                                            {order.customer?.level || 'Standard'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="table-container" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '2rem' }}>Loyalty Pulse</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '1.5rem', background: 'oklch(100% 0 0 / 0.02)' }}>
                            <div style={{ 
                                padding: '12px', 
                                background: 'oklch(65% 0.2 330 / 0.1)', 
                                color: 'oklch(65% 0.2 330)', 
                                borderRadius: '14px',
                                border: '1px solid oklch(65% 0.2 330 / 0.2)'
                            }}>
                                <Award size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2px' }}>VIP Status</div>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Active Members</div>
                            </div>
                        </div>
                        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '1.5rem', background: 'oklch(100% 0 0 / 0.02)' }}>
                            <div style={{ 
                                padding: '12px', 
                                background: 'oklch(70% 0.18 60 / 0.1)', 
                                color: 'oklch(70% 0.18 60)', 
                                borderRadius: '14px',
                                border: '1px solid oklch(70% 0.18 60 / 0.2)'
                            }}>
                                <Gift size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Rewards</div>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Pending Claims</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
