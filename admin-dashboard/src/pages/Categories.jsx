import React, { useState, useEffect } from 'react';
import { Tags, Plus, Search, Edit2, Trash2, Folder, Layers } from 'lucide-react';
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
                    <h1>Categories</h1>
                    <p>Organize your cards and products</p>
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
                        placeholder="Search categories..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.map((category) => (
                                <tr key={category.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Folder size={18} style={{ color: 'var(--primary)' }} />
                                            <span style={{ fontWeight: 600 }}>{category.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)' }}>{category.description || 'No description'}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn"><Edit2 size={14} /></button>
                                            <button className="btn" style={{ color: '#ef4444' }}><Trash2 size={14} /></button>
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
