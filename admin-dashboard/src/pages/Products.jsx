import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
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
      const response = await productApi.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback dummy data for demo if API is not running
      setProducts([
        { id: 1, name: 'Premium Coffee Bean', price: 15.00, stock: 100, category: 'Beans', isActive: true },
        { id: 2, name: 'Espresso Machine', price: 450.00, stock: 15, category: 'Equipment', isActive: true },
      ]);
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
          <h1>Products</h1>
          <p>Manage your product inventory and pricing.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="input-field" 
            style={{ paddingLeft: '40px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>#{product.id}</td>
                <td style={{ fontWeight: 600 }}>{product.name}</td>
                <td>{product.category?.name || 'N/A'}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`status-pills ${product.isActive ? 'status-active' : 'status-inactive'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
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

export default Products;
