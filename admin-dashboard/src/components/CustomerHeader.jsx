import React, { useState, useEffect } from 'react';
import { User, LogOut, Wallet, ShieldCheck, ChevronDown, Smartphone, Globe, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categoryApi, customerApi } from '../api';

const CustomerHeader = ({ user, handleLogout }) => {
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [liveUser, setLiveUser] = useState(user);

  useEffect(() => {
    setLiveUser(user);
    if (user && (user.Id || user.id)) {
      fetchLatestPoints(user.Id || user.id);
    }
  }, [user]);

  const fetchLatestPoints = async (id) => {
    try {
      const res = await customerApi.getById(id);
      setLiveUser(res.data);
      // Cập nhật lại localStorage để các trang khác cũng có dữ liệu mới
      localStorage.setItem('userData', JSON.stringify(res.data));
    } catch (err) {
      console.error("Không thể cập nhật điểm mới nhất:", err);
    }
  };

  useEffect(() => {
    categoryApi.getAll().then(res => {
      setCategories(res.data);
    }).catch(console.error);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
      width: '90%', maxWidth: '1400px', zIndex: 1000,
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '24px',
      padding: '0.75rem 2rem',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* LOGO */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            width: '40px', height: '40px', borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
          }}>
            <Wallet color="white" size={20} />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>CARD STORE</span>
        </Link>

        {/* NAVIGATION */}
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div 
                style={{ position: 'relative' }}
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
            >
                <div style={{ 
                    color: isMenuOpen ? 'white' : '#94a3b8', 
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                    fontWeight: 600, fontSize: '0.9rem', transition: '0.3s'
                }}>
                    Thẻ Cào <ChevronDown size={14} style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                </div>

                <div style={{ 
                    position: 'absolute', top: '100%', left: '50%', transform: isMenuOpen ? 'translateX(-50%) translateY(15px)' : 'translateX(-50%) translateY(25px)',
                    width: '240px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px', padding: '10px', boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
                    opacity: isMenuOpen ? 1 : 0, visibility: isMenuOpen ? 'visible' : 'hidden',
                    transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 1100
                }}>
                    {categories.map(cat => (
                        <Link 
                            key={cat.id} to={`/?category=${cat.id}`}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                                textDecoration: 'none', borderRadius: '12px', color: '#cbd5e1',
                                transition: '0.2s', fontSize: '0.85rem', fontWeight: 500
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'; e.currentTarget.style.color = 'white'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#cbd5e1'; }}
                        >
                            <Smartphone size={16} color="#6366f1" /> {cat.name}
                        </Link>
                    ))}
                </div>
            </div>

            <Link to="/rewards" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', transition: '0.3s' }} onMouseOver={e => e.target.style.color = 'white'} onMouseOut={e => e.target.style.color = '#94a3b8'}>VIP Rewards</Link>
            <Link to="/promotions" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', transition: '0.3s' }} onMouseOver={e => e.target.style.color = 'white'} onMouseOut={e => e.target.style.color = '#94a3b8'}>Khuyến Mãi</Link>
        </nav>

        {/* USER ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {liveUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 800, fontSize: '0.85rem', color: 'white' }}>{liveUser.Name || liveUser.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800 }}>{liveUser.Level || liveUser.level || 'Silver'}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 800 }}>{liveUser.TotalPoints || liveUser.totalPoints || 0} pts</span>
                </div>
              </div>
              
              <Link to="/profile" style={{ 
                  background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', 
                  width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' 
              }} onMouseOver={e => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                  <User size={18} />
              </Link>

              <button onClick={handleLogout} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'none', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LogOut size={16} /></button>
            </div>
          ) : (
            <Link to="/customer-login" style={{ 
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: 'white', 
              padding: '10px 24px', borderRadius: '14px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.2)', transition: '0.3s'
            }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              Đăng Nhập
            </Link>
          )}
          
          <Link to="/login" style={{ width: '40px', height: '40px', background: 'rgba(255, 255, 255, 0.05)', color: '#64748b', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
            <ShieldCheck size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;
