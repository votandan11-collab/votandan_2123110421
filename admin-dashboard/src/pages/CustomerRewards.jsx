import React, { useState, useEffect } from 'react';
import { rewardApi, customerApi } from '../api';
import CustomerHeader from '../components/CustomerHeader';
import CustomerFooter from '../components/CustomerFooter';
import { Gift, Award, Star, History, Loader2, CheckCircle2 } from 'lucide-react';

const CustomerRewards = () => {
  const [rewards, setRewards] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        fetchLatestUser(parsedUser.Id || parsedUser.id);
    }

    fetchRewards();
  }, []);

  const fetchLatestUser = async (id) => {
    try {
        const res = await customerApi.getById(id);
        setUser(res.data);
        localStorage.setItem('userData', JSON.stringify(res.data));
    } catch (err) {
        console.error(err);
    }
  };

  const fetchRewards = async () => {
    try {
      const res = await rewardApi.getAll();
      setRewards(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (reward) => {
    if (!user) return alert('Vui lòng đăng nhập để đổi quà!');
    if ((user.TotalPoints || user.totalPoints || 0) < (reward.PointsRequired || reward.pointsRequired)) return alert('Bạn không đủ điểm!');

    if (!window.confirm(`Bạn có chắc muốn dùng ${reward.PointsRequired} điểm để đổi "${reward.RewardName}"?`)) return;

    setRedeeming(reward.Id || reward.id);
    try {
      const res = await rewardApi.redeem({ 
        CustomerId: user.Id || user.id, 
        RewardId: reward.Id || reward.id 
      });
      
      alert(res.data.Message);
      
      // Update local points
      const updatedUser = { ...user, TotalPoints: res.data.NewPoints };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      await fetchRewards(); // refresh stock
    } catch (err) {
      alert(err.response?.data || 'Có lỗi xảy ra.');
    } finally {
      setRedeeming(null);
    }
  };

  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh', color: 'white' }}>
      <CustomerHeader user={user} handleLogout={() => { setUser(null); localStorage.removeItem('userData'); }} />

      <main style={{ maxWidth: '1400px', margin: '120px auto 100px', padding: '0 5%' }}>
        {/* VIP STATUS CARD */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)',
          borderRadius: '32px', padding: '48px', marginBottom: '60px',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}></div>
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', padding: '6px 16px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '20px', letterSpacing: '0.05em' }}>
                <Star size={14} fill="currentColor" /> VIP MEMBERSHIP PROGRAM
            </div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '12px', letterSpacing: '-0.04em' }}>Your Rewards</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '500px', lineHeight: '1.6' }}>Sử dụng điểm tích lũy từ mỗi đơn hàng để đổi những phần quà giới hạn và ưu đãi độc quyền.</p>
          </div>
          
          <div style={{ textAlign: 'right', position: 'relative', zIndex: 2 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'flex-end', marginBottom: '8px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Award size={28} />
                    </div>
                    <span style={{ fontSize: '3rem', fontWeight: 900, color: '#fbbf24', letterSpacing: '-0.02em' }}>{user?.TotalPoints || user?.totalPoints || 0}</span>
                </div>
                <p style={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Available Points</p>
            </div>
          </div>
        </div>

        {/* REWARDS GRID */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '16px' }}>
               <Gift color="#6366f1" size={32} /> Quà Tặng Độc Quyền
            </h2>
            <div style={{ color: '#64748b', fontWeight: 600 }}>{rewards.length} Phần quà đang mở</div>
        </div>

        {loading ? (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <Loader2 className="animate-spin" size={48} color="#6366f1" />
            </div>
        ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
                {rewards.map(reward => (
                    <div key={reward.Id || reward.id} style={{ 
                        background: 'rgba(255,255,255,0.02)', borderRadius: '28px', 
                        padding: '32px', border: '1px solid rgba(255,255,255,0.05)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative',
                        overflow: 'hidden'
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.transform = 'translateY(-10px)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                        e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.4)';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                    >
                        <div style={{ 
                            width: '64px', height: '64px', borderRadius: '20px', 
                            background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '28px', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.1)'
                        }}>
                             <Gift size={32} />
                        </div>

                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em' }}>{reward.RewardName || reward.rewardName}</h3>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 800, fontSize: '1.1rem' }}>
                                <Star size={18} fill="#fbbf24" /> {reward.PointsRequired || reward.pointsRequired}
                            </div>
                            <div style={{ 
                                padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800,
                                background: (reward.StockQuantity || reward.stockQuantity) > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: (reward.StockQuantity || reward.stockQuantity) > 0 ? '#10b981' : '#ef4444',
                                textTransform: 'uppercase', letterSpacing: '0.05em'
                            }}>
                                Stock: {reward.StockQuantity || reward.stockQuantity}
                            </div>
                        </div>

                        <button 
                            disabled={redeeming || (reward.StockQuantity || reward.stockQuantity) <= 0 || (user?.TotalPoints || user?.totalPoints || 0) < (reward.PointsRequired || reward.pointsRequired)}
                            onClick={() => handleRedeem(reward)}
                            style={{ 
                                width: '100%', height: '56px', borderRadius: '16px',
                                background: (reward.StockQuantity || reward.stockQuantity) <= 0 ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #6366f1, #a855f7)',
                                color: 'white', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                                transition: '0.3s', opacity: (redeeming || (reward.StockQuantity || reward.stockQuantity) <= 0) ? 0.5 : 1,
                                boxShadow: (reward.StockQuantity || reward.stockQuantity) > 0 ? '0 10px 20px rgba(99, 102, 241, 0.2)' : 'none'
                            }}>
                            {redeeming === (reward.Id || reward.id) ? 'PROCESSING...' : 'REDEEM NOW'}
                        </button>
                    </div>
                ))}
            </div>
        )}
      </main>

      <CustomerFooter />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}} />
    </div>
  );
};

export default CustomerRewards;
