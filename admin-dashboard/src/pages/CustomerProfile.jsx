import React, { useState, useEffect } from 'react';
import { orderApi } from '../api';
import CustomerHeader from '../components/CustomerHeader';
import CustomerFooter from '../components/CustomerFooter';
import { ShoppingBag, Ticket, Clock, CheckCircle2, Copy, User, ChevronRight, Zap, ExternalLink } from 'lucide-react';

const CustomerProfile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        const savedUser = localStorage.getItem('userData');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            fetchData(parsedUser.Id || parsedUser.id);
        }
        
        // Load coupons from localStorage
        const savedCoupons = JSON.parse(localStorage.getItem('redeemedCoupons') || '[]');
        setCoupons(savedCoupons);
    }, []);

    const fetchData = async (userId) => {
        try {
            const res = await orderApi.getByCustomerId(userId);
            setOrders(res.data.sort((a, b) => new Date(b.createdAt || b.CreatedAt) - new Date(a.createdAt || a.CreatedAt)));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Đã sao chép mã giảm giá!');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div style={{ background: 'var(--bg-dark)', minHeight: '100vh', color: 'white' }}>
            <CustomerHeader user={user} handleLogout={() => { setUser(null); localStorage.removeItem('userData'); window.location.href='/'; }} />

            <main style={{ maxWidth: '1200px', margin: '120px auto 100px', padding: '0 5%' }}>
                {/* PROFILE HEADER */}
                <div style={{ 
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                    borderRadius: '32px', padding: '40px', marginBottom: '40px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', gap: '30px',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ 
                        width: '100px', height: '100px', borderRadius: '30px', 
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)'
                    }}>
                        <User size={50} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>{user?.Name || user?.name || 'Khách hàng'}</h1>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700 }}>
                                <Zap size={16} fill="#10b981" /> {user?.Level || user?.level || 'Silver'} Member
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 700 }}>
                                <Clock size={16} /> {user?.TotalPoints || user?.totalPoints || 0} Points Available
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABS */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '18px', width: 'fit-content' }}>
                    <button 
                        onClick={() => setActiveTab('orders')}
                        style={{ 
                            padding: '12px 24px', borderRadius: '14px', border: 'none', 
                            background: activeTab === 'orders' ? '#6366f1' : 'transparent',
                            color: 'white', fontWeight: 700, cursor: 'pointer', transition: '0.3s',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        <ShoppingBag size={18} /> Lịch sử đơn hàng
                    </button>
                    <button 
                        onClick={() => setActiveTab('coupons')}
                        style={{ 
                            padding: '12px 24px', borderRadius: '14px', border: 'none', 
                            background: activeTab === 'coupons' ? '#6366f1' : 'transparent',
                            color: 'white', fontWeight: 700, cursor: 'pointer', transition: '0.3s',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        <Ticket size={18} /> Mã giảm giá của tôi
                    </button>
                </div>

                {/* CONTENT */}
                <div style={{ minHeight: '400px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '100px' }}>Đang tải dữ liệu...</div>
                    ) : activeTab === 'orders' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {orders.length > 0 ? orders.map(order => (
                                <div key={order.id || order.Id} style={{ 
                                    background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '30px',
                                    border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    transition: '0.3s'
                                }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CheckCircle2 size={28} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>Đơn hàng #{order.id || order.Id}</div>
                                            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{formatDate(order.createdAt || order.CreatedAt)}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#6366f1', marginTop: '6px', fontWeight: 600 }}>{order.updatedBy || order.UpdatedBy}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fbbf24' }}>{(order.totalAmount || order.TotalAmount || 0).toLocaleString()}đ</div>
                                        <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginTop: '4px' }}>HOÀN TẤT</div>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '80px', background: 'rgba(255,255,255,0.01)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                    <ShoppingBag size={48} color="#334155" style={{ marginBottom: '16px' }} />
                                    <p style={{ color: '#64748b' }}>Bạn chưa có đơn hàng nào.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                            {coupons.length > 0 ? coupons.map(coupon => (
                                <div key={coupon.id} style={{ 
                                    background: 'rgba(15, 23, 42, 0.6)', borderRadius: '24px', overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.08)', position: 'relative',
                                    opacity: coupon.used ? 0.5 : 1
                                }}>
                                    <div style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Ticket size={30} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 900, fontSize: '1.2rem' }}>{coupon.name}</div>
                                            <div style={{ color: '#10b981', fontWeight: 800 }}>GIẢM {coupon.discount}%</div>
                                        </div>
                                    </div>
                                    <div style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <code style={{ fontSize: '1.1rem', fontWeight: 800, color: '#6366f1' }}>{coupon.code}</code>
                                        <button 
                                            disabled={coupon.used}
                                            onClick={() => copyToClipboard(coupon.code)}
                                            style={{ background: 'white', color: 'black', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                        >
                                            {coupon.used ? 'ĐÃ DÙNG' : <><Copy size={14} /> COPY</>}
                                        </button>
                                    </div>
                                    {coupon.used && <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 900 }}>USED</div>}
                                </div>
                            )) : (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px', background: 'rgba(255,255,255,0.01)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                    <Ticket size={48} color="#334155" style={{ marginBottom: '16px' }} />
                                    <p style={{ color: '#64748b' }}>Bạn chưa đổi mã giảm giá nào.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <CustomerFooter />
        </div>
    );
};

export default CustomerProfile;
