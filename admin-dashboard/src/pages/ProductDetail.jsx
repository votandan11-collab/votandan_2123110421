import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi, categoryApi, orderApi } from '../api';
import CustomerHeader from '../components/CustomerHeader';
import CustomerFooter from '../components/CustomerFooter';
import { ShoppingCart, Trash2, Mail, Zap, ChevronLeft, CreditCard, X } from 'lucide-react';

const ProductDetail = () => {
    const { categoryId } = useParams();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Cart State
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [email, setEmail] = useState('');
    const [showQR, setShowQR] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem('userData');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setEmail(parsedUser.email || '');
        }

        const loadData = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    categoryApi.getAll(),
                    productApi.getAll()
                ]);
                
                const currentCat = catRes.data.find(c => c.id === parseInt(categoryId));
                setCategory(currentCat);

                const filtered = prodRes.data.filter(p => p.categoryId === parseInt(categoryId));
                setProducts(filtered);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [categoryId]);

    const handleCheckout = () => {
        if (!selectedProduct) return alert('Vui lòng chọn mệnh giá!');
        if (!email) return alert('Vui lòng nhập Email!');
        setShowQR(true);
    };

    const confirmOrder = async () => {
        try {
            const discount = selectedProduct.discountRate || 4;
            const totalAmount = selectedProduct.price * quantity * (1 - discount/100);
            
            // Chỉ dùng các trường chắc chắn đã có trong DB của bạn để tránh lỗi 500
            const orderData = { 
                CustomerId: user?.Id || user?.id || 0,
                TotalAmount: totalAmount,
                UpdatedBy: `Mua: ${selectedProduct.Name || selectedProduct.name} (SL: ${quantity}) - Email: ${email}`
            };
            
            await orderApi.create(orderData);
            alert(`Mua thẻ thành công! Hệ thống đang kiểm duyệt thanh toán cho ${email}.`);
            setSelectedProduct(null);
            setShowQR(false);
        } catch (error) {
            console.error('Order error:', error.response?.data || error.message);
            alert('Lỗi đặt hàng: ' + (error.response?.data || 'Vui lòng thử lại sau.'));
        }
    }

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <CustomerHeader user={user} handleLogout={() => setUser(null)} />

            <main style={{ maxWidth: '1400px', margin: '100px auto 100px', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
                {/* LEFT: DENOMINATIONS */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                        <Link to="/" style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}><ChevronLeft size={24} /></Link>
                        {category?.description?.startsWith('http') && <img src={category.description} style={{ height: '30px' }} alt="" />}
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Thẻ {category?.name}</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                        {loading ? <p>Đang tải mệnh giá...</p> : products.map(p => (
                            <div 
                                key={p.Id || p.id} 
                                onClick={() => setSelectedProduct(p)}
                                style={{ 
                                    background: (selectedProduct?.Id || selectedProduct?.id) === (p.Id || p.id) ? '#000080' : '#e5e7eb',
                                    color: (selectedProduct?.Id || selectedProduct?.id) === (p.Id || p.id) ? 'white' : '#1e293b',
                                    padding: '25px 15px', borderRadius: '8px', textAlign: 'center',
                                    cursor: 'pointer', transition: '0.2s', position: 'relative'
                                }}
                            >
                                {(selectedProduct?.Id || selectedProduct?.id) === (p.Id || p.id) && (
                                    <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'white', color: '#000080', borderRadius: '50%', padding: '2px' }}>
                                        <Zap size={14} fill="currentColor" />
                                    </div>
                                )}
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: (selectedProduct?.Id || selectedProduct?.id) === (p.Id || p.id) ? '#4ade80' : '#16a34a', marginBottom: '5px' }}>
                                    {p.Stock || p.stock} {category?.Name || category?.name}
                                </div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{(p.Price || p.price || 0).toLocaleString()}đ</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* RIGHT: CART PANEL */}
                <aside>
                    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', position: 'sticky', top: '100px' }}>
                        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#000080', borderBottom: '1px solid #f1f5f9' }}>
                            <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Giỏ hàng</h3>
                            <ShoppingCart size={20} />
                        </div>

                        <div style={{ padding: '20px' }}>
                            {selectedProduct ? (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, color: '#1e293b' }}>{selectedProduct.Name || selectedProduct.name} {(selectedProduct.Price || selectedProduct.price || 0).toLocaleString()}đ</div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Chiết khấu: {selectedProduct.DiscountRate || selectedProduct.discountRate || 4}%</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <input 
                                                type="number" min="1" value={quantity} 
                                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                style={{ width: '60px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', textAlign: 'center', fontSize: '1rem' }}
                                            />
                                            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                                                {((selectedProduct.Price || selectedProduct.price || 0) * quantity * (1 - (selectedProduct.DiscountRate || selectedProduct.discountRate || 4)/100)).toLocaleString()}đ
                                            </span>
                                            <button onClick={() => setSelectedProduct(null)} style={{ border: 'none', background: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer' }}><X size={16} /></button>
                                        </div>
                                    </div>

                                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                            <span style={{ fontWeight: 800 }}>Tổng:</span>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ef4444' }}>
                                                {((selectedProduct.Price || selectedProduct.price || 0) * quantity * (1 - (selectedProduct.DiscountRate || selectedProduct.discountRate || 4)/100)).toLocaleString()} đ
                                            </span>
                                        </div>

                                        <div style={{ marginBottom: '20px' }}>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '5px' }}>Email</label>
                                            <input 
                                                type="email" placeholder="Email nhận mã..." 
                                                value={email} onChange={e => setEmail(e.target.value)}
                                                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '25px' }}>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '5px' }}>Phương thức thanh toán:</label>
                                            <select style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                                                <option>Chuyển khoản MoMo / Ngân hàng</option>
                                            </select>
                                        </div>

                                        <button 
                                            onClick={handleCheckout}
                                            style={{ width: '100%', padding: '15px', borderRadius: '8px', background: '#000080', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                                            THANH TOÁN
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8' }}>Chưa chọn mã thẻ</div>
                            )}
                        </div>
                    </div>
                </aside>
            </main>

            {/* QR PAYMENT MODAL */}
            {showQR && selectedProduct && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: 'white', width: '100%', maxWidth: '450px', borderRadius: '20px', overflow: 'hidden', textAlign: 'center', animation: 'scaleIn 0.3s ease' }}>
                        <div style={{ padding: '20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Thanh toán qua QR</h3>
                            <button onClick={() => setShowQR(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <div style={{ padding: '30px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>Tổng thanh toán:</div>
                                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ef4444' }}>
                                    {((selectedProduct.Price || selectedProduct.price || 0) * quantity * (1 - (selectedProduct.DiscountRate || selectedProduct.discountRate || 4)/100)).toLocaleString()} đ
                                </div>
                            </div>

                            <div style={{ background: '#fff', padding: '15px', borderRadius: '15px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                                <img 
                                    src={`https://img.vietqr.io/image/970422-0379518671-compact.jpg?amount=${(selectedProduct.Price || selectedProduct.price || 0) * quantity * (1 - (selectedProduct.DiscountRate || selectedProduct.discountRate || 4)/100)}&addInfo=Thanh toan the ${category?.Name || category?.name} ${(selectedProduct.Price || selectedProduct.price || 0)}`} 
                                    style={{ width: '100%', height: 'auto', borderRadius: '10px' }} 
                                    alt="QR Thanh Toán" 
                                />
                                <div style={{ marginTop: '15px', textAlign: 'left', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <span style={{ color: '#64748b' }}>Chủ tài khoản:</span>
                                        <span style={{ fontWeight: 700 }}>VÕ TẤN DÂN</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#64748b' }}>Số điện thoại (MoMo):</span>
                                        <span style={{ fontWeight: 700 }}>0379518671</span>
                                    </div>
                                </div>
                            </div>

                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '25px', lineHeight: '1.5' }}>
                                Vui lòng quét mã QR trên và thực hiện chuyển khoản. Sau khi chuyển khoản thành công, nhấn "Xác nhận" để hoàn tất đơn hàng.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <button 
                                    onClick={() => setShowQR(false)}
                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', fontWeight: 700, cursor: 'pointer' }}>
                                    HỦY
                                </button>
                                <button 
                                    onClick={confirmOrder}
                                    style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#16a34a', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
                                    XÁC NHẬN
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <CustomerFooter />
        </div>
    );
};

export default ProductDetail;
