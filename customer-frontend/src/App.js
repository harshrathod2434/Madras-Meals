import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingCartNotification from './components/FloatingCartNotification';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { useCart } from './context/CartContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/theme.css';
import './styles/patterns.css';

// Wrapper component to access the cart context
const AppContent = () => {
  const { notificationItem, showNotification, hideNotification } = useCart();
  
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="texture-overlay">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={
            <Container className="py-4">
              <Menu />
            </Container>
          } />
          <Route path="/cart" element={
            <Container className="py-4">
              <Cart />
            </Container>
          } />
          <Route path="/my-orders" element={
            <Container className="py-4">
              <MyOrders />
            </Container>
          } />
          <Route path="/login" element={
            <Container className="py-4">
              <Login />
            </Container>
          } />
          <Route path="/register" element={
            <Container className="py-4">
              <Register />
            </Container>
          } />
          <Route path="/profile" element={
            <Container className="py-4">
              <Profile />
            </Container>
          } />
        </Routes>
        
        <Footer />
        <FloatingCartNotification 
          item={notificationItem} 
          isVisible={showNotification} 
          onClose={hideNotification} 
        />
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App; 