import React, { useState, useEffect } from 'react';
import { History, Search, ArrowUpCircle, ArrowDownCircle, Calendar, User, Info } from 'lucide-react';
import { pointsHistoryApi } from '../api';

const PointsHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await pointsHistoryApi.getAll();
            setHistory(response.data);
        } catch (error) {
            console.error('Error fetching points history:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const filteredHistory = history.filter(h => 
        h.customer?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in">
            <div className="top-bar">
                <div className="page-title">
                    <h1>Points History</h1>
                    <p>Track all point accumulations and redemptions</p>
                </div>
                <div className="search-box">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by customer or description..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading history...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Points</th>
                                <th>Type</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            {formatDate(item.createdAt)}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <User size={14} style={{ color: 'var(--text-muted)' }} />
                                            <span style={{ fontWeight: 500 }}>{item.customer?.fullName || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ 
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                            fontWeight: 700, 
                                            color: item.type === 'Add' ? '#10b981' : '#ef4444' 
                                        }}>
                                            {item.type === 'Add' ? '+' : '-'}{Math.abs(item.points)}
                                            {item.type === 'Add' ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="status-pills" style={{ 
                                            background: item.type === 'Add' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: item.type === 'Add' ? '#10b981' : '#ef4444'
                                        }}>
                                            {item.type === 'Add' ? 'EARNED' : 'REDEEMED'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.85rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {item.description}
                                        </div>
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

export default PointsHistory;
