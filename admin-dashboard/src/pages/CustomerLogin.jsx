import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerApi } from '../api';
import CustomerHeader from '../components/CustomerHeader';
import CustomerFooter from '../components/CustomerFooter';
import { Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';

const CustomerLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const res = await customerApi.login({ email: formData.email, password: formData.password });
        localStorage.setItem('userData', JSON.stringify(res.data));
        navigate('/');
      } else {
        await customerApi.register(formData);
        setError('');
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (err) {
      const errData = err.response?.data;
      if (typeof errData === 'string') {
        setError(errData);
      } else if (errData?.title) {
        setError(errData.title);
      } else if (errData?.errors) {
        setError(Object.values(errData.errors).flat().join(', '));
      } else {
        setError('Có lỗi xảy ra. Hãy thử lại.');
      }
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
              {isLogin ? <LogIn size={30} /> : <UserPlus size={30} />}
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
              {isLogin ? 'Chào Mừng Trở Lại!' : 'Tạo Tài Khoản'}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              {isLogin ? 'Đăng nhập để mua thẻ nạp giá rẻ' : 'Đăng ký miễn phí để nhận ưu đãi'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>Họ và Tên</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text" placeholder="Nguyễn Văn A" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '13px 15px 13px 44px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '0.95rem', transition: '0.2s', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#667eea'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
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
                  onFocus={e => e.target.style.borderColor = '#667eea'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>Mật khẩu</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="password" placeholder="••••••••" 
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                  style={{ width: '100%', padding: '13px 15px 13px 44px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '0.95rem', transition: '0.2s', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#667eea'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  required
                />
              </div>
            </div>

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
              {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng Nhập' : 'Đăng Ký')}
            </button>
          </form>

          {/* Toggle */}
          <div style={{ textAlign: 'center', marginTop: '28px', color: '#64748b', fontSize: '0.95rem' }}>
            {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <span 
              onClick={() => { setIsLogin(!isLogin); setFormData({ name: '', email: '', password: '' }); setError(''); }}
              style={{ color: '#667eea', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </span>
          </div>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
};

export default CustomerLogin;
