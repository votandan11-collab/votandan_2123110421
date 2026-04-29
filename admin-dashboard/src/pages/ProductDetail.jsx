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
                UpdatedBy: `Mua: ${selectedProduct.Name || selectedProduct.name} - ${email}`
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
  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh', color: 'white' }}>
      <CustomerHeader user={user} handleLogout={() => setUser(null)} />

      <main style={{ maxWidth: '1400px', margin: '120px auto 100px', padding: '0 5%', display: 'grid', gridTemplateColumns: '1fr 450px', gap: '40px' }}>
        {/* LEFT: DENOMINATIONS */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
            <Link to="/" style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                <ChevronLeft size={24} />
            </Link>
            <div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Thẻ {category?.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '1rem', fontWeight: 600 }}>
                    <Zap size={16} fill="#fbbf24" color="#fbbf24" /> Tự động & Chiết khấu cao
                </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {loading ? <div style={{ color: '#64748b' }}>Đang tải mệnh giá...</div> : products.map(p => (
                <div 
                    key={p.Id || p.id} 
                    onClick={() => setSelectedProduct(p)}
                    style={{ 
                        background: (selectedProduct?.Id || selectedProduct?.id) === (p.Id || p.id) ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                        borderRadius: '24px', padding: '30px', textAlign: 'center',
                        cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                        border: '1px solid',
                        borderColor: (selectedProduct?.Id || selectedProduct?.id) === (p.Id || p.id) ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        position: 'relative', overflow: 'hidden'
                    }}
                >
                    {(selectedProduct?.Id || selectedProduct?.id) === (p.Id || p.id) && (
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', background: 'var(--primary)', clipPath: 'polygon(100% 0, 0 0, 100% 100%)', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '6px' }}>
                             <Zap size={12} fill="white" color="white" />
                        </div>
                    )}
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        CÒN {p.Stock || p.stock} THẺ
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '4px' }}>{(p.Price || p.price || 0).toLocaleString()}đ</div>
                    <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Tặng {Math.round((p.Price || p.price) / 1000)} Points</div>
                </div>
            ))}
          </div>
        </section>

        {/* RIGHT: CHECKOUT PANEL */}
        <aside>
          <div style={{ 
            background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(20px)', 
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', 
            padding: '32px', position: 'sticky', top: '120px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingCart size={20} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Xác Nhận Đơn Hàng</h3>
            </div>

            {selectedProduct ? (
                <div style={{ animation: 'slideIn 0.3s ease-out' }}>
                    <div style={{ paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Thẻ {category?.name} {(selectedProduct.Price || selectedProduct.price || 0).toLocaleString()}đ</div>
                                <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 700, marginTop: '4px' }}>Chiết khấu {selectedProduct.DiscountRate || selectedProduct.discountRate || 4}%</div>
                            </div>
                            <button onClick={() => setSelectedProduct(null)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', width: '32px', height: '32px', borderRadius: '10px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ flex: 1, height: '48px', display: 'flex', alignItems: 'center', background: 'rgba(2, 6, 23, 0.4)', borderRadius: '14px', padding: '0 12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>-</button>
                                <input type="number" value={quantity} readOnly style={{ flex: 1, background: 'none', border: 'none', color: 'white', textAlign: 'center', fontWeight: 700, fontSize: '1rem' }} />
                                <button onClick={() => setQuantity(quantity + 1)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>+</button>
                            </div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>
                                {((selectedProduct.Price || selectedProduct.price || 0) * quantity * (1 - (selectedProduct.DiscountRate || selectedProduct.discountRate || 4)/100)).toLocaleString()}đ
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ position: 'relative', marginBottom: '16px' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                            <input 
                                type="email" placeholder="Email nhận mã thẻ..." 
                                value={email} onChange={e => setEmail(e.target.value)}
                                style={{ width: '100%', height: '56px', padding: '0 16px 0 48px', borderRadius: '16px', background: 'rgba(2, 6, 23, 0.4)', border: '1px solid rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem', outline: 'none' }}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <CreditCard size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                            <select style={{ width: '100%', height: '56px', padding: '0 16px 0 48px', borderRadius: '16px', background: 'rgba(2, 6, 23, 0.4)', border: '1px solid rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem', outline: 'none', appearance: 'none' }}>
                                <option>QR Thanh toán / Chuyển khoản</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        onClick={handleCheckout}
                        style={{ 
                            width: '100%', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', 
                            color: 'white', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', 
                            boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)', transition: '0.3s' 
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        THANH TOÁN NGAY
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '20px' }}>* Mã thẻ sẽ được gửi tự động sau khi thanh toán.</p>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <ShoppingCart size={48} style={{ color: 'rgba(255,255,255,0.05)', marginBottom: '16px' }} />
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Vui lòng chọn mệnh giá thẻ để tiếp tục thanh toán.</p>
                </div>
            )}
          </div>
        </aside>
      </main>

      {/* QR PAYMENT MODAL */}
      {showQR && selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: '#0f172a', width: '100%', maxWidth: '500px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', textAlign: 'center', animation: 'slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 40px 80px rgba(0,0,0,0.8)' }}>
                <div style={{ padding: '24px 32px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontWeight: 800, fontSize: '1.2rem' }}>Thanh toán đơn hàng</h3>
                    <button onClick={() => setShowQR(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
                </div>
                <div style={{ padding: '40px' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '8px' }}>Số tiền cần thanh toán:</div>
                        <div style={{ fontSize: '3rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>
                            {((selectedProduct.Price || selectedProduct.price || 0) * quantity * (1 - (selectedProduct.DiscountRate || selectedProduct.discountRate || 4)/100)).toLocaleString()}đ
                        </div>
                    </div>

                    <div style={{ background: 'white', padding: '20px', borderRadius: '24px', marginBottom: '32px', display: 'inline-block', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                        <img 
                            src={`https://img.vietqr.io/image/970422-0379518671-compact.jpg?amount=${(selectedProduct.Price || selectedProduct.price || 0) * quantity * (1 - (selectedProduct.DiscountRate || selectedProduct.discountRate || 4)/100)}&addInfo=Thanh toan the ${category?.name} ${(selectedProduct.Price || selectedProduct.price || 0)}`} 
                            style={{ width: '280px', height: 'auto', borderRadius: '12px' }} 
                            alt="QR Thanh Toán" 
                        />
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '20px', textAlign: 'left', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Chủ tài khoản:</span>
                            <span style={{ fontWeight: 800 }}>VÕ TẤN DÂN</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Nội dung:</span>
                            <span style={{ fontWeight: 800, color: '#fbbf24' }}>MUA {category?.name.toUpperCase()} {email.toUpperCase()}</span>
                        </div>
                    </div>

                    <button 
                        onClick={confirmOrder}
                        style={{ width: '100%', height: '60px', borderRadius: '18px', background: '#10b981', color: 'white', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)', transition: '0.3s' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        TÔI ĐÃ THANH TOÁN
                    </button>
                </div>
            </div>
        </div>
      )}

      <CustomerFooter />
    </div>
  );
};

export default ProductDetail;
