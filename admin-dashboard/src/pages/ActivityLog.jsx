import React, { useState, useEffect } from 'react';
import { Shield, Search, Calendar, User, Info, Terminal, Activity, Filter } from 'lucide-react';
import axios from 'axios';

const ActivityLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAction, setFilterAction] = useState('ALL');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
            const response = await axios.get(`${API_BASE_URL}/ActivityLogs`);
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = 
            (log.adminName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.details || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.entityName || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesAction = filterAction === 'ALL' || log.action === filterAction;
        
        return matchesSearch && matchesAction;
    });

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', borderRadius: '12px' }}>
                            <Terminal size={24} />
                        </div>
                        <div>
                            <h1>Hệ Thống Nhật Ký (Audit Logs)</h1>
                            <p>Theo dõi mọi hoạt động thêm, sửa, xóa của quản trị viên</p>
                        </div>
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="search-box">
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm admin, nội dung..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        style={{ 
                            background: 'var(--bg-card)', color: 'white', border: '1px solid var(--border)',
                            borderRadius: '12px', padding: '0 15px', outline: 'none'
                        }}
                        value={filterAction}
                        onChange={(e) => setFilterAction(e.target.value)}
                    >
                        <option value="ALL">Tất cả hành động</option>
                        <option value="CREATE">Thêm mới</option>
                        <option value="UPDATE">Chỉnh sửa</option>
                        <option value="DELETE">Xóa</option>
                    </select>
                </div>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auth-fill, minmax(200px, 1fr))', marginBottom: '2rem' }}>
                 <div className="stat-card">
                    <div className="stat-label">Tổng số hoạt động</div>
                    <div className="stat-value">{logs.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Hành động hôm nay</div>
                    <div className="stat-value">
                        {logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length}
                    </div>
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center' }}>Đang tải nhật ký...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Thời gian</th>
                                <th>Admin</th>
                                <th>Hành động</th>
                                <th>Đối tượng</th>
                                <th>Chi tiết thay đổi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map((log) => (
                                <tr key={log.id}>
                                    <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        {formatDate(log.createdAt)}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={12} />
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{log.adminName}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ 
                                            padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800,
                                            background: `${getActionColor(log.action)}20`,
                                            color: getActionColor(log.action),
                                            border: `1px solid ${getActionColor(log.action)}40`
                                        }}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ color: '#94a3b8', fontWeight: 500 }}>{log.entityName}</span>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                                            {log.details}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                        Không tìm thấy hoạt động nào phù hợp.
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

export default ActivityLog;
