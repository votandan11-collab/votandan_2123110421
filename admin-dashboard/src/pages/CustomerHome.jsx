import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi, bannerApi } from '../api';
import CustomerHeader from '../components/CustomerHeader';
import CustomerFooter from '../components/CustomerFooter';
import { CreditCard, Zap, ArrowRight } from 'lucide-react';

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
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh', color: 'white' }}>
      <CustomerHeader user={user} handleLogout={() => setUser(null)} />

      {/* HERO SECTION */}
      <section style={{ 
        position: 'relative', height: '60vh', minHeight: '500px', display: 'flex', alignItems: 'center', 
        justifyContent: 'center', overflow: 'hidden', padding: '0 5%', paddingTop: '80px'
      }}>
        {/* Background Gradients */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }}></div>

        {banners.length > 0 ? banners.map((banner, index) => (
          <div key={banner.id} style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            opacity: currentSlide === index ? 1 : 0, transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: currentSlide === index ? 1 : 0
          }}>
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.3), rgba(2, 6, 23, 0.8)), url(${banner.imageUrl})`,
                backgroundSize: 'cover', backgroundPosition: 'center', transform: currentSlide === index ? 'scale(1.05)' : 'scale(1)', transition: 'transform 10s linear'
            }}></div>
          </div>
        )) : <div style={{ height: '100%', background: '#020617' }}></div>}

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '900px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '6px 16px', borderRadius: '100px', color: '#818cf8', fontSize: '0.8rem', fontWeight: 700, marginBottom: '24px', letterSpacing: '0.05em' }}>
                <Zap size={14} fill="currentColor" /> THE FUTURE OF CARD TOPUP
            </div>
            <h1 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '20px', lineHeight: '1.1', letterSpacing: '-0.04em' }}>
                {banners[currentSlide]?.title || 'Hệ Thống Nạp Thẻ Thông Minh'}
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
                {banners[currentSlide]?.description || 'Trải nghiệm mua sắm thẻ cào, thẻ game với chiết khấu tốt nhất và hệ thống tích điểm VIP độc quyền.'}
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button style={{ padding: '16px 32px', borderRadius: '16px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)', transition: '0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>Bắt đầu ngay</button>
                <button style={{ padding: '16px 32px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', backdropFilter: 'blur(10px)', transition: '0.3s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>Xem khuyến mãi</button>
            </div>
        </div>
      </section>

      <main style={{ maxWidth: '1400px', margin: '80px auto', padding: '0 5%' }}>
        {/* SECTION HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Chọn Nhà Mạng</h2>
                <p style={{ color: '#64748b', marginTop: '8px', fontSize: '1.1rem' }}>Sản phẩm được cập nhật liên tục với chiết khấu tốt nhất thị trường.</p>
            </div>
            <div style={{ padding: '12px 24px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>
                {categories.length} Nhà mạng khả dụng
            </div>
        </div>

        {/* CATEGORY GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {categories.map((cat) => (
                <Link 
                    key={cat.id} to={`/buy/${cat.id}`}
                    style={{ 
                        background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '32px', 
                        textDecoration: 'none', border: '1px solid rgba(255,255,255,0.05)', 
                        display: 'flex', flexDirection: 'column', alignItems: 'center', 
                        gap: '24px', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        backdropFilter: 'blur(10px)'
                    }}
                    onMouseOver={(e) => { 
                        e.currentTarget.style.transform = 'translateY(-10px)'; 
                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'; 
                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                        e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.4)';
                    }}
                    onMouseOut={(e) => { 
                        e.currentTarget.style.transform = 'translateY(0)'; 
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; 
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <div style={{ 
                        width: '100px', height: '100px', background: 'white', borderRadius: '24px', 
                        padding: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {cat.description && cat.description.startsWith('http') ? (
                            <img src={cat.description} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt={cat.name} />
                        ) : (
                            <CreditCard size={40} color="#6366f1" />
                        )}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white', display: 'block', marginBottom: '4px' }}>{cat.name}</span>
                        <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Chiết khấu tới 4%</span>
                    </div>
                    <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                    <div style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        MUA NGAY <ArrowRight size={16} />
                    </div>
                </Link>
            ))}
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
};

export default CustomerHome;
