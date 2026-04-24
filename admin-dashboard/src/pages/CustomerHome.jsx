import React, { useState, useEffect } from 'react';
import { productApi, orderApi, bannerApi } from '../api';
import CustomerHeader from '../components/CustomerHeader';
import CustomerFooter from '../components/CustomerFooter';
import { ShoppingCart, Zap, Star, ShieldCheck, Ticket, ChevronLeft, ChevronRight } from 'lucide-react';

const CustomerHome = () => {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) setUser(JSON.parse(savedUser));

    // Lấy Category từ URL
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get('category');

    // Fetch Products
    productApi.getAll().then(res => {
        let data = res.data;
        if (categoryId) {
            data = data.filter(p => p.categoryId === parseInt(categoryId));
        }
        setProducts(data);
    }).catch(console.error);

    // Fetch Banners
    bannerApi.getAll().then(res => {
        setBanners(res.data);
        setLoading(false);
    }).catch(() => {
        setLoading(false);
    });
  }, [window.location.search]); // Chạy lại khi URL thay đổi

  useEffect(() => {
    if (banners.length > 0) {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }
  }, [banners]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const handleBuy = async (product) => {
    if (!user) {
        alert('Vui lòng đăng nhập để thực hiện mua hàng và tích điểm!');
        return;
    }
    try {
        const orderData = { customerId: user.id, productId: product.id, totalAmount: product.price, orderDate: new Date().toISOString() };
        await orderApi.create(orderData);
        alert(`Chúc mừng! Bạn đã mua ${product.name} thành công.`);
        window.location.reload();
    } catch (error) {
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <div style={{ background: '#020617', minHeight: '100vh', color: 'white' }}>
      <CustomerHeader user={user} handleLogout={handleLogout} />

      {/* Hero Banner Slideshow Section */}
      <section style={{ 
        position: 'relative', height: '80vh', minHeight: '600px', 
        overflow: 'hidden', padding: 0 
      }}>
        {banners.length > 0 ? banners.map((banner, index) => (
          <div key={banner.id || index} style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            opacity: currentSlide === index ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: currentSlide === index ? 1 : 0
          }}>
            {/* Background Image with Overlay */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: `linear-gradient(to bottom, rgba(2, 6, 23, 0.4), rgba(2, 6, 23, 0.9)), url(${banner.imageUrl})`,
                backgroundSize: 'cover', backgroundPosition: 'center'
            }}></div>

            {/* Content */}
            <div style={{ 
                position: 'relative', zIndex: 10, height: '100%', 
                display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                alignItems: 'center', textAlign: 'center', padding: '0 5%'
            }}>
                <div style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '6px 16px', background: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: '50px', border: '1px solid rgba(99, 102, 241, 0.2)',
                    color: '#818cf8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '24px'
                }}>
                    <Zap size={14} fill="currentColor" /> HỆ THỐNG TÍCH ĐIỂM TỰ ĐỘNG 1%
                </div>
                <h1 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '24px', maxWidth: '900px', lineHeight: 1.1 }}>
                    {banner.title}
                </h1>
                <p style={{ fontSize: '1.25rem', color: '#cbd5e1', maxWidth: '700px', marginBottom: '40px' }}>
                    {banner.description}
                </p>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <button style={{ 
                        background: '#6366f1', color: 'white', padding: '16px 40px', 
                        borderRadius: '16px', border: 'none', fontWeight: 700, fontSize: '1.1rem',
                        cursor: 'pointer', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)'
                    }}>Bắt Đầu Ngay</button>
                    <button style={{ 
                        background: 'rgba(255,255,255,0.1)', color: 'white', padding: '16px 40px', 
                        borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 700, 
                        fontSize: '1.1rem', cursor: 'pointer', backdropFilter: 'blur(10px)'
                    }}>Xem Bảng Giá</button>
                </div>
            </div>
          </div>
        )) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617' }}>
                <p style={{ color: '#64748b' }}>Đang tải banner hoặc chưa có banner nào được kích hoạt...</p>
            </div>
        )}

        {/* Navigation Dots */}
        {banners.length > 0 && (
            <div style={{ 
                position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', 
                zIndex: 20, display: 'flex', gap: '12px' 
            }}>
                {banners.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCurrentSlide(i)}
                      style={{ 
                        width: currentSlide === i ? '40px' : '10px', height: '10px', 
                        borderRadius: '10px', border: 'none', background: currentSlide === i ? '#6366f1' : 'rgba(255,255,255,0.3)',
                        cursor: 'pointer', transition: '0.3s'
                      }}
                    ></button>
                ))}
            </div>
        )}

        {/* Side Controls */}
        {banners.length > 0 && (
            <>
                <button onClick={() => setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length)}
                        style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 20, background: 'rgba(255,255,255,0.05)', border: 'none', padding: '15px', borderRadius: '50%', color: 'white', cursor: 'pointer' }}>
                    <ChevronLeft size={24} />
                </button>
                <button onClick={() => setCurrentSlide(prev => (prev + 1) % banners.length)}
                        style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 20, background: 'rgba(255,255,255,0.05)', border: 'none', padding: '15px', borderRadius: '50%', color: 'white', cursor: 'pointer' }}>
                    <ChevronRight size={24} />
                </button>
            </>
        )}
      </section>

      {/* Product Section */}
      <section id="products" style={{ padding: '100px 5% 120px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>Kho Thẻ Cào</h2>
                    <p style={{ color: '#64748b' }}>Hàng mới cập nhật hàng giờ từ các nhà mạng lớn</p>
                </div>
                <div style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '0.9rem' }}>
                    Sẵn có: <span style={{ color: '#6366f1', fontWeight: 700 }}>{products.length} loại</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
            {loading ? (
                Array(4).fill(0).map((_, i) => (
                    <div key={i} style={{ height: '350px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px' }}></div>
                ))
            ) : products.map(product => (
                <div key={product.id} className="product-card" style={{ 
                    background: 'rgba(30, 41, 59, 0.4)', padding: '30px', 
                    borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)',
                    transition: '0.3s', textAlign: 'center', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Ticket size={40} style={{ color: '#6366f1' }} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{product.name}</h3>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '16px', marginBottom: '24px' }}>
                        <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{product.price.toLocaleString()} <span style={{ fontSize: '0.85rem', color: '#6366f1' }}>VNĐ</span></p>
                    </div>
                    <button onClick={() => handleBuy(product)} style={{ width: '100%', padding: '14px', borderRadius: '14px', background: '#6366f1', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', transition: '0.3s' }}>
                        Mua Ngay
                    </button>
                    <div style={{ marginTop: '15px', fontSize: '0.75rem', color: '#10b981' }}>+{(product.price * 0.01 / 1000).toFixed(0)} points reward</div>
                </div>
            ))}
            </div>
        </div>
      </section>

      <CustomerFooter />

      <style dangerouslySetInnerHTML={{ __html: `
        .product-card:hover { transform: translateY(-10px); border-color: rgba(99, 102, 241, 0.4); }
      `}} />
    </div>
  );
};

export default CustomerHome;
