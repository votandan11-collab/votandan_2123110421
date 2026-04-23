import React, { useState, useEffect } from 'react';
import { CreditCard, Search, CheckCircle2, XCircle, Clock, DollarSign, User, Receipt } from 'lucide-react';
import { paymentApi } from '../api';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await paymentApi.getAll();
            setPayments(response.data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', icon: <CheckCircle2 size={12} /> };
            case 'pending': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', icon: <Clock size={12} /> };
            default: return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', icon: <XCircle size={12} /> };
        }
    };

    const filteredPayments = payments.filter(p => 
        p.orderId.toString().includes(searchTerm) || 
        p.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in">
            <div className="top-bar">
                <div className="page-title">
                    <h1>Financial Giao dịch</h1>
                    <p>Monitor all payments and cash flows</p>
                </div>
                <div className="search-box">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by Order ID or Method..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div className="stat-value">
                        {payments.filter(p => p.status === 'Completed').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()} <span style={{fontSize: '0.8rem'}}>VNĐ</span>
                    </div>
                    <div className="stat-label">Total Valid Payments</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
                            <Clock size={20} />
                        </div>
                    </div>
                    <div className="stat-value">
                        {payments.filter(p => p.status === 'Pending').length}
                    </div>
                    <div className="stat-label">Pending Giao dịch</div>
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading payments...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Payment ID</th>
                                <th>Order Ref</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map((p) => {
                                const style = getStatusStyle(p.status);
                                return (
                                    <tr key={p.id}>
                                        <td><span style={{ fontWeight: 600 }}>PAY-{p.id}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Receipt size={14} style={{ color: 'var(--text-muted)' }} />
                                                <span>#{p.orderId}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 700, color: 'white' }}>
                                                {p.amount.toLocaleString()} VNĐ
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <CreditCard size={14} style={{ color: 'var(--primary)' }} />
                                                {p.paymentMethod}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="status-pills" style={{ 
                                                background: style.bg, 
                                                color: style.color,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                {style.icon}
                                                {p.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn" style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredPayments.length === 0 && (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No payment records found</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Payments;
