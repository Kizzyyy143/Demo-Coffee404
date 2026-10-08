import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthorized / token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    const res = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export const productsAPI = {
  getAll: async (categoryId = null) => {
    const res = await api.get('/products/', {
      params: categoryId ? { category_id: categoryId } : {},
    });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/products/', data);
    return res.data;
  },
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/products/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};

export const categoriesAPI = {
  getAll: async () => {
    const res = await api.get('/categories/');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/categories/', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/categories/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  },
};

export const ordersAPI = {
  getAll: async () => {
    const res = await api.get('/orders/');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/orders/', data);
    return res.data;
  },
  updateStatus: async (id, statusData) => {
    const res = await api.put(`/orders/${id}`, statusData);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/orders/${id}`);
    return res.data;
  },
};

export const customersAPI = {
  getAll: async () => {
    const res = await api.get('/customers/');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/customers/', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/customers/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/customers/${id}`);
    return res.data;
  },
};

export const employeesAPI = {
  getAll: async () => {
    const res = await api.get('/employees/');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/employees/', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/employees/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/employees/${id}`);
    return res.data;
  },
};

export const inventoryAPI = {
  getAll: async () => {
    const res = await api.get('/inventory/');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/inventory/', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/inventory/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/inventory/${id}`);
    return res.data;
  },
};

export const paymentsAPI = {
  getAll: async () => {
    const res = await api.get('/payments/');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/payments/', data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/payments/${id}`);
    return res.data;
  },
};

export const reportsAPI = {
  getDashboard: async (period = 'all') => {
    const res = await api.get('/reports/dashboard', { params: { period } });
    return res.data;
  },
  getTopProducts: async (period = 'all') => {
    const res = await api.get('/reports/top-products', { params: { period } });
    return res.data;
  },
  getSalesSummary: async (period = 'all') => {
    const res = await api.get('/reports/sales-summary', { params: { period } });
    return res.data;
  },
};

export default api;

