import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi } from '../api';
import CustomerHeader from '../components/CustomerHeader';
import CustomerFooter from '../components/CustomerFooter';
import { CreditCard } from 'lucide-react';

const CustomerHome = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) setUser(JSON.parse(savedUser));

    // Lấy dữ liệu nhà mạng từ Database
    categoryApi.getAll().then(res => {
        setCategories(res.data);
        setLoading(false);
    }).catch(err => {
        console.error(err);
        setLoading(false);
    });
  }, []);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <CustomerHeader user={user} handleLogout={() => setUser(null)} />

      <main style={{ maxWidth: '1200px', margin: '120px auto 80px', padding: '0 20px' }}>
        
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
                        {/* Chúng ta dùng description như link logo hoặc bạn có thể dán link logo vào Dashboard của Category */}
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
