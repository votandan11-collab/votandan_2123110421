import axios from 'axios';

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Đảm bảo URL luôn kết thúc bằng /api (Fix lỗi 404 khi up lên Render)
if (API_BASE_URL && !API_BASE_URL.endsWith('/api')) {
    API_BASE_URL = `${API_BASE_URL.replace(/\/$/, '')}/api`;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  getAll: () => api.get('/Product'),
  create: (data, adminName) => api.post(`/Product?adminName=${adminName || 'Admin'}`, data),
  update: (id, data, adminName) => api.put(`/Product/${id}?adminName=${adminName || 'Admin'}`, data),
  delete: (id, adminName) => api.delete(`/Product/${id}?adminName=${adminName || 'Admin'}`),
};

export const categoryApi = {
  getAll: () => api.get('/Categories'),
  create: (data, adminName) => api.post(`/Categories?adminName=${adminName || 'Admin'}`, data),
  update: (id, data, adminName) => api.put(`/Categories/${id}?adminName=${adminName || 'Admin'}`, data),
  delete: (id, adminName) => api.delete(`/Categories/${id}?adminName=${adminName || 'Admin'}`),
};

export const customerApi = {
  getAll: () => api.get('/Customers'),
  getById: (id) => api.get(`/Customers/${id}`),
  create: (data, adminName) => api.post(`/Customers?adminName=${adminName || 'Admin'}`, data),
  update: (id, data, adminName) => api.put(`/Customers/${id}?adminName=${adminName || 'Admin'}`, data),
  delete: (id, adminName) => api.delete(`/Customers/${id}?adminName=${adminName || 'Admin'}`),
  login: (data) => api.post('/Customers/login', data),
  register: (data) => api.post('/Customers/register', data),
  forgotPassword: (data) => api.post('/Customers/forgot-password', data),
};

export const orderApi = {
  getAll: () => api.get('/Order'),
  getById: (id) => api.get(`/Order/${id}`),
  getByCustomerId: (customerId) => api.get(`/Order/customer/${customerId}`),
  create: (data) => api.post('/Order', data),
  update: (id, data, adminName) => api.put(`/Order/${id}?adminName=${adminName || 'Admin'}`, data),
  delete: (id, adminName) => api.delete(`/Order/${id}?adminName=${adminName || 'Admin'}`),
};

export const rewardApi = {
  getAll: () => api.get('/Rewards'),
  create: (data, adminName) => api.post(`/Rewards?adminName=${adminName || 'Admin'}`, data),
  redeem: (data) => api.post('/Rewards/redeem', data), // data: { CustomerId: x, RewardId: y }
  update: (id, data, adminName) => api.put(`/Rewards/${id}?adminName=${adminName || 'Admin'}`, data),
  delete: (id, adminName) => api.delete(`/Rewards/${id}?adminName=${adminName || 'Admin'}`),
};

export const pointsHistoryApi = {
  getAll: () => api.get('/PointsHistory'),
  getByCustomerId: (customerId) => api.get(`/PointsHistory/customer/${customerId}`),
};

export const storeApi = {
  getAll: () => api.get('/Stores'),
  create: (data, adminName) => api.post(`/Stores?adminName=${adminName || 'Admin'}`, data),
  update: (id, data, adminName) => api.put(`/Stores/${id}?adminName=${adminName || 'Admin'}`, data),
  delete: (id, adminName) => api.delete(`/Stores/${id}?adminName=${adminName || 'Admin'}`),
};

export const employeeApi = {
  getAll: () => api.get('/Employees'),
  create: (data, adminName) => api.post(`/Employees?adminName=${adminName || 'Admin'}`, data),
  update: (id, data, adminName) => api.put(`/Employees/${id}?adminName=${adminName || 'Admin'}`, data),
  delete: (id, adminName) => api.delete(`/Employees/${id}?adminName=${adminName || 'Admin'}`),
  login: (data) => api.post('/Employees/login', data),
};

export const paymentApi = {
  getAll: () => api.get('/Payment'),
  create: (data) => api.post('/Payment', data),
  complete: (id) => api.post(`/Payment/${id}/complete`),
  update: (id, data) => api.put(`/Payment/${id}`, data),
  delete: (id) => api.delete(`/Payment/${id}`),
};

// Banner API
export const bannerApi = {
    getAll: () => api.get(`/Banners`),
    getAdmin: () => api.get(`/Banners/admin`),
    create: (data, adminName) => api.post(`/Banners?adminName=${adminName || 'Admin'}`, data),
    update: (id, data, adminName) => api.put(`/Banners/${id}?adminName=${adminName || 'Admin'}`, data),
    delete: (id, adminName) => api.delete(`/Banners/${id}?adminName=${adminName || 'Admin'}`)
};

// Stats API
export const statsApi = {
    get: () => api.get('/Stats')
};

export default api;
