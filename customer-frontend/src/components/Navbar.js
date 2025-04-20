import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Badge, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart, getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalItems = getTotalItems();

  return (
    <>
      <BootstrapNavbar 
        bg="dark" 
        variant="dark" 
        expand="lg" 
        className="py-3 navbar-custom" 
        fixed="top"
        style={{ 
          borderBottom: '2px solid rgba(255, 255, 255, 0.8)'
        }}
      >
        <Container>
          <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center brand-large">
            <Image 
              src="https://res.cloudinary.com/dyzvzef89/image/upload/v1745157332/logo_qz1szy.svg" 
              alt="Madras Meals Logo" 
              height="38" 
              className="me-2" 
            />
            Madras Meals
          </BootstrapNavbar.Brand>
          
          {/* Always visible on mobile */}
          <div className="d-flex d-lg-none align-items-center">
            <Nav.Link as={Link} to="/menu" className="text-white mx-2">
              <i className="bi bi-book-fill"></i>
            </Nav.Link>
            <Nav.Link as={Link} to="/cart" className="text-white mx-2 position-relative">
              <i className="bi bi-cart-fill"></i>
              {totalItems > 0 && (
                <Badge 
                  bg="primary" 
                  pill 
                  className="position-absolute cart-badge"
                >
                  {totalItems}
                </Badge>
              )}
            </Nav.Link>
            <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" className="ms-2" />
          </div>
          
          {/* Original navbar structure for desktop */}
          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto nav-links-custom">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/menu">Menu</Nav.Link>
            </Nav>
            <Nav className="nav-links-custom">
              <Nav.Link as={Link} to="/cart" className="d-flex align-items-center">
                <i className="bi bi-cart-fill me-1"></i>
                Cart {totalItems > 0 && (
                  <Badge bg="primary" className="ms-1">{totalItems}</Badge>
                )}
              </Nav.Link>
              {user ? (
                <>
                  <Nav.Link as={Link} to="/my-orders">My Orders</Nav.Link>
                  <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                  <div className="user-greeting d-flex align-items-center mx-2">
                    <span className="text-light">Hi, {user.name || user.email.split('@')[0]}</span>
                  </div>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
      <div className="navbar-spacer"></div>
    </>
  );
};

export default Navbar; 