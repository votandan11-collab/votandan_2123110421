import React from 'react';
import { Mail, Phone, MapPin, Globe, CreditCard, ShieldCheck } from 'lucide-react';

const CustomerFooter = () => {
  return (
    <footer style={{ 
      background: '#020617', padding: '80px 5% 40px', 
      borderTop: '1px solid rgba(255, 255, 255, 0.05)', color: 'white' 
    }}>
      <div style={{ 
        maxWidth: '1400px', margin: '0 auto', display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '50px' 
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', color: '#6366f1' }}>CARD LOYALTY</h2>
          <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '25px' }}>
            Hệ thống cung cấp thẻ cào điện thoại tự động, tích điểm thông minh dành cho khách hàng thân thiết. 
            Mua càng nhiều, ưu đãi càng lớn!
          </p>
          <div style={{ display: 'flex', gap: '15px' }}>
            {[Globe, CreditCard, ShieldCheck].map((Icon, i) => (
              <a key={i} href="#" style={{ 
                width: '40px', height: '40px', borderRadius: '10px', 
                background: 'rgba(255,255,255,0.05)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', color: 'white',
                transition: '0.3s'
              }}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '25px' }}>Dịch Vụ</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Thẻ Cào Viettel', 'Thẻ Cào Mobi', 'Thẻ Cào Vina', 'Thành Viên VIP', 'Đổi Quà Tặng'].map(item => (
              <li key={item}><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s' }}>{item}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '25px' }}>Liên Hệ</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#94a3b8' }}>
              <Phone size={18} style={{ color: '#6366f1' }} />
              <span>+84 123 456 789</span>
            </li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#94a3b8' }}>
              <Mail size={18} style={{ color: '#6366f1' }} />
              <span>support@cardloyalty.vn</span>
            </li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#94a3b8' }}>
              <MapPin size={18} style={{ color: '#6366f1' }} />
              <span>Q. Liên Chiểu, Đà Nẵng, Việt Nam</span>
            </li>
          </ul>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1400px', margin: '60px auto 0', padding: '30px 0 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center',
        color: '#64748b', fontSize: '0.85rem'
      }}>
        © 2026 Card Loyalty System. All rights reserved. Designed for Future Store.
      </div>
    </footer>
  );
};

export default CustomerFooter;
