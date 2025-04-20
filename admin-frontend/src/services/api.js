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
  
  // Delete multiple menu items
  deleteMultipleMenuItems: (ids) => api.post('/menu/delete-multiple', { ids }),
  
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
    console.log('Downloading CSV template...');
    return fetch(`${API_URL}/menu/csv-template`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      console.log('Response headers:', response.headers.get('Content-Type'));
      
      // Check if the response is a CSV file
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('text/csv')) {
        return response.blob();
      } else {
        // If it's not a CSV, try to parse it as JSON to get error message
        return response.json().then(data => {
          throw new Error(data.error || 'Invalid response format');
        });
      }
    })
    .then(blob => {
      console.log('CSV blob received, size:', blob.size);
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      // Create a temporary link element
      const a = document.createElement('a');
      a.href = url;
      a.download = 'menu-items-template.csv';
      // Append to the document
      document.body.appendChild(a);
      // Trigger a click
      a.click();
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      console.log('Download initiated');
    });
  }
};

// Order Management
export const orderService = {
  // Get all orders
  getAllOrders: () => api.get('/orders/admin/all'),
  
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

// Admin Management
export const adminService = {
  // Get all admin users
  getAllAdmins: () => api.get('/admin'),
  
  // Create a new admin user
  createAdmin: (adminData) => api.post('/admin', adminData),
  
  // Delete an admin user
  deleteAdmin: (id) => api.delete(`/admin/${id}`)
};

// Customer Management
export const customerService = {
  // Get all customers (users with role 'user')
  getAllCustomers: () => api.get('/customers'),
  
  // Get orders for a specific customer
  getCustomerOrders: (customerId) => api.get(`/customers/${customerId}/orders`),
  
  // Get customer statistics
  getCustomerStats: () => api.get('/customers/stats')
};

// Add request interceptor for auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('adminToken');
    console.log('API Request:', config.method.toUpperCase(), config.url);
    
    if (token) {
      console.log('Attaching token to request');
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.log('No token found in localStorage');
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
  response => {
    console.log('API Response Success:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API Response Error:', error.response?.status, error.config?.url, error.message);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Authentication error detected', error.response.status);
      
      // Only redirect for auth errors when not on login page and token exists
      if (error.config.url !== '/auth/login' && localStorage.getItem('adminToken')) {
        console.log('Unauthorized access detected, redirecting to login');
        localStorage.removeItem('adminToken');
        
        // Delay redirect slightly to allow error handling to complete
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 