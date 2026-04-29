import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { employeeApi } from '../api';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await employeeApi.login({ username, password });
            const { token, fullName, role } = response.data;

            // Save to local storage
            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminUser', JSON.stringify({ fullName, role }));

            navigate('/admin');
        } catch (err) {
            const errData = err.response?.data;
            if (typeof errData === 'string') {
                setError(errData);
            } else if (errData?.title) {
                setError(errData.title);
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

  return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-dark)', position: 'relative', overflow: 'hidden', padding: '20px'
    }}>
      {/* Dynamic Background Elements */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', filter: 'blur(80px)' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)', filter: 'blur(80px)' }}></div>

      <div className="animate-slide-in" style={{
        background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(25px)',
        border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '32px',
        padding: '3.5rem 3rem', width: '100%', maxWidth: '440px',
        boxShadow: '0 40px 80px rgba(0, 0, 0, 0.5)', position: 'relative', zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            width: '72px', height: '72px', borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem', color: 'white',
            boxShadow: '0 12px 24px rgba(99, 102, 241, 0.3)',
            transform: 'rotate(-5deg)'
          }}>
            <ShieldCheck size={36} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>System Access</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.75rem', fontWeight: 500 }}>
            Quản trị viên vui lòng đăng nhập để tiếp tục
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                <User size={20} />
            </div>
            <input
              type="text" placeholder="Tên đăng nhập"
              style={{ 
                width: '100%', height: '60px', padding: '0 20px 0 56px', 
                borderRadius: '16px', background: 'rgba(2, 6, 23, 0.4)', 
                border: '1px solid rgba(255, 255, 255, 0.05)', color: 'white', 
                fontSize: '1rem', outline: 'none', transition: '0.3s'
              }}
              value={username} onChange={(e) => setUsername(e.target.value)} required
              onFocus={e => e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.05)'}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                <Lock size={20} />
            </div>
            <input
              type="password" placeholder="Mật khẩu"
              style={{ 
                width: '100%', height: '60px', padding: '0 20px 0 56px', 
                borderRadius: '16px', background: 'rgba(2, 6, 23, 0.4)', 
                border: '1px solid rgba(255, 255, 255, 0.05)', color: 'white', 
                fontSize: '1rem', outline: 'none', transition: '0.3s'
              }}
              value={password} onChange={(e) => setPassword(e.target.value)} required
              onFocus={e => e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.05)'}
            />
          </div>

          {error && (
            <div style={{ color: '#f43f5e', fontSize: '0.85rem', background: 'rgba(244, 63, 94, 0.1)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(244, 63, 94, 0.2)', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', height: '60px', borderRadius: '18px', 
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', 
              color: 'white', border: 'none', fontWeight: 800, fontSize: '1.1rem', 
              cursor: 'pointer', boxShadow: '0 12px 24px rgba(99, 102, 241, 0.2)',
              transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}
            onMouseOver={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (
              <>
                Đăng Nhập <ArrowRight size={20} />
              </>
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/" style={{ color: '#64748b', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600, transition: '0.3s' }}
              onMouseOver={(e) => e.target.style.color = 'white'}
              onMouseOut={(e) => e.target.style.color = '#64748b'}>
              ← Quay lại trang chủ
            </Link>
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-in { animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
      `}} />
    </div>
  );
};

export default LoginPage;