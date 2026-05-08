import React, { useState, useEffect } from 'react';
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
                        body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                        .header { text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
                        .logo { font-size: 28px; font-weight: bold; color: #6366f1; margin-bottom: 5px; }
                        .info { display: flex; justify-content: space-between; margin-bottom: 40px; }
                        .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
                        .table th { padding: 12px; border-bottom: 2px solid #eee; text-align: left; background: #f8fafc; }
                        .table td { padding: 12px; border-bottom: 1px solid #eee; }
                        .total-row { text-align: right; margin-top: 30px; }
                        .total-label { font-size: 18px; color: #64748b; }
                        .total-value { font-size: 24px; font-weight: bold; color: #6366f1; }
                        .footer { text-align: center; margin-top: 60px; font-size: 13px; color: #94a3b8; border-top: 1px dashed #eee; padding-top: 20px; }
                        @media print { .no-print { display: none; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">CARD STORE</div>
                        <div style="font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 2px;">Hóa Đơn Thanh Toán</div>
                    </div>
                    <div class="info">
                        <div>
                            <p style="margin: 0; color: #64748b;">Khách hàng:</p>
                            <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold;">${order.customer?.name || 'Khách vãng lai'}</p>
                            <p style="margin: 5px 0 0; color: #64748b;">${order.customer?.email || 'N/A'}</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="margin: 0; color: #64748b;">Mã đơn hàng:</p>
                            <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #6366f1;">#${order.id}</p>
                            <p style="margin: 5px 0 0; color: #64748b;">Ngày: ${formatDate(order.createdAt)}</p>
                        </div>
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Mô tả sản phẩm/dịch vụ</th>
                                <th style="text-align: center; width: 100px;">SL</th>
                                <th style="text-align: right; width: 150px;">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Giao dịch nạp thẻ / Mua thẻ cào điện thoại</td>
                                <td style="text-align: center;">1</td>
                                <td style="text-align: right; font-weight: 600;">${order.totalAmount.toLocaleString()} VNĐ</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="total-row">
                        <span class="total-label">TỔNG CỘNG:</span>
                        <div class="total-value">${order.totalAmount.toLocaleString()} VNĐ</div>
                    </div>
                    <div class="footer">
                        <p>Cảm ơn quý khách đã tin dùng dịch vụ của Card Store!</p>
                        <p style="font-style: italic;">Hệ thống nạp thẻ tự động 24/7</p>
                    </div>
                    <script>
                        window.onload = () => {
                            window.print();
                            setTimeout(() => window.close(), 500);
                        };
                    </script>
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
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Orders</h1>
                    <p style={{ opacity: 0.7 }}>Quản lý đơn hàng và tích điểm thành viên</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="search-box">
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Mã đơn hoặc Tên khách..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#6366f1' }}>
                            <ShoppingCart size={20} />
                        </div>
                    </div>
                    <div className="stat-value">{orders.length}</div>
                    <div className="stat-label">Tổng Giao dịch</div>
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
                    <div className="stat-label">Doanh thu tổng</div>
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải dữ liệu...</div>
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
                            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        <span style={{ fontWeight: 800, color: '#6366f1' }}>#{order.id}</span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 600 }}>{order.customer?.name || 'Khách vãng lai'}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{order.customer?.email || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 700, color: '#f8fafc' }}>
                                            {order.totalAmount.toLocaleString()} VNĐ
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>
                                            <Calendar size={14} />
                                            {formatDate(order.createdAt)}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button className="btn-premium" style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                                                <Eye size={18} />
                                            </button>
                                            <button 
                                                className="btn-premium" 
                                                title="In Hóa Đơn"
                                                style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}
                                                onClick={() => handlePrintInvoice(order)}
                                            >
                                                <Printer size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Không tìm thấy đơn hàng nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Orders;
