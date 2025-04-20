import axios from 'axios';

const API_URL = 'http://localhost:2000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const menuService = {
  getAllMenuItems: () => api.get('/menu'),
  getMenuItem: (id) => api.get(`/menu/${id}`)
};

export const orderService = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getUserOrders: () => api.get('/orders/my-orders'),
  getAllOrders: () => api.get('/orders'),
  updateOrderStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { status }),
  updateOrderItems: (orderId, items) => api.put(`/orders/${orderId}/items`, { items })
};

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me')
}; 