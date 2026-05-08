import { Package, ShoppingCart, DollarSign, Users, RefreshCw, ArrowUpRight, ArrowDownRight, TrendingUp, Download } from 'lucide-react';
import { statsApi, orderApi, API_BASE_URL } from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, ordersRes] = await Promise.all([
                statsApi.get(),
                orderApi.getAll()
            ]);
            setStats(statsRes.data);
            setRecentOrders(ordersRes.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = () => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        // Mở URL export trong tab mới để trình duyệt tự tải về
        window.open(`${API_BASE_URL}/Stats/export-revenue?month=${month}&year=${year}`, '_blank');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <div className="animate-spin" style={{ color: 'var(--primary)' }}>
                    <RefreshCw size={48} />
                </div>
            </div>
        );
    }

    // Format data cho biểu đồ đường (Arrow graph style)
    const chartData = stats?.monthlyRevenue.map(item => ({
        name: new Date(item.month).toLocaleDateString('vi-VN', { month: 'short' }),
        revenue: item.revenue
    })) || [];

    const kpis = [
        { label: 'Sản phẩm', value: stats?.totalProducts, icon: <Package />, color: '#6366f1', trend: '+12%' },
        { label: 'Đơn hàng', value: stats?.totalOrders, icon: <ShoppingCart />, color: '#10b981', trend: '+5%' },
        { label: 'Doanh thu', value: stats?.totalRevenue.toLocaleString() + 'đ', icon: <DollarSign />, color: '#f59e0b', trend: '+18%' },
        { label: 'Đơn hôm nay', value: stats?.todayOrders, icon: <TrendingUp />, color: '#ec4899', trend: 'Live' },
    ];

    return (
        <div className="animate-in">
            <div className="top-bar">
                <div className="page-title">
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Dashboard</h1>
                    <p style={{ opacity: 0.7 }}>Thống kê dữ liệu thực thời gian thực</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-premium" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }} onClick={handleExportExcel}>
                        <Download size={18} style={{ marginRight: '8px' }} /> Xuất Excel
                    </button>
                    <button className="btn-premium btn-primary-premium" onClick={fetchDashboardData}>
                        <RefreshCw size={18} style={{ marginRight: '8px' }} /> Làm mới
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                {kpis.map((kpi, i) => (
                    <div key={i} className="stat-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ 
                                padding: '12px', 
                                background: `${kpi.color}15`, 
                                color: kpi.color, 
                                borderRadius: '12px' 
                            }}>
                                {kpi.icon}
                            </div>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '4px', 
                                color: kpi.trend.includes('+') ? '#10b981' : '#6366f1',
                                fontSize: '0.8rem',
                                fontWeight: 700
                            }}>
                                {kpi.trend.includes('+') ? <ArrowUpRight size={14} /> : null}
                                {kpi.trend}
                            </div>
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '4px' }}>{kpi.value}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{kpi.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Biểu đồ xu hướng (Arrow Graph / Line Chart) */}
                <div className="table-container" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Xu hướng doanh thu</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} tickFormatter={(v) => `${v/1000000}M`} />
                                <Tooltip 
                                    contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}
                                    itemStyle={{ color: 'var(--primary)' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="var(--primary)" 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill="url(#colorRev)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="table-container" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Đơn hàng mới nhất</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentOrders.map((order) => (
                            <div key={order.id} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '12px',
                                border: '1px solid var(--glass-border)'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>#{order.id}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div style={{ fontWeight: 800, color: 'var(--primary)' }}>
                                    {order.totalAmount.toLocaleString()}đ
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
