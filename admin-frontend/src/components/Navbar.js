import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  // Custom styles for navbar elements
  const navbarStyle = {
    padding: '1rem 2rem', // Increased vertical padding and horizontal padding
  };

  const brandStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    transition: 'color 0.3s ease',
  };

  const brandHoverStyle = {
    color: '#ffc107', // Yellow color on hover (Bootstrap warning color)
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" className="mb-4" style={navbarStyle}>
      <Container fluid className="px-4"> {/* Added horizontal padding */}
        <BootstrapNavbar.Brand 
          as={Link} 
          to="/dashboard" 
          className="me-auto"
          style={brandStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = brandHoverStyle.color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '';
          }}
        >
          Madras Meals - Admin Panel
        </BootstrapNavbar.Brand>
        
        <Nav>
          {user && (
            <div className="d-flex align-items-center">
              <span className="navbar-text me-3 text-light">
                Hi, {user.name}
              </span>
              <Button
                variant="outline-light"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          )}
        </Nav>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar; 