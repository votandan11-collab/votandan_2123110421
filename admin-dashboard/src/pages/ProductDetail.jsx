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

    // Cart State: Array of { product, quantity }
    const [cart, setCart] = useState([]);
    const [email, setEmail] = useState('');
    const [showQR, setShowQR] = useState(false);
    
    // Coupon State
    const [couponInput, setCouponInput] = useState('');
    const [activeCoupon, setActiveCoupon] = useState(null);

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

    const handleApplyCoupon = () => {
        const redeemedCoupons = JSON.parse(localStorage.getItem('redeemedCoupons') || '[]');
        const found = redeemedCoupons.find(c => c.code === couponInput.trim() && !c.used);
        
        if (found) {
            setActiveCoupon(found);
            alert(`Đã áp dụng mã giảm giá ${found.discount}% thành công!`);
        } else {
            alert('Mã giảm giá không hợp lệ hoặc đã được sử dụng.');
        }
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => (item.product.Id || item.product.id) === (product.Id || product.id));
            if (existing) {
                return prev.map(item => 
                    (item.product.Id || item.product.id) === (product.Id || product.id) 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId, delta) => {
        setCart(prev => prev.map(item => {
            if ((item.product.Id || item.product.id) === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => (item.product.Id || item.product.id) !== productId));
    };

    const calculateTotal = () => {
        const subtotal = cart.reduce((sum, item) => {
            const price = item.product.Price || item.product.price || 0;
            const discount = item.product.DiscountRate || item.product.discountRate || 4;
            return sum + (price * item.quantity * (1 - discount/100));
        }, 0);

        if (activeCoupon) {
            return subtotal * (1 - activeCoupon.discount / 100);
        }
        return subtotal;
    };

    const handleCheckout = () => {
        if (cart.length === 0) return alert('Vui lòng chọn ít nhất một mệnh giá!');
        if (!email) return alert('Vui lòng nhập Email!');
        setShowQR(true);
    };

    const confirmOrder = async () => {
        try {
            const totalAmount = calculateTotal();
            const itemsDescription = cart.map(item => 
                `${item.product.Name || item.product.name} x${item.quantity}`
            ).join(', ');
            
            const orderData = { 
                CustomerId: user?.Id || user?.id || 0,
                TotalAmount: totalAmount,
                UpdatedBy: `Mua: [${itemsDescription}] ${activeCoupon ? ` - Coupon: ${activeCoupon.code}` : ''} - Email: ${email}`
            };
            
            await orderApi.create(orderData);
            
            // Mark coupon as used
            if (activeCoupon) {
                const redeemedCoupons = JSON.parse(localStorage.getItem('redeemedCoupons') || '[]');
                const updated = redeemedCoupons.map(c => c.code === activeCoupon.code ? { ...c, used: true } : c);
                localStorage.setItem('redeemedCoupons', JSON.stringify(updated));
            }

            alert(`Mua thẻ thành công! Hệ thống đang kiểm duyệt thanh toán cho các thẻ: ${itemsDescription}.`);
            setCart([]);
            setActiveCoupon(null);
            setCouponInput('');
            setShowQR(false);
        } catch (error) {
            console.error('Order error:', error.response?.data || error.message);
            alert('Lỗi đặt hàng: ' + (error.response?.data || 'Vui lòng thử lại sau.'));
        }
    }

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
                    <Zap size={16} fill="#fbbf24" color="#fbbf24" /> Dùng điểm đổi Coupon để nhận thêm ưu đãi
                </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {loading ? <div style={{ color: '#64748b' }}>Đang tải mệnh giá...</div> : products.map(p => {
                const isInCart = cart.some(item => (item.product.Id || item.product.id) === (p.Id || p.id));
                return (
                    <div 
                        key={p.Id || p.id} 
                        onClick={() => addToCart(p)}
                        style={{ 
                            background: isInCart ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                            borderRadius: '24px', padding: '30px', textAlign: 'center',
                            cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                            border: '1px solid',
                            borderColor: isInCart ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            position: 'relative', overflow: 'hidden'
                        }}
                        onMouseOver={e => !isInCart && (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
                        onMouseOut={e => !isInCart && (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)')}
                    >
                        {isInCart && (
                            <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', background: 'var(--primary)', clipPath: 'polygon(100% 0, 0 0, 100% 100%)', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '6px' }}>
                                 <ShoppingCart size={12} fill="white" color="white" />
                            </div>
                        )}
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            KHO: {p.Stock || p.stock} THẺ
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '4px' }}>{(p.Price || p.price || 0).toLocaleString()}đ</div>
                        <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>-{p.DiscountRate || p.discountRate || 4}% Chiết khấu</div>
                    </div>
                );
            })}
          </div>
        </section>

        {/* RIGHT: CHECKOUT PANEL */}
        <aside>
          <div style={{ 
            background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(20px)', 
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', 
            padding: '32px', position: 'sticky', top: '120px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)', minHeight: '400px', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingCart size={20} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Giỏ Hàng ({cart.length})</h3>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '24px', maxHeight: '400px' }}>
                {cart.length > 0 ? cart.map(item => (
                    <div key={item.product.Id || item.product.id} style={{ 
                        padding: '16px', borderRadius: '20px', background: 'rgba(2, 6, 23, 0.2)',
                        border: '1px solid rgba(255,255,255,0.05)', marginBottom: '12px',
                        animation: 'slideIn 0.3s ease-out'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Thẻ {(item.product.Price || item.product.price || 0).toLocaleString()}đ</div>
                            <button onClick={() => removeFromCart(item.product.Id || item.product.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '4px 8px' }}>
                                <button onClick={() => updateQuantity(item.product.Id || item.product.id, -1)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0 8px' }}>-</button>
                                <span style={{ width: '30px', textAlign: 'center', fontWeight: 800 }}>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.product.Id || item.product.id, 1)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0 8px' }}>+</button>
                            </div>
                            <div style={{ fontWeight: 800, color: '#10b981' }}>
                                {((item.product.Price || item.product.price || 0) * item.quantity * (1 - (item.product.DiscountRate || item.product.discountRate || 4)/100)).toLocaleString()}đ
                            </div>
                        </div>
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.5 }}>
                        <ShoppingCart size={48} style={{ marginBottom: '16px' }} />
                        <p>Chưa có sản phẩm nào</p>
                    </div>
                )}
            </div>

            {cart.length > 0 && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <input 
                            type="email" placeholder="Email nhận mã thẻ..." 
                            value={email} onChange={e => setEmail(e.target.value)}
                            style={{ width: '100%', height: '52px', padding: '0 16px', borderRadius: '14px', background: 'rgba(2, 6, 23, 0.4)', border: '1px solid rgba(255,255,255,0.05)', color: 'white', outline: 'none', marginBottom: '12px' }}
                        />
                        
                        {/* COUPON INPUT */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                            <input 
                                type="text" placeholder="Nhập mã Coupon..." 
                                value={couponInput} onChange={e => setCouponInput(e.target.value)}
                                style={{ flex: 1, height: '48px', padding: '0 16px', borderRadius: '12px', background: 'rgba(2, 6, 23, 0.4)', border: '1px solid rgba(255,255,255,0.05)', color: 'white', outline: 'none', fontSize: '0.85rem' }}
                            />
                            <button 
                                onClick={handleApplyCoupon}
                                style={{ padding: '0 16px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', color: '#6366f1', border: '1px solid rgba(99, 102, 241, 0.4)', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
                            >
                                Áp dụng
                            </button>
                        </div>

                        {activeCoupon && (
                            <div style={{ padding: '10px 16px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', fontSize: '0.8rem', fontWeight: 700, marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Giảm giá Coupon:</span>
                                <span>-{activeCoupon.discount}%</span>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <span style={{ color: '#94a3b8', fontWeight: 600 }}>Tổng thanh toán:</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fbbf24' }}>{calculateTotal().toLocaleString()}đ</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleCheckout}
                        style={{ 
                            width: '100%', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', 
                            color: 'white', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', 
                            boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)', transition: '0.3s' 
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        THANH TOÁN NGAY
                    </button>
                </div>
            )}
          </div>
        </aside>
      </main>

      {/* QR PAYMENT MODAL */}
      {showQR && cart.length > 0 && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: '#0f172a', width: '100%', maxWidth: '500px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', textAlign: 'center', animation: 'slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 40px 80px rgba(0,0,0,0.8)' }}>
                <div style={{ padding: '24px 32px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontWeight: 800, fontSize: '1.2rem' }}>Thanh toán gỏ hàng</h3>
                    <button onClick={() => setShowQR(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
                </div>
                <div style={{ padding: '40px' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '8px' }}>Tổng tiền ({cart.length} loại thẻ):</div>
                        <div style={{ fontSize: '3rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>
                            {calculateTotal().toLocaleString()}đ
                        </div>
                    </div>

                    <div style={{ background: 'white', padding: '15px', borderRadius: '24px', marginBottom: '32px', display: 'inline-block' }}>
                        <img 
                            src={`https://img.vietqr.io/image/970422-0379518671-compact.jpg?amount=${calculateTotal()}&addInfo=Thanh toan don hang ${category?.name} - ${email}`} 
                            style={{ width: '260px', height: 'auto', borderRadius: '12px' }} 
                            alt="QR Thanh Toán" 
                        />
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', textAlign: 'left', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: '#64748b' }}>Sản phẩm:</span>
                            <span style={{ fontWeight: 700 }}>{cart.length} mệnh giá thẻ</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: '#64748b' }}>Nội dung:</span>
                            <span style={{ fontWeight: 800, color: '#fbbf24' }}>MUA {category?.name.toUpperCase()} {email.split('@')[0].toUpperCase()}</span>
                        </div>
                    </div>

                    <button 
                        onClick={confirmOrder}
                        style={{ width: '100%', height: '60px', borderRadius: '18px', background: '#10b981', color: 'white', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)', transition: '0.3s' }}
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
