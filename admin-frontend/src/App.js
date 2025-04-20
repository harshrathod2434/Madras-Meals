import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Orders from './pages/Orders';
import MenuPage from './pages/MenuPage';
import AddMenuItem from './pages/AddMenuItem';
import EditMenuItem from './pages/EditMenuItem';
import DeleteMenuItem from './pages/DeleteMenuItem';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AdminManagement from './pages/AdminManagement';
import CustomerManagement from './pages/CustomerManagement';
import ComingSoon from './pages/ComingSoon';

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

// Layout component with navbar and footer for authenticated routes
const Layout = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="admin-app d-flex flex-column min-vh-100">
      {isAuthenticated && <Navbar />}
      <main className="flex-grow-1">
        <Outlet />
      </main>
      {/* Global Footer - shown on all pages */}
      <Footer />
    </div>
  );
};

function App() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        
        {/* Menu Routes */}
        <Route path="/menu" element={<PrivateRoute element={<MenuPage />} />} />
        <Route path="/menu/add" element={<PrivateRoute element={<AddMenuItem />} />} />
        <Route path="/menu/edit/:id" element={<PrivateRoute element={<EditMenuItem />} />} />
        <Route path="/menu/delete/:id" element={<PrivateRoute element={<DeleteMenuItem />} />} />
        
        {/* Order Routes */}
        <Route path="/orders" element={<PrivateRoute element={<Orders />} />} />
        
        {/* Admin Management */}
        <Route path="/admin-access" element={<PrivateRoute element={<AdminManagement />} />} />
        
        {/* Customer Management */}
        <Route path="/customers" element={<PrivateRoute element={<CustomerManagement />} />} />
        
        {/* Placeholder Routes for features coming soon */}
        <Route path="/analytics" element={<PrivateRoute element={<ComingSoon feature="Analytics & Reports" />} />} />
        
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Route>
    </Routes>
  );
}

// Main wrapped with Router and AuthProvider
function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}

export default AppWrapper; 