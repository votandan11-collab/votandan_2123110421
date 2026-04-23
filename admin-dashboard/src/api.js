import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // This will be replaced by Render URL later

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

// Add more API calls as needed for other entities

export default api;
