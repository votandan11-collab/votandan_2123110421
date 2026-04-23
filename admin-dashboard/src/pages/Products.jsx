import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit2, Trash2, Tag, Archive, CheckCircle, XCircle } from 'lucide-react';
import { productApi } from '../api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productApi.getAll();
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.category?.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-in">
            <div className="top-bar">
                <div className="page-title">
                    <h1>Menu & Products</h1>
                    <p>Manage cards, drinks, and toppings inventory</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} /> Add New Item
                </button>
            </div>

            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                <div className="search-box">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search products or categories..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                                                <Package size={18} style={{ color: 'var(--primary)' }} />
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{product.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                                            <Tag size={14} />
                                            {product.category?.name || 'Uncategorized'}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 700 }}>
                                            {product.price.toLocaleString()} VNĐ
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Archive size={14} style={{ color: 'var(--text-muted)' }} />
                                            <span style={{ color: product.stock < 10 ? '#ef4444' : 'inherit' }}>
                                                {product.stock} units
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-pills ${product.isActive ? 'status-active' : 'status-inactive'}`} 
                                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            {product.isActive ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                            {product.isActive ? 'Selling' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn" style={{ padding: '6px', background: 'rgba(255,255,255,0.05)' }}>
                                                <Edit2 size={14} />
                                            </button>
                                            <button className="btn" style={{ padding: '6px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No products found</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Products;
