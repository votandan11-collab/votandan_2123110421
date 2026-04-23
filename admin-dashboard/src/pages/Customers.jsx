import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, Filter, MoreHorizontal, User, Award, Phone, Wallet } from 'lucide-react';
import { customerApi } from '../api';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await customerApi.getAll();
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'Diamond': return '#f472b6'; // Pink
            case 'Gold': return '#fbbf24'; // Yellow
            case 'VIP': return '#818cf8'; // Indigo
            case 'Silver': return '#94a3b8'; // Slate
            default: return '#94a3b8';
        }
    };

    const filteredCustomers = customers.filter(c => 
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.phone.includes(searchTerm)
    );

    return (
        <div className="animate-in">
            <div className="top-bar">
                <div className="page-title">
                    <h1>Customer Management</h1>
                    <p>Track and manage your loyal members</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="search-box">
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name or phone..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary">
                        <UserPlus size={18} /> Add Customer
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#6366f1' }}>
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="stat-value">{customers.length}</div>
                    <div className="stat-label">Total Members</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(244, 114, 182, 0.2)', color: '#f472b6' }}>
                            <Award size={20} />
                        </div>
                    </div>
                    <div className="stat-value">
                        {customers.filter(c => c.level === 'Diamond').length}
                    </div>
                    <div className="stat-label">Diamond Members</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                            <Wallet size={20} />
                        </div>
                    </div>
                    <div className="stat-value">
                        {customers.reduce((acc, curr) => acc + curr.totalPoints, 0).toLocaleString()}
                    </div>
                    <div className="stat-label">Total Points Issued</div>
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading customers...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Points</th>
                                <th>Tier</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div className="user-avatar" style={{ 
                                                width: '32px', 
                                                height: '32px', 
                                                borderRadius: '50%', 
                                                background: 'rgba(255,255,255,0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <User size={16} />
                                            </div>
                                            {customer.fullName}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                                            <Phone size={14} />
                                            {customer.phone}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
                                            {customer.totalPoints.toLocaleString()}
                                        </div>
                                    </td>
                                    <td>
                                        <span 
                                            className="status-pills" 
                                            style={{ 
                                                background: `${getLevelColor(customer.level)}20`, 
                                                color: getLevelColor(customer.level),
                                                border: `1px solid ${getLevelColor(customer.level)}30`
                                            }}
                                        >
                                            {customer.level}
                                        </span>
                                    </td>
                                    <td>
                                        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Customers;
