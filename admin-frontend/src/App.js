import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Orders from './pages/Orders';
import AddMenuItem from './pages/AddMenuItem';
import EditMenuItem from './pages/EditMenuItem';
import DeleteMenuItem from './pages/DeleteMenuItem';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// PrivateRoute component to protect routes
const PrivateRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="text-center mt-5"><span className="spinner-border"></span></div>;
  }
  
  return isAuthenticated ? element : <Navigate to="/login" />;
};

// PublicRoute component for routes like login
const PublicRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="text-center mt-5"><span className="spinner-border"></span></div>;
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" /> : element;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="admin-app">
      {isAuthenticated && <Navbar />}
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<PublicRoute element={<Login />} />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/orders" element={<PrivateRoute element={<Orders />} />} />
          <Route path="/menu/add" element={<PrivateRoute element={<AddMenuItem />} />} />
          <Route path="/menu/edit/:id" element={<PrivateRoute element={<EditMenuItem />} />} />
          <Route path="/menu/delete/:id" element={<PrivateRoute element={<DeleteMenuItem />} />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App; 