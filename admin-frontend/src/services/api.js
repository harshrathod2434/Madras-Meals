import axios from 'axios';

const API_URL = 'http://localhost:2000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  // Ensure CORS credentials work properly
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN'
});

// Menu Management
export const menuService = {
  // Get all menu items
  getAllMenuItems: () => api.get('/menu'),
  
  // Get specific menu item
  getMenuItem: (id) => api.get(`/menu/${id}`),
  
  // Create new menu item
  createMenuItem: (formData) => api.post('/menu', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  // Update menu item
  updateMenuItem: (id, formData) => api.put(`/menu/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  // Delete menu item
  deleteMenuItem: (id) => api.delete(`/menu/${id}`),
  
  // Upload menu item image
  uploadImage: (id, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post(`/menu/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Import menu items from CSV
  importMenuItemsFromCSV: (csvFile) => {
    const formData = new FormData();
    formData.append('csv', csvFile);
    return api.post('/menu/import-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Get CSV template
  getCSVTemplate: () => {
    // Use direct URL for downloading files
    window.open(`${API_URL}/menu/csv-template`, '_blank');
    return Promise.resolve(); // Return a resolved promise for consistency
  }
};

// Order Management
export const orderService = {
  // Get all orders
  getAllOrders: () => api.get('/orders'),
  
  // Get specific order
  getOrder: (id) => api.get(`/orders/${id}`),
  
  // Update order status
  updateOrderStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { status }),
  
  // Update order items
  updateOrderItems: (orderId, items) => api.put(`/orders/${orderId}/items`, { items }),
  
  // Cancel order
  cancelOrder: (orderId) => api.put(`/orders/${orderId}/cancel`),
  
  // Get orders by status
  getOrdersByStatus: (status) => api.get(`/orders?status=${status}`),
  
  // Get orders by date range
  getOrdersByDateRange: (startDate, endDate) => 
    api.get(`/orders?startDate=${startDate}&endDate=${endDate}`)
};

// Authentication
export const authService = {
  // Login - explicitly include credentials
  login: (credentials) => api.post('/auth/login', credentials, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  }),
  
  // Logout
  logout: () => api.post('/auth/logout'),
  
  // Get current user
  getCurrentUser: () => api.get('/auth/me'),
  
  // Change password
  changePassword: (oldPassword, newPassword) => 
    api.put('/auth/change-password', { oldPassword, newPassword })
};

// Add request interceptor for auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Request error interceptor:', error);
    return Promise.reject(error);
  }
);

// Error handling interceptor
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Response error interceptor:', error);
    
    if (error.response?.status === 401) {
      // Only clear token and redirect for auth endpoints when already logged in
      if (error.config.url !== '/auth/login' && localStorage.getItem('adminToken')) {
        console.log('Unauthorized access detected, redirecting to login');
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 