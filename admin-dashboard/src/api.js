import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  getAll: () => api.get('/product'),
  create: (data) => api.post('/product', data),
  update: (id, data, adminName) => api.put(`/product/${id}?adminName=${adminName}`, data),
  delete: (id) => api.delete(`/product/${id}`),
};

export const categoryApi = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const customerApi = {
  getAll: () => api.get('/Customers'),
  getById: (id) => api.get(`/Customers/${id}`),
  create: (data) => api.post('/Customers', data),
  update: (id, data) => api.put(`/Customers/${id}`, data),
  delete: (id) => api.delete(`/Customers/${id}`),
};

export const orderApi = {
  getAll: () => api.get('/Order'),
  getById: (id) => api.get(`/Order/${id}`),
  getByCustomerId: (customerId) => api.get(`/Order/customer/${customerId}`),
  create: (data) => api.post('/Order', data),
  update: (id, data, adminName) => api.put(`/Order/${id}?adminName=${adminName}`, data),
  delete: (id) => api.delete(`/Order/${id}`),
};

export const rewardApi = {
  getAll: () => api.get('/Reward'),
  create: (data) => api.post('/Reward', data),
  redeem: (customerId, rewardId) => api.post(`/Reward/redeem?customerId=${customerId}&rewardId=${rewardId}`),
  update: (id, data) => api.put(`/Reward/${id}`, data),
  delete: (id) => api.delete(`/Reward/${id}`),
};

export const pointsHistoryApi = {
  getAll: () => api.get('/PointsHistory'),
  getByCustomerId: (customerId) => api.get(`/PointsHistory/customer/${customerId}`),
};

export const storeApi = {
  getAll: () => api.get('/Stores'),
  create: (data) => api.post('/Stores', data),
  update: (id, data) => api.put(`/Stores/${id}`, data),
  delete: (id) => api.delete(`/Stores/${id}`),
};

export const employeeApi = {
  getAll: () => api.get('/Employees'),
  create: (data) => api.post('/Employees', data),
  update: (id, data) => api.put(`/Employees/${id}`, data),
  delete: (id) => api.delete(`/Employees/${id}`),
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
    create: (data) => api.post(`/Banners`, data),
    update: (id, data) => api.put(`/Banners/${id}`, data),
    delete: (id) => api.delete(`/Banners/${id}`)
};

export default api;
