import React, { useState, useEffect } from 'react';
import { Store, MapPin, Phone, Plus, Search, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { storeApi } from '../api';

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const response = await storeApi.getAll();
            setStores(response.data);
        } catch (error) {
            console.error('Error fetching stores:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in">
            <div className="top-bar">
                <div className="page-title">
                    <h1>Store Branches</h1>
                    <p>Manage your scratch card store locations</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} /> Add Branch
                </button>
            </div>

            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading branches...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Branch Name</th>
                                <th>Address</th>
                                <th>Contact</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stores.map((store) => (
                                <tr key={store.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '8px' }}>
                                                <Store size={18} />
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{store.storeName}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                                            <MapPin size={14} />
                                            {store.address}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                                            <Phone size={14} />
                                            {store.hotline || 'Not set'}
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
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Stores;
