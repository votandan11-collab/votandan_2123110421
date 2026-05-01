import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Shield, Plus, Search, MoreHorizontal, History, X, Clock, Terminal, Activity } from 'lucide-react';
import { employeeApi } from '../api';
import axios from 'axios';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [activityLogs, setActivityLogs] = useState([]);
    const [fetchingLogs, setFetchingLogs] = useState(false);

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

    const viewHistory = async (emp) => {
        setSelectedEmployee(emp);
        setFetchingLogs(true);
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
            const response = await axios.get(`${API_BASE_URL}/ActivityLogs`);
            // Filter logs for this specific employee by name
            const filtered = response.data.filter(log => {
                const logAdmin = log.adminName || log.AdminName || '';
                const empName = emp.fullName || '';
                return logAdmin.toLowerCase() === empName.toLowerCase();
            });
            setActivityLogs(filtered);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setFetchingLogs(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getActionColor = (action) => {
        switch(action) {
            case 'CREATE': return '#10b981';
            case 'UPDATE': return '#3b82f6';
            case 'DELETE': return '#ef4444';
            default: return '#94a3b8';
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
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button 
                                                onClick={() => viewHistory(emp)}
                                                style={{ 
                                                    background: 'rgba(99, 102, 241, 0.1)', border: 'none', color: '#6366f1', 
                                                    padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700,
                                                    transition: '0.3s'
                                                }}
                                                onMouseOver={e => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'}
                                                onMouseOut={e => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
                                            >
                                                <History size={14} /> History
                                            </button>
                                            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* HISTORY MODAL */}
            {selectedEmployee && (
                <div style={{ 
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
                    padding: '20px'
                }}>
                    <div className="animate-slide-in" style={{ 
                        background: 'var(--sidebar-bg)', width: '100%', maxWidth: '800px',
                        maxHeight: '85vh', borderRadius: '28px', border: '1px solid var(--glass-border)',
                        display: 'flex', flexDirection: 'column', overflow: 'hidden',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.6)'
                    }}>
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Hoạt động: {selectedEmployee.fullName}</h2>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Chi tiết nhật ký thao tác hệ thống</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedEmployee(null)}
                                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                            {fetchingLogs ? (
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '10px' }}><Clock size={32} color="#6366f1" /></div>
                                    <p style={{ color: '#64748b' }}>Đang tải lịch sử...</p>
                                </div>
                            ) : activityLogs.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                    <Terminal size={40} color="#334155" style={{ marginBottom: '16px' }} />
                                    <p style={{ color: '#64748b', fontWeight: 500 }}>Chưa có hoạt động nào được ghi nhận cho quản trị viên này.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {activityLogs.map((log) => (
                                        <div key={log.id} style={{ 
                                            background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '18px',
                                            border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '20px'
                                        }}>
                                            <div style={{ textAlign: 'center', minWidth: '100px' }}>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                                                    {new Date(log.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                                                </div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: 'white' }}>
                                                    {new Date(log.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            <div style={{ width: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}></div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                    <span style={{ 
                                                        padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 900,
                                                        background: `${getActionColor(log.action)}20`, color: getActionColor(log.action),
                                                        border: `1px solid ${getActionColor(log.action)}30`
                                                    }}>{log.action}</span>
                                                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{log.entityName}</span>
                                                </div>
                                                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5' }}>{log.details}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;
