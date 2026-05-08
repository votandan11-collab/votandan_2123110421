import { ShoppingCart, Search, Filter, Eye, Calendar, User, DollarSign, Clock, Printer } from 'lucide-react';
import { orderApi } from '../api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderApi.getAll();
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePrintInvoice = (order) => {
        const printWindow = window.open('', '_blank');
        const invoiceHTML = `
            <html>
                <head>
                    <title>Hóa Đơn #${order.id}</title>
                    <style>
                        body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; }
                        .header { text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
                        .logo { font-size: 24px; font-weight: bold; color: #6366f1; }
                        .info { display: flex; justify-content: space-between; margin-bottom: 40px; }
                        .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
                        .table th, .table td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; }
                        .total { text-align: right; font-size: 20px; font-weight: bold; color: #6366f1; }
                        .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #999; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">CARD STORE</div>
                        <p>HÓA ĐƠN THANH TOÁN</p>
                    </div>
                    <div class="info">
                        <div>
                            <p><strong>Khách hàng:</strong> ${order.customer?.name || 'Khách vãng lai'}</p>
                            <p><strong>Email:</strong> ${order.customer?.email || 'N/A'}</p>
                        </div>
                        <div style="text-align: right;">
                            <p><strong>Mã đơn hàng:</strong> #${order.id}</p>
                            <p><strong>Ngày:</strong> ${formatDate(order.createdAt)}</p>
                        </div>
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Mô tả</th>
                                <th>Số lượng</th>
                                <th style="text-align: right;">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Giao dịch nạp thẻ / Mua thẻ</td>
                                <td>1</td>
                                <td style="text-align: right;">${order.totalAmount.toLocaleString()} VNĐ</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="total">TỔNG CỘNG: ${order.totalAmount.toLocaleString()} VNĐ</div>
                    <div class="footer">Cảm ơn quý khách đã tin dùng dịch vụ của Card Store!</div>
                    <script>window.print();</script>
                </body>
            </html>
        `;
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
    };

    const filteredOrders = orders.filter(o => 
        o.id.toString().includes(searchTerm) || 
        (o.customer?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in">
            <div className="top-bar">
                <div className="page-title">
                    <h1>Orders</h1>
                    <p>Manage sales transactions and point accumulation</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="search-box">
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Order ID or Customer..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary">
                        <ShoppingCart size={18} /> Create Order
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
                            <ShoppingCart size={20} />
                        </div>
                    </div>
                    <div className="stat-value">{orders.length}</div>
                    <div className="stat-label">Total Giao dịch</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div className="stat-value">
                        {orders.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()} <span style={{fontSize: '0.8rem'}}>VNĐ</span>
                    </div>
                    <div className="stat-label">Revenue</div>
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading orders...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>#{order.id}</span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 500 }}>{order.customer?.name || 'Guest'}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.customer?.email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>
                                            {order.totalAmount.toLocaleString()} VNĐ
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            <Calendar size={14} />
                                            {formatDate(order.createdAt)}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn" style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}>
                                                <Eye size={16} />
                                            </button>
                                            <button 
                                                className="btn" 
                                                style={{ padding: '6px', background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}
                                                onClick={() => handlePrintInvoice(order)}
                                            >
                                                <Printer size={16} />
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

export default Orders;
