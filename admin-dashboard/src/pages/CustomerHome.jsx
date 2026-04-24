import React, { useState, useEffect } from 'react';
import CustomerHeader from '../components/CustomerHeader';
import CustomerFooter from '../components/CustomerFooter';
import { Zap, Ticket, ShoppingCart, Trash2, Mail, Info } from 'lucide-react';

// DỮ LIỆU TĨNH (STATIC DATA) THEO ẢNH MẪU
const STATIC_PRODUCTS = [
    { id: 1, name: 'Garena', price: 5000, stock: 659, discount: 4, logo: 'https://cdn.divineshop.vn/image/catalog/Logo/Logo-Garena.png' },
    { id: 2, name: 'Garena', price: 10000, stock: 354, discount: 4, logo: 'https://cdn.divineshop.vn/image/catalog/Logo/Logo-Garena.png' },
    { id: 3, name: 'Garena', price: 20000, stock: 432, discount: 4, logo: 'https://cdn.divineshop.vn/image/catalog/Logo/Logo-Garena.png' },
    { id: 4, name: 'Garena', price: 50000, stock: 374, discount: 4, logo: 'https://cdn.divineshop.vn/image/catalog/Logo/Logo-Garena.png' },
    { id: 5, name: 'Garena', price: 100000, stock: 406, discount: 4, logo: 'https://cdn.divineshop.vn/image/catalog/Logo/Logo-Garena.png' },
    { id: 6, name: 'Garena', price: 200000, stock: 260, discount: 4, logo: 'https://cdn.divineshop.vn/image/catalog/Logo/Logo-Garena.png' },
    { id: 7, name: 'Garena', price: 500000, stock: 394, discount: 4, logo: 'https://cdn.divineshop.vn/image/catalog/Logo/Logo-Garena.png' },
];

const STATIC_BANNERS = [
    { id: 1, title: 'Nạp Thẻ Garena Giá Rẻ', description: 'Chiết khấu cực cao lên đến 4% cho mọi mệnh giá', imageUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1400' }
];

const CustomerHome = () => {
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setEmail(parsedUser.email || '');
    }
  }, []);

  const handleCheckout = () => {
    if (!selectedProduct) return alert('Vui lòng chọn mệnh giá!');
    if (!email) return alert('Vui lòng nhập Email!');
    alert(`Thanh toán thành công cho ${quantity} thẻ ${selectedProduct.name} mệnh giá ${selectedProduct.price.toLocaleString()}đ!`);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
      <CustomerHeader user={user} handleLogout={() => setUser(null)} />

      {/* Hero Mini Banner */}
      <div style={{ marginTop: '80px', padding: '0 5%' }}>
        <div style={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: '24px', padding: '50px', color: 'white',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
            <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '10px' }}>{STATIC_BANNERS[0].title}</h1>
                <p style={{ fontSize: '1.1rem', opacity: 0.7 }}>{STATIC_BANNERS[0].description}</p>
            </div>
            <img src="https://cdn.divineshop.vn/image/catalog/Logo/Logo-Garena.png" style={{ height: '120px', filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.4))' }} alt="Garena" />
        </div>
      </div>

      <main style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 5%', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
        
        {/* LEFT: STATIC PRODUCTS GRID */}
        <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <img src="https://cdn.divineshop.vn/image/catalog/Logo/Logo-Garena.png" style={{ height: '35px' }} alt="" />
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Thẻ Garena</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {STATIC_PRODUCTS.map(p => (
                    <div 
                        key={p.id} 
                        onClick={() => setSelectedProduct(p)}
                        style={{ 
                            background: selectedProduct?.id === p.id ? '#000080' : '#e5e7eb',
                            color: selectedProduct?.id === p.id ? 'white' : '#1e293b',
                            padding: '25px 15px', borderRadius: '12px', textAlign: 'center',
                            cursor: 'pointer', transition: '0.2s', position: 'relative',
                            boxShadow: selectedProduct?.id === p.id ? '0 10px 20px rgba(0,0,128,0.2)' : 'none'
                        }}
                    >
                        {selectedProduct?.id === p.id && (
                            <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'white', color: '#000080', borderRadius: '50%', padding: '2px' }}>
                                <Zap size={14} fill="currentColor" />
                            </div>
                        )}
                        <p style={{ fontSize: '1rem', fontWeight: 700, color: selectedProduct?.id === p.id ? '#4ade80' : '#16a34a', marginBottom: '5px' }}>
                            {p.stock} {p.name}
                        </p>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{p.price.toLocaleString()}đ</h3>
                    </div>
                ))}
            </div>
        </section>

        {/* RIGHT: CHECKOUT PANEL */}
        <aside>
            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', position: 'sticky', top: '100px' }}>
                <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#000080', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontWeight: 800, fontSize: '1.2rem' }}>Giỏ hàng</h3>
                    <ShoppingCart size={20} />
                </div>

                <div style={{ padding: '25px' }}>
                    {selectedProduct ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{selectedProduct.name} {selectedProduct.price.toLocaleString()}đ</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Chiết khấu: {selectedProduct.discount}%</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <input 
                                            type="number" min="1" value={quantity} 
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            style={{ width: '55px', height: '35px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                        />
                                    </div>
                                    <button onClick={() => setSelectedProduct(null)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Tổng:</span>
                                    <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ef4444' }}>
                                        {(selectedProduct.price * quantity * (1 - selectedProduct.discount/100)).toLocaleString()} đ
                                    </span>
                                </div>

                                <div style={{ marginBottom: '25px' }}>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>Email</label>
                                    <input 
                                        type="email" placeholder="Email nhận mã..." 
                                        value={email} onChange={e => setEmail(e.target.value)}
                                        style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }}
                                    />
                                </div>

                                <button 
                                    onClick={handleCheckout}
                                    style={{ width: '100%', padding: '15px', borderRadius: '8px', background: '#000080', color: 'white', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>
                                    THANH TOÁN
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8' }}>
                             <p>Vui lòng chọn mệnh giá thẻ muốn mua</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
      </main>

      <CustomerFooter />
    </div>
  );
};

export default CustomerHome;
