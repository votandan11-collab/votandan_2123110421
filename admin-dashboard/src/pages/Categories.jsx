import React, { useState, useEffect } from 'react';
import { Tags, Plus, Search, Edit, Trash2, Folder, Layers } from 'lucide-react';
import { categoryApi } from '../api';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

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

    const filteredCategories = categories.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-in">
            <div className="top-bar">
                <div className="page-title">
                    <h1>Product Categories</h1>
                    <p>Organize your products into logical groups</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} /> New Category
                </button>
            </div>

            <div style={{ marginBottom: '2rem', maxWidth: '400px' }}>
                <div className="search-box">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Filter categories..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                            <Layers size={20} />
                        </div>
                    </div>
                    <div className="stat-value">{categories.length}</div>
                    <div className="stat-label">Total Categories</div>
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading categories...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Category Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.map((category) => (
                                <tr key={category.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                                <Folder size={18} style={{ color: 'var(--primary)' }} />
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{category.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            {category.description || 'No description provided'}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn" style={{ padding: '6px', background: 'rgba(255,255,255,0.05)' }}>
                                                <Edit size={14} />
                                            </button>
                                            <button className="btn" style={{ padding: '6px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCategories.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                        No categories found
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

export default Categories;
