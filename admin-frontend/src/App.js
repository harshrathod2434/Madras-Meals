import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Orders from './pages/Orders';
import MenuPage from './pages/MenuPage';
import AddMenuItem from './pages/AddMenuItem';
import EditMenuItem from './pages/EditMenuItem';
import DeleteMenuItem from './pages/DeleteMenuItem';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Placeholder component for features not yet implemented
const ComingSoon = ({ feature }) => (
  <div className="container py-5 text-center">
    <h1 className="mb-4">{feature}</h1>
    <div className="alert alert-info">
      <h4>Coming Soon!</h4>
      <p>This feature is under development and will be available shortly.</p>
    </div>
    <button 
      className="btn btn-primary mt-3"
      onClick={() => window.history.back()}
    >
      Go Back
    </button>
  </div>
);

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
    <div className="admin-app d-flex flex-column min-vh-100">
      {isAuthenticated && <Navbar />}
      <main className="flex-grow-1">
        <Routes>
          <Route path="/login" element={<PublicRoute element={<Login />} />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          
          {/* Menu Routes */}
          <Route path="/menu" element={<PrivateRoute element={<MenuPage />} />} />
          <Route path="/menu/add" element={<PrivateRoute element={<AddMenuItem />} />} />
          <Route path="/menu/edit/:id" element={<PrivateRoute element={<EditMenuItem />} />} />
          <Route path="/menu/delete/:id" element={<PrivateRoute element={<DeleteMenuItem />} />} />
          
          {/* Order Routes */}
          <Route path="/orders" element={<PrivateRoute element={<Orders />} />} />
          
          {/* Placeholder Routes for features coming soon */}
          <Route path="/admin-access" element={<PrivateRoute element={<ComingSoon feature="Admin Access Management" />} />} />
          <Route path="/customers" element={<PrivateRoute element={<ComingSoon feature="Customer Profiles" />} />} />
          <Route path="/analytics" element={<PrivateRoute element={<ComingSoon feature="Analytics & Reports" />} />} />
          
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </main>
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