import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, Loader2, UserPlus, KeyRound } from 'lucide-react';
import { customerApi } from '../api';

const UserAuth = () => {
    const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (mode === 'login') {
                const response = await customerApi.login({
                    email: formData.email,
                    password: formData.password
                });
                
                localStorage.setItem('userToken', response.data.token);
                localStorage.setItem('userData', JSON.stringify(response.data));
                navigate('/');
            } else if (mode === 'register') {
                const response = await customerApi.register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                
                localStorage.setItem('userToken', response.data.user.token || 'fake-token');
                localStorage.setItem('userData', JSON.stringify(response.data.user));
                navigate('/');
            } else if (mode === 'forgot') {
                const response = await customerApi.forgotPassword({ email: formData.email });
                setSuccess(response.data.message);
                setMode('login'); // Quay lại trang login sau khi gửi mail
            }
        } catch (err) {
            setError(err.response?.data || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0f172a',
            padding: '20px'
        }}>
            <div className="animate-in" style={{
                background: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '2rem',
                width: '100%',
                maxWidth: '400px',
                color: 'white'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                        {mode === 'login' ? 'Đăng Nhập' : mode === 'register' ? 'Tạo Tài Khoản' : 'Khôi Phục Mật Khẩu'}
                    </h1>
                    <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
                        {mode === 'login' ? 'Chào mừng bạn quay lại!' : mode === 'register' ? 'Tham gia chương trình khách hàng thân thiết.' : 'Nhập email để nhận mật mã mới.'}
                    </p>
                </div>

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {mode === 'register' && (
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                type="text" name="name" placeholder="Họ và Tên" 
                                className="input-field" style={{ paddingLeft: '40px' }}
                                value={formData.name} onChange={handleChange} required
                            />
                        </div>
                    )}
                    
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                            type="email" name="email" placeholder="Địa chỉ Email" 
                            className="input-field" style={{ paddingLeft: '40px' }}
                            value={formData.email} onChange={handleChange} required
                        />
                    </div>

                    {mode !== 'forgot' && (
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                type="password" name="password" placeholder="Mật khẩu" 
                                className="input-field" style={{ paddingLeft: '40px' }}
                                value={formData.password} onChange={handleChange} required
                            />
                        </div>
                    )}

                    {mode === 'login' && (
                        <div style={{ textAlign: 'right' }}>
                            <span 
                                onClick={() => setMode('forgot')}
                                style={{ fontSize: '0.8rem', color: '#6366f1', cursor: 'pointer' }}
                            >
                                Quên mật khẩu?
                            </span>
                        </div>
                    )}

                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px' }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div style={{ color: '#10b981', fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '8px' }}>
                            {success}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                        {loading ? 'Đang xử lý...' : (mode === 'login' ? 'Đăng Nhập' : mode === 'register' ? 'Đăng Ký' : 'Gửi Yêu Cầu')}
                    </button>
                    
                    <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
                        {mode === 'login' ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
                        <span 
                            onClick={() => setMode(mode === 'login' ? 'register' : 'login')} 
                            style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}
                        >
                            {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default UserAuth;
