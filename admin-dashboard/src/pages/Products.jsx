import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit2, Trash2, Save, X, ImageIcon } from 'lucide-react';
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
                stock: parseInt(formData.stock || 0)
            };
            if (editingId) {
                await productApi.update(editingId, { ...payload, id: editingId });
            } else {
                await productApi.create(payload);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', price: '', stock: '', categoryId: '', imageUrl: '', isActive: true });
            fetchData();
        } catch (error) {
            alert('Lỗi khi lưu sản phẩm. Vui lòng kiểm tra lại dữ liệu.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await productApi.delete(id);
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
                    <h1>Quản lý Thẻ Cào & Sản phẩm</h1>
                    <p>Thêm mới hoặc cập nhật kho hàng với hình ảnh minh họa</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? ' Hủy bỏ' : ' Thêm sản phẩm'}
                </button>
            </div>

            {showForm && (
                <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
                    <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="input-label">Tên sản phẩm/Thẻ</label>
                            <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        <div>
                            <label className="input-label">Giá (VNĐ)</label>
                            <input type="number" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                        </div>
                        <div>
                            <label className="input-label">Số lượng kho</label>
                            <input type="number" className="input-field" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
                        </div>
                        <div>
                            <label className="input-label">Danh mục/Nhà mạng</label>
                            <select className="input-field" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} required>
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Link ảnh (URL)</label>
                            <input type="text" className="input-field" placeholder="https://example.com/image.jpg" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1.5rem' }}>
                            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                            <label>Đang kinh doanh</label>
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
                <input type="text" placeholder="Tìm kiếm tên sản phẩm..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="table-container">
                {loading ? <p style={{ padding: '2rem', textAlign: 'center' }}>Đang tải dữ liệu...</p> : (
                    <table>
                        <thead>
                            <tr>
                                <th>Ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Giá bán</th>
                                <th>Kho</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <div style={{ 
                                            width: '50px', height: '50px', borderRadius: '10px', overflow: 'hidden', 
                                            background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {p.imageUrl ? (
                                                <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <ImageIcon size={20} color="#64748b" />
                                            )}
                                        </div>
                                    </td>
                                    <td><span style={{ fontWeight: 600 }}>{p.name}</span></td>
                                    <td><strong>{(p.price || 0).toLocaleString()}</strong> VNĐ</td>
                                    <td>{p.stock}</td>
                                    <td>
                                        <span className={`status-pills ${p.isActive ? 'status-active' : 'status-inactive'}`}>
                                            {p.isActive ? 'Đang bán' : 'Tạm ẩn'}
                                        </span>
                                    </td>
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
