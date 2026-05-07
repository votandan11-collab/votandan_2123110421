import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, User, Award, Mail, Wallet, Edit2, Trash2, X, Save } from 'lucide-react';
import { customerApi } from '../api';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const getAdminName = () => {
        const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');
        return admin.fullName || 'Admin';
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await customerApi.getAll();
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const adminName = getAdminName();
            if (editingId) {
                await customerApi.update(editingId, formData, adminName);
            } else {
                await customerApi.create(formData, adminName);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', email: '', password: '' });
            fetchCustomers();
        } catch (error) {
            alert('Lỗi khi lưu khách hàng.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
            try {
                await customerApi.delete(id, getAdminName());
                fetchCustomers();
            } catch (error) {
                alert('Không thể xóa khách hàng này.');
            }
        }
    };

    const startEdit = (c) => {
        setEditingId(c.id);
        setFormData({ name: c.name || '', email: c.email || '', password: '' });
        setShowForm(true);
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'Diamond': return '#f472b6';
            case 'Gold': return '#fbbf24';
            case 'VIP': return '#818cf8';
            case 'Silver': return '#94a3b8';
            default: return '#94a3b8';
        }
    };

    const filteredCustomers = customers.filter(c =>
        (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in">
            <div className="top-bar">
                <div className="page-title">
                    <h1>Quản lý Khách hàng</h1>
                    <p>Theo dõi và quản lý thành viên</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Tìm theo tên hoặc email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', email: '', password: '' }); }}>
                        {showForm ? <X size={18} /> : <UserPlus size={18} />}
                        {showForm ? ' Hủy' : ' Thêm khách hàng'}
                    </button>
                </div>
            </div>

            {/* Form thêm/sửa */}
            {showForm && (
                <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>{editingId ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}</h3>
                    <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Họ tên</label>
                            <input type="text" className="input-field" placeholder="Nguyễn Văn A" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Email</label>
                            <input type="email" className="input-field" placeholder="email@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                        </div>
                        {!editingId && (
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Mật khẩu</label>
                                <input type="password" className="input-field" placeholder="Mật khẩu" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required={!editingId} />
                            </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: '44px' }}>
                                <Save size={16} /> {editingId ? 'Cập nhật' : 'Lưu'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#6366f1' }}><Users size={20} /></div>
                    </div>
                    <div className="stat-value">{customers.length}</div>
                    <div className="stat-label">Tổng thành viên</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(244, 114, 182, 0.2)', color: '#f472b6' }}><Award size={20} /></div>
                    </div>
                    <div className="stat-value">{customers.filter(c => c.level === 'Diamond').length}</div>
                    <div className="stat-label">Diamond Members</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}><Wallet size={20} /></div>
                    </div>
                    <div className="stat-value">{customers.reduce((acc, curr) => acc + (curr.totalPoints || 0), 0).toLocaleString()}</div>
                    <div className="stat-label">Tổng điểm đã cấp</div>
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải danh sách khách hàng...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Điểm</th>
                                <th>Hạng</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={16} />
                                            </div>
                                            {customer.name || 'Chưa có tên'}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                                            <Mail size={14} />
                                            {customer.email || 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
                                            {(customer.totalPoints || 0).toLocaleString()}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="status-pills" style={{ background: `${getLevelColor(customer.level)}20`, color: getLevelColor(customer.level), border: `1px solid ${getLevelColor(customer.level)}30` }}>
                                            {customer.level}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => startEdit(customer)} className="btn" style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 10px' }}>
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(customer.id)} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '6px 10px' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCustomers.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                        Không tìm thấy khách hàng nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Customers;
