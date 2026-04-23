import React, { useState, useEffect } from 'react';
import { Tags, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { categoryApi } from '../api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback
      setCategories([
        { id: 1, name: 'Beverages', description: 'All types of drinks' },
        { id: 2, name: 'Snacks', description: 'Light food items' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in">
      <div className="top-bar">
        <div className="page-title">
          <h1>Categories</h1>
          <p>Organize your products into logical groups.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> Add New Category
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat.id}>
                <td>#{cat.id}</td>
                <td style={{ fontWeight: 600 }}>{cat.name}</td>
                <td style={{ color: 'var(--text-muted)' }}>{cat.description || 'No description'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn" style={{ padding: '6px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn" style={{ padding: '6px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
