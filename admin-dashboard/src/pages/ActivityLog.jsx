import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Terminal, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import axios from 'axios';

const POLL_INTERVAL = 5000; // 5 giây

const ActivityLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAction, setFilterAction] = useState('ALL');
    const [isLive, setIsLive] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [newLogIds, setNewLogIds] = useState(new Set()); // IDs vừa được thêm vào (để flash)
    const prevLogIdsRef = useRef(new Set());
    const intervalRef = useRef(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    const fetchLogs = async (isInitial = false) => {
        try {
            if (isInitial) setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/ActivityLogs`);
            const fetched = response.data;

            // Tìm các log mới (chưa có trong lần fetch trước)
            const fetchedIds = new Set(fetched.map(l => l.id));
            const newIds = new Set();
            if (!isInitial) {
                fetchedIds.forEach(id => {
                    if (!prevLogIdsRef.current.has(id)) {
                        newIds.add(id);
                    }
                });
                if (newIds.size > 0) setNewLogIds(newIds);
            }
            prevLogIdsRef.current = fetchedIds;

            setLogs(fetched);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            if (isInitial) setLoading(false);
        }
    };

    // Xóa class flash sau 3 giây
    useEffect(() => {
        if (newLogIds.size > 0) {
            const timer = setTimeout(() => setNewLogIds(new Set()), 3000);
            return () => clearTimeout(timer);
        }
    }, [newLogIds]);

    // Bắt đầu / dừng polling
    useEffect(() => {
        fetchLogs(true);
        if (isLive) {
            intervalRef.current = setInterval(() => fetchLogs(false), POLL_INTERVAL);
        }
        return () => clearInterval(intervalRef.current);
    }, [isLive]);

    const toggleLive = () => {
        if (isLive) {
            clearInterval(intervalRef.current);
        } else {
            intervalRef.current = setInterval(() => fetchLogs(false), POLL_INTERVAL);
            fetchLogs(false);
        }
        setIsLive(prev => !prev);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    const getActionColor = (action) => {
        switch (action) {
            case 'CREATE': return '#10b981';
            case 'UPDATE': return '#3b82f6';
            case 'DELETE': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    const getActionLabel = (action) => {
        switch (action) {
            case 'CREATE': return 'Thêm mới';
            case 'UPDATE': return 'Cập nhật';
            case 'DELETE': return 'Xóa';
            default: return action;
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch =
            (log.adminName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.details || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.entityName || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAction = filterAction === 'ALL' || log.action === filterAction;
        return matchesSearch && matchesAction;
    });

    const todayCount = logs.filter(l =>
        new Date(l.createdAt).toDateString() === new Date().toDateString()
    ).length;

    return (
        <div className="animate-in">
            {/* CSS cho animation flash */}
            <style>{`
                @keyframes flashNew {
                    0% { background: rgba(99, 102, 241, 0.25); }
                    100% { background: transparent; }
                }
                .log-new {
                    animation: flashNew 3s ease-out forwards;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                .live-dot {
                    animation: pulse 1.5s ease-in-out infinite;
                }
            `}</style>

            {/* Header */}
            <div className="top-bar">
                <div className="page-title">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', borderRadius: '12px' }}>
                            <Terminal size={24} />
                        </div>
                        <div>
                            <h1>Nhật Ký Hoạt Động</h1>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                {isLive ? (
                                    <>
                                        <span className="live-dot" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                                        <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.8rem' }}>LIVE</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                            · Cập nhật mỗi 5 giây
                                            {lastUpdated && ` · Lần cuối: ${lastUpdated.toLocaleTimeString('vi-VN')}`}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <WifiOff size={14} style={{ color: '#ef4444' }} />
                                        <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.8rem' }}>TẠM DỪNG</span>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {/* Nút bật/tắt Live */}
                    <button
                        onClick={toggleLive}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '10px',
                            border: `1px solid ${isLive ? '#10b981' : '#ef4444'}`,
                            background: isLive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: isLive ? '#10b981' : '#ef4444',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        {isLive ? <Wifi size={14} /> : <WifiOff size={14} />}
                        {isLive ? 'Live On' : 'Live Off'}
                    </button>

                    {/* Nút làm mới thủ công */}
                    <button
                        onClick={() => fetchLogs(false)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '10px',
                            border: '1px solid var(--glass-border)',
                            background: 'var(--card-bg)',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: 600,
                            fontSize: '0.8rem'
                        }}
                    >
                        <RefreshCw size={14} /> Làm mới
                    </button>

                    {/* Search */}
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm admin, nội dung..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter */}
                    <select
                        style={{
                            background: 'var(--card-bg)', color: 'white',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px', padding: '0 15px',
                            outline: 'none', height: '42px', cursor: 'pointer'
                        }}
                        value={filterAction}
                        onChange={(e) => setFilterAction(e.target.value)}
                    >
                        <option value="ALL">Tất cả</option>
                        <option value="CREATE">Thêm mới</option>
                        <option value="UPDATE">Chỉnh sửa</option>
                        <option value="DELETE">Xóa</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-label">Tổng hoạt động</div>
                    <div className="stat-value">{logs.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Hôm nay</div>
                    <div className="stat-value" style={{ color: '#6366f1' }}>{todayCount}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Thêm mới</div>
                    <div className="stat-value" style={{ color: '#10b981' }}>
                        {logs.filter(l => l.action === 'CREATE').length}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Chỉnh sửa</div>
                    <div className="stat-value" style={{ color: '#3b82f6' }}>
                        {logs.filter(l => l.action === 'UPDATE').length}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Đã xóa</div>
                    <div className="stat-value" style={{ color: '#ef4444' }}>
                        {logs.filter(l => l.action === 'DELETE').length}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Đang tải nhật ký...
                    </div>
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
                                <tr
                                    key={log.id}
                                    className={newLogIds.has(log.id) ? 'log-new' : ''}
                                    style={{ transition: 'background 0.3s' }}
                                >
                                    <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        {newLogIds.has(log.id) && (
                                            <span style={{
                                                display: 'inline-block', marginRight: '6px',
                                                background: '#6366f1', color: 'white',
                                                fontSize: '0.65rem', fontWeight: 800,
                                                padding: '2px 6px', borderRadius: '4px',
                                                letterSpacing: '0.05em'
                                            }}>MỚI</span>
                                        )}
                                        {formatDate(log.createdAt)}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                width: '28px', height: '28px', borderRadius: '50%',
                                                background: 'rgba(99,102,241,0.15)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#6366f1'
                                            }}>
                                                <User size={14} />
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{log.adminName}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '6px',
                                            fontSize: '0.75rem', fontWeight: 800,
                                            background: `${getActionColor(log.action)}20`,
                                            color: getActionColor(log.action),
                                            border: `1px solid ${getActionColor(log.action)}40`
                                        }}>
                                            {getActionLabel(log.action)}
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
                                        Không tìm thấy hoạt động nào.
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
