import React, { useState, useEffect } from 'react';
import { User, LogOut, Wallet, ShieldCheck, ChevronDown, Smartphone, Globe, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categoryApi } from '../api';

const CustomerHeader = ({ user, handleLogout }) => {
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    categoryApi.getAll().then(res => {
      setCategories(res.data);
    }).catch(console.error);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0.75rem 5%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
        {/* LOGO */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            width: '42px', height: '42px', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
          }}>
            <Wallet color="white" size={22} />
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>CARD LOYALTY</span>
        </Link>

        {/* NAVIGATION */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {/* DROPDOWN MENU "THẺ CÀO" */}
            <div 
                style={{ position: 'relative', height: '60px', display: 'flex', alignItems: 'center' }}
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
            >
                <div style={{ 
                    color: isMenuOpen ? 'white' : '#94a3b8', 
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                    fontWeight: 600, fontSize: '0.95rem', transition: '0.3s'
                }}>
                    Thẻ Cào <ChevronDown size={14} style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                </div>

                {/* THE DROPDOWN CONTENT */}
                <div style={{ 
                    position: 'absolute', top: '55px', left: '-20px', width: '220px',
                    background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px', padding: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    opacity: isMenuOpen ? 1 : 0,
                    visibility: isMenuOpen ? 'visible' : 'hidden',
                    transform: isMenuOpen ? 'translateY(0)' : 'translateY(10px)',
                    transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                    {categories.length > 0 ? categories.map(cat => (
                        <Link 
                            key={cat.id} 
                            to={`/?category=${cat.id}`}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                                textDecoration: 'none', borderRadius: '10px', color: '#cbd5e1',
                                transition: '0.2s'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'; e.currentTarget.style.color = 'white'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#cbd5e1'; }}
                        >
                            <Smartphone size={16} color="#6366f1" />
                            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{cat.name}</span>
                        </Link>
                    )) : (
                        <div style={{ padding: '12px', color: '#64748b', fontSize: '0.85rem' }}>Đang tải nhà mạng...</div>
                    )}
                    <div style={{ margin: '8px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}></div>
                    <Link to="/" style={{ 
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                        textDecoration: 'none', color: '#94a3b8', fontSize: '0.85rem'
                    }}>
                        <Globe size={16} /> Xem tất cả thẻ
                    </Link>
                </div>
            </div>

            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>Khuyến Mãi</Link>
            <Link to="/rewards" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>VIP Rewards</Link>
          </nav>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>{user.Name || user.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>{user.Level || user.level || 'Silver'}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6366f1' }}>•</span>
                  <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 700 }}>{user.TotalPoints || user.totalPoints || 0} pts</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                style={{ 
                  background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none',
                  padding: '10px', borderRadius: '12px', cursor: 'pointer', transition: '0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/customer-login" style={{ 
              background: '#6366f1', color: 'white', padding: '11px 26px', 
              borderRadius: '14px', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)', transition: '0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Đăng Nhập
            </Link>
          )}
          
          <Link to="/login" style={{ 
              background: 'rgba(255, 255, 255, 0.05)', color: '#64748b', 
              padding: '10px', borderRadius: '12px', display: 'flex', transition: '0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'white'}
          onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
          >
            <ShieldCheck size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;
