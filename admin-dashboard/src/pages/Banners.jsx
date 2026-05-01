import React, { useState, useEffect } from 'react';
import { bannerApi } from '../api';
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';

const Banners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', imageUrl: '', description: '', displayOrder: 0, isActive: true });
    const [showAdd, setShowAdd] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const res = await bannerApi.getAdmin();
            setBanners(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');
            const adminName = admin.fullName || 'Admin';

            if (editingId) {
                await bannerApi.update(editingId, { ...editForm, id: editingId }, adminName);
            } else {
                await bannerApi.create(editForm, adminName);
            }
            fetchBanners();
            setShowAdd(false);
            setEditingId(null);
            setEditForm({ title: '', imageUrl: '', description: '', displayOrder: 0, isActive: true });
        } catch (err) {
            alert('Lỗi lưu banner. Vui lòng thử lại.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Xóa ảnh banner này?')) {
            const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');
            const adminName = admin.fullName || 'Admin';
            await bannerApi.delete(id, adminName);
            fetchBanners();
        }
    };

    const startEdit = (b) => {
        setEditingId(b.id);
        setEditForm(b);
        setShowAdd(true);
    };

    return (
        <div className="page-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title">Quản lý Banner Slideshow</h1>
                    <p className="page-subtitle">Thêm và cập nhật các hình ảnh trình chiếu tại trang chủ khách hàng.</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setShowAdd(!showAdd); setEditingId(null); setEditForm({ title: '', imageUrl: '', description: '', displayOrder: 0, isActive: true }); }}>
                    {showAdd ? <X size={18} /> : <Plus size={18} />}
                    {showAdd ? ' Hủy' : ' Thêm Banner'}
                </button>
            </header>

            {showAdd && (
                <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
                    <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="input-label">Tiêu đề Banner</label>
                            <input type="text" className="input-field" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} required />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="input-label">Link ảnh (URL)</label>
                            <input type="url" className="input-field" value={editForm.imageUrl} onChange={(e) => setEditForm({...editForm, imageUrl: e.target.value})} required placeholder="https://example.com/image.jpg" />
                        </div>
                        <div>
                            <label className="input-label">Mô tả ngắn</label>
                            <input type="text" className="input-field" value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="input-label">Thứ tự hiển thị</label>
                                <input type="number" className="input-field" value={editForm.displayOrder} onChange={(e) => setEditForm({...editForm, displayOrder: parseInt(e.target.value)})} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem', gap: '10px' }}>
                                <input type="checkbox" checked={editForm.isActive} onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})} />
                                <label>Hiển thị</label>
                            </div>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                <Save size={18} /> {editingId ? 'Cập nhật' : 'Lưu Banner'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {loading ? <p>Đang tải...</p> : banners.map(b => (
                    <div key={b.id} style={{ background: 'var(--card-bg)', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
                        <div style={{ height: '180px', background: `url(${b.imageUrl}) center/cover` }}>
                            {!b.isActive && (
                                <div style={{ background: 'rgba(0,0,0,0.6)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ color: 'white', fontWeight: 'bold' }}><EyeOff size={24} /> ĐANG ẨN</span>
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>{b.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{b.description}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Thứ tự: {b.displayOrder}</span>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => startEdit(b)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(b.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Banners;
