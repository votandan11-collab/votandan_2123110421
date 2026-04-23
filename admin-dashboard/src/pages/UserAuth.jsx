import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, Loader2, UserPlus } from 'lucide-react';
import { customerApi } from '../api';

const UserAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // For simplicity, we search the customer list for match
                // In production, use a proper Auth endpoint
                const customers = await customerApi.getAll();
                const user = customers.data.find(c => c.email === formData.email && c.password === formData.password);
                
                if (user) {
                    localStorage.setItem('userToken', 'user-token-' + user.id);
                    localStorage.setItem('userData', JSON.stringify(user));
                    navigate('/');
                } else {
                    setError('Invalid email or password');
                }
            } else {
                // Register
                const response = await customerApi.create({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                localStorage.setItem('userToken', 'user-token-' + response.data.id);
                localStorage.setItem('userData', JSON.stringify(response.data));
                navigate('/');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
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
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{isLogin ? 'Customer Login' : 'Create Account'}</h1>
                    <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
                        {isLogin ? 'Welcome back! Manage your points.' : 'Join the loyalty program today.'}
                    </p>
                </div>

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {!isLogin && (
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                type="text" name="name" placeholder="Full Name" 
                                className="input-field" style={{ paddingLeft: '40px' }}
                                value={formData.name} onChange={handleChange} required
                            />
                        </div>
                    )}
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                            type="email" name="email" placeholder="Email Address" 
                            className="input-field" style={{ paddingLeft: '40px' }}
                            value={formData.email} onChange={handleChange} required
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                            type="password" name="password" placeholder="Password" 
                            className="input-field" style={{ paddingLeft: '40px' }}
                            value={formData.password} onChange={handleChange} required
                        />
                    </div>

                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
                    </button>
                    
                    <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span 
                            onClick={() => setIsLogin(!isLogin)} 
                            style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}
                        >
                            {isLogin ? 'Register' : 'Login'}
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default UserAuth;
