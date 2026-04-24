import React from 'react';
import { User, LogOut, Wallet, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CustomerHeader = ({ user, handleLogout }) => {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '1rem 5%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            width: '40px', height: '40px', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Wallet color="white" size={24} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>CARD LOYALTY</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Thẻ Cào</Link>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Khuyến Mãi</Link>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Hướng Dẫn</Link>
          </nav>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>{user.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>{user.level}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6366f1' }}>•</span>
                  <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 600 }}>{user.totalPoints} pts</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                style={{ 
                  background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none',
                  padding: '10px', borderRadius: '10px', cursor: 'pointer', transition: '0.3s'
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/user-auth" style={{ 
              background: '#6366f1', color: 'white', padding: '10px 24px', 
              borderRadius: '12px', textDecoration: 'none', fontWeight: 600,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}>
              Tham Gia Ngay
            </Link>
          )}
          
          <Link to="/login" style={{ 
              background: 'rgba(255, 255, 255, 0.03)', color: '#64748b', 
              padding: '8px', borderRadius: '8px', display: 'flex'
          }}>
            <ShieldCheck size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;
