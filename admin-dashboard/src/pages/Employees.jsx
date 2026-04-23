import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Shield, Plus, Search, MoreHorizontal } from 'lucide-react';
import { employeeApi } from '../api';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await employeeApi.getAll();
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in">
            <div className="top-bar">
                <div className="page-title">
                    <h1>Employee Management</h1>
                    <p>Manage staff roles and permissions</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} /> Add Employee
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                            <UserCheck size={20} />
                        </div>
                    </div>
                    <div className="stat-value">{employees.length}</div>
                    <div className="stat-label">Total Staff</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#6366f1' }}>
                            <Shield size={20} />
                        </div>
                    </div>
                    <div className="stat-value">
                        {employees.filter(e => e.role === 'Admin').length}
                    </div>
                    <div className="stat-label">Admins</div>
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading employees...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Branch</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ 
                                                width: '32px', height: '32px', borderRadius: '50%', 
                                                background: emp.role === 'Admin' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: emp.role === 'Admin' ? 'var(--primary)' : 'var(--text-muted)'
                                            }}>
                                                <Users size={16} />
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{emp.fullName}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-pills ${emp.role === 'Admin' ? 'status-active' : ''}`} 
                                              style={{ background: emp.role === 'Admin' ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.05)', color: emp.role === 'Admin' ? 'var(--primary)' : 'var(--text-muted)' }}>
                                            {emp.role}
                                        </span>
                                    </td>
                                    <td>{emp.role === 'Admin' ? 'Management' : 'Branch Staff'}</td>
                                    <td>
                                        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                            <MoreHorizontal size={18} />
                                        </button>
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

export default Employees;
