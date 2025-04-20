import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('adminToken');
      
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          // Verify user is an admin
          if (response.data.role === 'admin') {
            setUser(response.data);
            setIsAuthenticated(true);
          } else {
            console.error('User is not an admin');
            localStorage.removeItem('adminToken');
          }
        } catch (error) {
          console.error('Authentication check failed:', error);
          localStorage.removeItem('adminToken');
        }
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      console.log('Login attempt with:', credentials);
      const response = await authService.login(credentials);
      console.log('Login response:', response.data);
      
      const { token, user } = response.data;
      
      // Verify user is an admin
      if (user.role !== 'admin') {
        console.error('User is not an admin:', user);
        return { 
          success: false, 
          error: 'You do not have admin privileges' 
        };
      }
      
      console.log('Setting token and user:', token, user);
      localStorage.setItem('adminToken', token);
      setUser(user);
      setIsAuthenticated(true);
      console.log('isAuthenticated set to:', true);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      
      // Handle different error scenarios
      if (error.response?.status === 401) {
        return { 
          success: false, 
          error: 'Invalid email or password' 
        };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed. Please try again.' 
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('adminToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 