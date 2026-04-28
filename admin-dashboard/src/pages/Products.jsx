import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit2, Trash2, Save, X, ImageIcon, Percent } from 'lucide-react';
import { productApi, categoryApi } from '../api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    
    // Form State
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        categoryId: '',
        imageUrl: '',
        discountRate: '4',
        isActive: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [prodRes, catRes] = await Promise.all([
                productApi.getAll(),
                categoryApi.getAll()
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = { 
                ...formData, 
                categoryId: parseInt(formData.categoryId),
                price: parseFloat(formData.price || 0),
                stock: parseInt(formData.stock || 0),
                discountRate: parseFloat(formData.discountRate || 4)
            };
            const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');
            const adminName = admin.fullName || 'Admin';

            if (editingId) {
                await productApi.update(editingId, { ...payload, id: editingId }, adminName);
            } else {
                await productApi.create(payload, adminName);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', price: '', stock: '', categoryId: '', imageUrl: '', discountRate: '4', isActive: true });
            fetchData();
        } catch (error) {
            alert('Lỗi khi lưu sản phẩm. Vui lòng kiểm tra lại dữ liệu.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');
                const adminName = admin.fullName || 'Admin';
                await productApi.delete(id, adminName);
                fetchData();
            } catch (error) {
                alert('Không thể xóa sản phẩm này.');
            }
        }
    };

    const startEdit = (p) => {
        setEditingId(p.id);
        setFormData({
            name: p.name,
            price: p.price.toString(),
            stock: p.stock.toString(),
            categoryId: p.categoryId.toString(),
            imageUrl: p.imageUrl || '',
            discountRate: (p.discountRate || 4).toString(),
            isActive: p.isActive
        });
        setShowForm(true);
    };

    const filteredProducts = products.filter(p => 
        (p.name || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-in">
            <div className="top-bar">
                <div className="page-title">
                    <h1>Quản lý Thẻ Cào (Hệ thống mới)</h1>
                    <p>Thiết lập mệnh giá, số lượng và chiết khấu cho mỗi loại thẻ</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? ' Hủy bỏ' : ' Thêm sản phẩm'}
                </button>
            </div>

            {showForm && (
                <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
                    <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="input-label">Tên sản phẩm/Loại thẻ (Vd: Garena)</label>
                            <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        <div>
                            <label className="input-label">Mệnh giá (Vd: 10000)</label>
                            <input type="number" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                        </div>
                        <div>
                            <label className="input-label">Số lượng hiện có</label>
                            <input type="number" className="input-field" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
                        </div>
                        <div>
                            <label className="input-label">Chiết khấu (%)</label>
                            <div style={{ position: 'relative' }}>
                                <Percent size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                <input type="number" className="input-field" value={formData.discountRate} onChange={e => setFormData({...formData, discountRate: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="input-label">Nhà mạng/Danh mục</label>
                            <select className="input-field" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} required>
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="input-label">Link Logo nhà mạng (URL)</label>
                            <input type="text" className="input-field" placeholder="https://example.com/logo-garena.jpg" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.5rem' }}>
                            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                            <label>Cho phép hiển thị</label>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                <Save size={18} /> {editingId ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm mới'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="search-box" style={{ marginBottom: '2rem' }}>
                <Search size={18} />
                <input type="text" placeholder="Tìm kiếm theo tên..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="table-container">
                {loading ? <p style={{ padding: '2rem', textAlign: 'center' }}>Đang tải dữ liệu...</p> : (
                    <table>
                        <thead>
                            <tr>
                                <th>Logo</th>
                                <th>Tên & Mệnh giá</th>
                                <th>Chiết khấu</th>
                                <th>Số lượng</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', background: '#f1f5f9' }}>
                                            {p.imageUrl ? <img src={p.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="" /> : <ImageIcon size={20} style={{ margin: '10px', color: '#94a3b8' }} />}
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <div style={{ fontWeight: 700 }}>{p.name}</div>
                                            <div style={{ color: '#6366f1', fontSize: '0.85rem' }}>{p.price.toLocaleString()}đ</div>
                                        </div>
                                    </td>
                                    <td><span style={{ color: '#10b981', fontWeight: 700 }}>{p.discountRate || 4}%</span></td>
                                    <td>{p.stock} thẻ</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => startEdit(p)} className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}><Edit2 size={14} /></button>
                                            <button onClick={() => handleDelete(p.id)} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}><Trash2 size={14} /></button>
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

export default Products;
