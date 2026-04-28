import React, { useState, useEffect } from 'react';
import { History, Search, ArrowUpCircle, ArrowDownCircle, Calendar, User, Info, Plus, Trash2, Edit2, X, Loader2 } from 'lucide-react';
import { pointsHistoryApi, customerApi } from '../api';

const PointsHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({
        customerId: '',
        points: 0,
        type: 'Add',
        description: ''
    });

    useEffect(() => {
        fetchHistory();
        fetchCustomers();
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

    const fetchCustomers = async () => {
        try {
            const res = await customerApi.getAll();
            setCustomers(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                customerId: item.customerId || item.CustomerId,
                points: Math.abs(item.points || item.Points),
                type: item.type || item.Type || 'Add',
                description: item.description || item.Description || ''
            });
        } else {
            setEditingItem(null);
            setFormData({ customerId: '', points: 0, type: 'Add', description: '' });
        }
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        try {
            await pointsHistoryApi.delete(id);
            fetchHistory();
        } catch (error) {
            alert('Error deleting record');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                CustomerId: parseInt(formData.customerId),
                Points: parseInt(formData.points),
                Type: formData.type,
                Description: formData.description
            };

            if (editingItem) {
                await pointsHistoryApi.update(editingItem.id || editingItem.Id, payload);
            } else {
                await pointsHistoryApi.create(payload);
            }
            setShowModal(false);
            fetchHistory();
        } catch (error) {
            alert('Error saving record');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const filteredHistory = history.filter(h => {
        const customerName = h.customer?.name || h.Customer?.Name || h.customer?.fullName || "";
        const description = h.description || h.Description || "";
        return customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               description.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="animate-in">
            <div className="top-bar">
                <div className="page-title">
                    <h1>Points History</h1>
                    <p>Track all point accumulations and redemptions</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="search-box">
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by customer or description..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        <Plus size={18} /> Adjust Points
                    </button>
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                         <Loader2 className="animate-spin" /> Loading history...
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Points</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.map((item) => (
                                <tr key={item.id || item.Id}>
                                    <td>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            {formatDate(item.createdAt || item.CreatedAt)}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <User size={14} style={{ color: 'var(--text-muted)' }} />
                                            <span style={{ fontWeight: 500 }}>
                                                {item.customer?.name || item.Customer?.Name || item.customer?.fullName || 'Unknown'}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ 
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                            fontWeight: 700, 
                                            color: (item.type || item.Type) === 'Add' ? '#10b981' : '#ef4444' 
                                        }}>
                                            {(item.type || item.Type) === 'Add' ? '+' : '-'}{Math.abs(item.points || item.Points)}
                                            {(item.type || item.Type) === 'Add' ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="status-pills" style={{ 
                                            background: (item.type || item.Type) === 'Add' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: (item.type || item.Type) === 'Add' ? '#10b981' : '#ef4444'
                                        }}>
                                            {(item.type || item.Type) === 'Add' ? 'EARNED' : 'REDEEMED'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.85rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {item.description || item.Description}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn" style={{ padding: '6px' }} onClick={() => handleOpenModal(item)}>
                                                <Edit2 size={14} />
                                            </button>
                                            <button className="btn" style={{ padding: '6px', color: '#ef4444' }} onClick={() => handleDelete(item.id || item.Id)}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* MODAL FORM */}
            {showModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="stat-card" style={{ width: '100%', maxWidth: '450px', background: 'var(--bg-card)', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2>{editingItem ? 'Edit Record' : 'Manual Adjustment'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {!editingItem && (
                                <div className="form-group">
                                    <label>Customer</label>
                                    <select 
                                        required
                                        value={formData.customerId}
                                        onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                                    >
                                        <option value="">Select Customer</option>
                                        {customers.map(c => (
                                            <option key={c.id || c.Id} value={c.id || c.Id}>{c.name || c.Name} ({c.email || c.Email})</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="form-group">
                                <label>Points</label>
                                <input 
                                    type="number" required min="1"
                                    value={formData.points}
                                    onChange={(e) => setFormData({...formData, points: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <select 
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="Add">Add (Cộng)</option>
                                    <option value="Subtract">Subtract (Trừ)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input 
                                    type="text" required
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="e.g. Manual correction, Gift..."
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PointsHistory;
