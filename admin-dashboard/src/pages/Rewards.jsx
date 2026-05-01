import React, { useState, useEffect } from 'react';
import { Gift, Search, Plus, Trash2, Award, Zap, Package, X, Edit2, Loader2 } from 'lucide-react';
import { rewardApi } from '../api';

const Rewards = () => {
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingReward, setEditingReward] = useState(null);
    const [formData, setFormData] = useState({
        rewardName: '',
        pointsRequired: 0,
        stockQuantity: 0
    });

    useEffect(() => {
        fetchRewards();
    }, []);

    const fetchRewards = async () => {
        try {
            setLoading(true);
            const response = await rewardApi.getAll();
            setRewards(response.data);
        } catch (error) {
            console.error('Error fetching rewards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (reward = null) => {
        if (reward) {
            setEditingReward(reward);
            setFormData({
                rewardName: reward.rewardName || reward.RewardName,
                pointsRequired: reward.pointsRequired || reward.PointsRequired,
                stockQuantity: reward.stockQuantity || reward.StockQuantity
            });
        } else {
            setEditingReward(null);
            setFormData({ rewardName: '', pointsRequired: 0, stockQuantity: 0 });
        }
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this reward?')) return;
        try {
            const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');
            const adminName = admin.fullName || 'Admin';
            await rewardApi.delete(id, adminName);
            fetchRewards();
        } catch (error) {
            alert('Error deleting reward');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');
            const adminName = admin.fullName || 'Admin';

            // Chuẩn hóa dữ liệu sang PascalCase cho backend
            const payload = {
                RewardName: formData.rewardName,
                PointsRequired: parseInt(formData.pointsRequired),
                StockQuantity: parseInt(formData.stockQuantity)
            };

            if (editingReward) {
                await rewardApi.update(editingReward.id || editingReward.Id, payload, adminName);
            } else {
                await rewardApi.create(payload, adminName);
            }
            setShowModal(false);
            fetchRewards();
        } catch (error) {
            alert('Error saving reward');
        }
    };

    const filteredRewards = rewards.filter(r => 
        (r.rewardName || r.RewardName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in">
            <div className="top-bar">
                <div className="page-title">
                    <h1>Rewards & Gifts</h1>
                    <p>Manage items available for point redemption</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="search-box">
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Search gift name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        <Plus size={18} /> Add Reward
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899' }}>
                            <Gift size={20} />
                        </div>
                    </div>
                    <div className="stat-value">{rewards.length}</div>
                    <div className="stat-label">Active Rewards</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
                            <Zap size={20} />
                        </div>
                    </div>
                    <div className="stat-value">
                        {rewards.length > 0 ? Math.min(...rewards.map(r => r.pointsRequired || r.PointsRequired)) : 0}
                    </div>
                    <div className="stat-label">Min Points Required</div>
                </div>
            </div>

            <div className="rewards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {loading ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>
                         <Loader2 className="animate-spin" /> Loading rewards...
                    </div>
                ) : filteredRewards.map((reward) => (
                    <div key={reward.id || reward.Id} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: '12px' }}>
                                <Gift size={24} />
                            </div>
                            <span className={`status-pills ${(reward.stockQuantity || reward.StockQuantity) > 0 ? 'status-active' : 'status-inactive'}`}>
                                {(reward.stockQuantity || reward.StockQuantity) > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{reward.rewardName || reward.RewardName}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: 700 }}>
                                <Award size={16} />
                                {reward.pointsRequired || reward.PointsRequired} Points
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            <Package size={14} />
                            <span>Stock: {reward.stockQuantity || reward.StockQuantity} items remaining</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button 
                                className="btn" 
                                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                onClick={() => handleOpenModal(reward)}
                            >
                                <Edit2 size={16} /> Edit
                            </button>
                            <button 
                                className="btn" 
                                style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                onClick={() => handleDelete(reward.id || reward.Id)}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL FORM */}
            {showModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="stat-card" style={{ width: '100%', maxWidth: '450px', background: 'var(--bg-card)', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2>{editingReward ? 'Edit Reward' : 'Add New Reward'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Reward Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.rewardName}
                                    onChange={(e) => setFormData({...formData, rewardName: e.target.value})}
                                    placeholder="Enter gift name..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Points Required</label>
                                <input 
                                    type="number" 
                                    required
                                    min="0"
                                    value={formData.pointsRequired}
                                    onChange={(e) => setFormData({...formData, pointsRequired: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Stock Quantity</label>
                                <input 
                                    type="number" 
                                    required
                                    min="0"
                                    value={formData.stockQuantity}
                                    onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    {editingReward ? 'Update Reward' : 'Create Reward'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rewards;
