import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi, bannerApi } from '../api';
import CustomerHeader from '../components/CustomerHeader';
import CustomerFooter from '../components/CustomerFooter';
import { CreditCard, Zap, ArrowRight } from 'lucide-react';
import './CustomerHome.css';

const CustomerHome = () => {
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) setUser(JSON.parse(savedUser));

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
        }, 6000);
        return () => clearInterval(timer);
    }
  }, [banners]);

  return (
    <div className="customer-home">
      <CustomerHeader user={user} handleLogout={() => setUser(null)} />

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-bg-gradient hero-bg-gradient-1"></div>
        <div className="hero-bg-gradient hero-bg-gradient-2"></div>

        {banners.length > 0 && banners.map((banner, index) => (
          <div key={banner.id} style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            opacity: currentSlide === index ? 1 : 0, transition: 'opacity 1.5s ease-in-out', zIndex: currentSlide === index ? 1 : 0
          }}>
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.4), rgba(2, 6, 23, 0.9)), url(${banner.imageUrl})`,
                backgroundSize: 'cover', backgroundPosition: 'center', 
                transform: currentSlide === index ? 'scale(1.1)' : 'scale(1)', 
                transition: 'transform 10s ease-out'
            }}></div>
          </div>
        ))}

        <div className="hero-content">
            <div className="hero-badge">
                <Zap size={14} fill="currentColor" style={{ marginRight: '8px' }} /> 
                Evolutionary Card Topup
            </div>
            <h1 className="hero-title">
                {banners[currentSlide]?.title || 'The Future of Digital Topups'}
            </h1>
            <p className="hero-description">
                {banners[currentSlide]?.description || 'Experience the next generation of card top-ups with exclusive VIP rewards and market-leading discounts.'}
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <button className="btn-premium btn-primary-premium" style={{ padding: '18px 40px', fontSize: '1.1rem' }}>
                    Get Started <ArrowRight size={20} />
                </button>
                <button className="btn-premium" style={{ 
                  padding: '18px 40px', 
                  fontSize: '1.1rem',
                  background: 'oklch(100% 0 0 / 0.05)',
                  border: '1px solid oklch(100% 0 0 / 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: '#fff'
                }}>
                    View Offers
                </button>
            </div>
        </div>
      </section>

      <main style={{ maxWidth: '1400px', margin: '100px auto 0', padding: '0 5%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
            <div style={{ animation: 'fadeIn 1s ease-out' }}>
                <h2 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Available Networks</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '1.2rem', maxWidth: '600px' }}>
                    Select your preferred provider. Our rates are optimized daily for maximum value.
                </p>
            </div>
            <div className="hero-badge" style={{ margin: 0, opacity: 0.6 }}>
                {categories.length} Networks Active
            </div>
        </div>

        <div className="category-grid">
            {categories.map((cat, index) => (
                <Link 
                    key={cat.id} 
                    to={`/buy/${cat.id}`}
                    className="category-card"
                    style={{ animation: `slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both` }}
                >
                    <div className="category-icon-wrapper">
                        {cat.description && cat.description.startsWith('http') ? (
                            <img src={cat.description} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt={cat.name} />
                        ) : (
                            <CreditCard size={48} color="var(--primary)" />
                        )}
                    </div>
                    <div className="category-info">
                        <span className="category-name">{cat.name}</span>
                        <span className="category-discount">Up to 4.5% Discount</span>
                    </div>
                    <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)' }}></div>
                    <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '0.05em' }}>
                        SECURE TOPUP <ArrowRight size={18} />
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
