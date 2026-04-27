import React, { useState, useEffect } from 'react';
import { Tags, Plus, Search, Edit2, Trash2, Save, X, Folder } from 'lucide-react';
import { categoryApi } from '../api';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    
    // Form State
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoryApi.getAll();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await categoryApi.update(editingId, { ...formData, id: editingId });
            } else {
                await categoryApi.create(formData);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', description: '' });
            fetchCategories();
        } catch (error) {
            alert('Lỗi khi lưu danh mục. Vui lòng thử lại.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Xác nhận xóa danh mục này? Lưu ý: Nếu có sản phẩm trong danh mục này, bạn không thể xóa.')) {
            try {
                await categoryApi.delete(id);
                fetchCategories();
            } catch (error) {
                alert('Không thể xóa danh mục này. Hãy đảm bảo danh mục đang trống (không có sản phẩm nào thuộc danh mục này).');
            }
        }
    };

    const startEdit = (c) => {
        setEditingId(c.id);
        setFormData({
            name: c.name,
            description: c.description || ''
        });
        setShowForm(true);
    };

    const filteredCategories = categories.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-in">
            <div className="top-bar">
                <div className="page-title">
                    <h1>Quản lý Danh mục & Nhà mạng</h1>
                    <p>Phân loại các loại thẻ cào và sản phẩm khác</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? ' Hủy' : ' Thêm danh mục'}
                </button>
            </div>

            {showForm && (
                <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
                    <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label className="input-label">Tên nhà mạng (Vd: Viettel, Garena...)</label>
                            <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        <div>
                            <label className="input-label">Link Logo nhà mạng (URL)</label>
                            <input type="text" className="input-field" placeholder="https://example.com/logo.png" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                <Save size={18} /> {editingId ? 'Cập nhật danh mục' : 'Lưu nhà mạng mới'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="search-box" style={{ marginBottom: '2rem', maxWidth: '400px' }}>
                <Search size={18} />
                <input type="text" placeholder="Tìm kiếm nhà mạng..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="table-container">
                {loading ? <p style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</p> : (
                    <table>
                        <thead>
                            <tr>
                                <th>Hình Ảnh / Logo</th>
                                <th>Tên nhà mạng</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.map((c) => (
                                <tr key={c.id}>
                                    <td>
                                        <div style={{ width: '80px', height: '40px', background: 'white', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                                            {c.description && c.description.startsWith('http') ? (
                                                <img src={c.description} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            ) : (
                                                <Folder size={20} color="#94a3b8" />
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>{c.name}</span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => startEdit(c)} className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}><Edit2 size={14} /></button>
                                            <button onClick={() => handleDelete(c.id)} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Categories;
