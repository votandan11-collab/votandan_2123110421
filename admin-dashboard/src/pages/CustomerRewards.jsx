import React, { useState, useEffect } from 'react';
import { rewardApi } from '../api';
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
    if (savedUser) setUser(JSON.parse(savedUser));

    fetchRewards();
  }, []);

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
    if (user.TotalPoints < reward.PointsRequired) return alert('Bạn không đủ điểm!');

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
    <div style={{ background: '#0f172a', minHeight: '100vh', color: 'white' }}>
      <CustomerHeader user={user} handleLogout={() => { setUser(null); localStorage.removeItem('userData'); }} />

      <main style={{ maxWidth: '1400px', margin: '100px auto', padding: '0 20px' }}>
        {/* User Stats Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '24px', padding: '40px', marginBottom: '50px',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '10px' }}>VIP Rewards</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Sử dụng điểm tích lũy của bạn để đổi những phần quà hấp dẫn.</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'flex-end', marginBottom: '5px' }}>
                <Star color="#fbbf24" fill="#fbbf24" size={24} />
                <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fbbf24' }}>{user?.TotalPoints || 0}</span>
            </div>
            <p style={{ color: '#94a3b8', fontWeight: 600 }}>Điểm hiện có của bạn</p>
          </div>
        </div>

        {/* Rewards Grid */}
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
           <Gift color="#6366f1" /> Danh Sách Quà Tặng
        </h2>

        {loading ? (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <Loader2 className="animate-spin" size={40} color="#6366f1" />
            </div>
        ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                {rewards.map(reward => (
                    <div key={reward.Id || reward.id} style={{ 
                        background: 'rgba(30, 41, 59, 0.5)', borderRadius: '20px', 
                        padding: '25px', border: '1px solid rgba(255,255,255,0.05)',
                        transition: '0.3s', position: 'relative'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ 
                            width: '60px', height: '60px', borderRadius: '16px', 
                            background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '20px'
                        }}>
                             <Award size={30} />
                        </div>

                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '10px' }}>{reward.RewardName || reward.rewardName}</h3>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 700 }}>
                                <Star size={16} fill="#fbbf24" /> {reward.PointsRequired || reward.pointsRequired} Điểm
                            </div>
                            <div style={{ fontSize: '0.85rem', color: (reward.StockQuantity || reward.stockQuantity) > 0 ? '#4ade80' : '#f87171' }}>
                                Còn lại: {reward.StockQuantity || reward.stockQuantity}
                            </div>
                        </div>

                        <button 
                            disabled={redeeming || (reward.StockQuantity || reward.stockQuantity) <= 0 || (user?.TotalPoints || 0) < (reward.PointsRequired || reward.pointsRequired)}
                            onClick={() => handleRedeem(reward)}
                            style={{ 
                                width: '100%', padding: '12px', borderRadius: '12px',
                                background: (reward.StockQuantity || reward.stockQuantity) <= 0 ? '#334155' : 'linear-gradient(135deg, #6366f1, #a855f7)',
                                color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer',
                                transition: '0.3s', opacity: (redeeming || (reward.StockQuantity || reward.stockQuantity) <= 0) ? 0.6 : 1
                            }}>
                            {redeeming === (reward.Id || reward.id) ? 'ĐANG XỬ LÝ...' : 'ĐỔI NGAY'}
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
