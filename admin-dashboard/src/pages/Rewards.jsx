import React, { useState, useEffect } from 'react';
import { Gift, Search, Plus, Trash2, Award, Zap, Package } from 'lucide-react';
import { rewardApi } from '../api';

const Rewards = () => {
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredRewards = rewards.filter(r => 
        r.rewardName.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <button className="btn btn-primary">
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
                        {Math.min(...rewards.map(r => r.pointsRequired), 0)}
                    </div>
                    <div className="stat-label">Min Points Required</div>
                </div>
            </div>

            <div className="rewards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {loading ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>Loading rewards...</div>
                ) : filteredRewards.map((reward) => (
                    <div key={reward.id} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: '12px' }}>
                                <Gift size={24} />
                            </div>
                            <span className={`status-pills ${reward.stockQuantity > 0 ? 'status-active' : 'status-inactive'}`}>
                                {reward.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{reward.rewardName}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: 700 }}>
                                <Award size={16} />
                                {reward.pointsRequired} Points
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            <Package size={14} />
                            <span>Stock: {reward.stockQuantity} items remaining</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>Edit</button>
                            <button className="btn" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rewards;
