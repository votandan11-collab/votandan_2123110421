import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi, bannerApi } from '../api';
import CustomerHeader from '../components/CustomerHeader';
import CustomerFooter from '../components/CustomerFooter';
import { CreditCard } from 'lucide-react';

const CustomerHome = () => {
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) setUser(JSON.parse(savedUser));

    // Lấy dữ liệu Banners và Danh mục từ Database
    Promise.all([categoryApi.getAll(), bannerApi.getAll()])
        .then(([catRes, bannerRes]) => {
            setCategories(catRes.data);
            setBanners(bannerRes.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }
  }, [banners]);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <CustomerHeader user={user} handleLogout={() => setUser(null)} />

      {/* Hero Banner (Dynamic) */}
      <section style={{ position: 'relative', height: '40vh', minHeight: '300px', overflow: 'hidden', marginTop: '60px' }}>
        {banners.length > 0 ? banners.map((banner, index) => (
          <div key={banner.id} style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            opacity: currentSlide === index ? 1 : 0, transition: 'opacity 1s', zIndex: currentSlide === index ? 1 : 0
          }}>
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${banner.imageUrl})`,
                backgroundSize: 'cover', backgroundPosition: 'center'
            }}></div>
            <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: 'white', padding: '0 5%' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '10px', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>{banner.title}</h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>{banner.description}</p>
            </div>
          </div>
        )) : <div style={{ height: '100%', background: '#1e293b' }}></div>}
      </section>

      <main style={{ maxWidth: '1200px', margin: '60px auto 80px', padding: '0 20px' }}>
        
        {/* THÔNG BÁO CHÀO MỪNG */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>Mua Thẻ Nạp</h1>
            <p style={{ color: '#64748b', marginTop: '10px', maxWidth: '800px', margin: '15px auto', lineHeight: '1.6' }}>
                Yêu cầu copy chính xác số tiền và nội dung chuyển khoản. Hệ thống sẽ hủy giao dịch nếu không nhận được thanh toán trong vòng 15 phút. 
                <span style={{ color: '#ef4444', fontWeight: 600 }}> Thanh toán xong vui lòng chờ 1 phút mã thẻ sẽ hiện ngay tại web!</span>
            </p>
        </div>

        {/* LƯỚI NHÀ MẠNG (DYNAMIC DATA) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
            {categories.map((cat) => (
                <Link 
                    key={cat.id} 
                    to={`/buy/${cat.id}`}
                    style={{ 
                        background: 'white', borderRadius: '12px', padding: '20px', 
                        textDecoration: 'none', textAlign: 'center', transition: '0.3s',
                        border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', gap: '15px', color: '#1e293b'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                    <div style={{ 
                        width: '140px', height: '80px', overflow: 'hidden', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {cat.description && cat.description.startsWith('http') ? (
                            <img src={cat.description} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt={cat.name} />
                        ) : (
                            <div style={{ background: '#f1f5f9', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                                <CreditCard size={32} color="#94a3b8" />
                            </div>
                        )}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{cat.name}</span>
                </Link>
            ))}
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
};

export default CustomerHome;
