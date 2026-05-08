import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerApi } from '../api';
import CustomerHeader from '../components/CustomerHeader';
import CustomerFooter from '../components/CustomerFooter';
import { Mail, Lock, User, LogIn, UserPlus, KeyRound } from 'lucide-react';

const CustomerLogin = () => {
  const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot'
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        const res = await customerApi.login({ email: formData.email, password: formData.password });
        localStorage.setItem('userData', JSON.stringify(res.data));
        navigate('/');
      } else if (mode === 'register') {
        await customerApi.register(formData);
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        setMode('login');
        setFormData({ name: '', email: '', password: '' });
      } else if (mode === 'forgot') {
        const res = await customerApi.forgotPassword({ email: formData.email });
        setSuccess(res.data.message);
        // Sau 3 giây tự chuyển về login
        setTimeout(() => {
            setMode('login');
            setSuccess('');
        }, 3000);
      }
    } catch (err) {
      const errData = err.response?.data;
      setError(typeof errData === 'string' ? errData : 'Có lỗi xảy ra. Hãy thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CustomerHeader />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 80px' }}>
        <div style={{ 
          background: 'white', maxWidth: '460px', width: '100%', borderRadius: '20px', 
          padding: '45px 40px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          animation: 'fadeIn 0.5s ease'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea, #764ba2)', width: '70px', height: '70px', 
              borderRadius: '50%', margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              boxShadow: '0 8px 20px rgba(102,126,234,0.4)'
            }}>
              {mode === 'login' ? <LogIn size={30} /> : mode === 'register' ? <UserPlus size={30} /> : <KeyRound size={30} />}
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
              {mode === 'login' ? 'Chào Mừng Trở Lại!' : mode === 'register' ? 'Tạo Tài Khoản' : 'Khôi Phục Mật Khẩu'}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              {mode === 'login' ? 'Đăng nhập để mua thẻ nạp giá rẻ' : mode === 'register' ? 'Đăng ký miễn phí để nhận ưu đãi' : 'Nhập email để nhận mật khẩu mới'}
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>Họ và Tên</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text" placeholder="Nguyễn Văn A" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '13px 15px 13px 44px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '0.95rem', transition: '0.2s', outline: 'none' }}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="email" placeholder="email@example.com" 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: '13px 15px 13px 44px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '0.95rem', transition: '0.2s', outline: 'none' }}
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>Mật khẩu</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="password" placeholder="••••••••" 
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                    style={{ width: '100%', padding: '13px 15px 13px 44px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '0.95rem', transition: '0.2s', outline: 'none' }}
                    required
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div style={{ textAlign: 'right' }}>
                <span 
                    onClick={() => setMode('forgot')}
                    style={{ color: '#667eea', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                    Quên mật khẩu?
                </span>
              </div>
            )}

            <button 
              type="submit" disabled={loading}
              style={{ 
                width: '100%', padding: '14px', borderRadius: '10px', 
                background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                color: 'white', fontWeight: 700, fontSize: '1.05rem', border: 'none', 
                cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px',
                boxShadow: '0 4px 15px rgba(102,126,234,0.4)', transition: '0.2s',
                opacity: loading ? 0.7 : 1
              }}>
              {loading ? 'Đang xử lý...' : (mode === 'login' ? 'Đăng Nhập' : mode === 'register' ? 'Đăng Ký' : 'Gửi Yêu Cầu')}
            </button>
          </form>

          {/* Toggle */}
          <div style={{ textAlign: 'center', marginTop: '28px', color: '#64748b', fontSize: '0.95rem' }}>
            {mode === 'login' ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <span 
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setFormData({ name: '', email: '', password: '' }); setError(''); setSuccess(''); }}
              style={{ color: '#667eea', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
            </span>
          </div>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
};

export default CustomerLogin;
