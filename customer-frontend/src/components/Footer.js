import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: '#212529', 
      color: 'white', 
      width: '100vw', 
      marginLeft: 'calc(-50vw + 50%)', 
      marginRight: 'calc(-50vw + 50%)', 
      position: 'relative', 
      left: '50%', 
      right: '50%', 
      transform: 'translateX(-50%)'
    }}>
      <Container className="py-4">
        <Row>
          <Col xs={12} md={4} className="mb-3 mb-md-0 text-center">
            <h5>Contact Us</h5>
            <p>
              123 Food Street, Chennai, India<br />
              +91 1234567890<br />
              info@madrasmeals.com
            </p>
          </Col>
          <Col xs={12} md={4} className="mb-3 mb-md-0 text-center">
            <h5>Opening Hours</h5>
            <p>
              Monday - Friday: 11:00 AM - 10:00 PM<br />
              Saturday - Sunday: 10:00 AM - 11:00 PM
            </p>
          </Col>
          <Col xs={12} md={4} className="text-center">
            <h5>Follow Us</h5>
            <div className="social-links">
              <a href="#" className="text-white me-3 fs-4"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white me-3 fs-4"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-white me-3 fs-4"><i className="bi bi-twitter"></i></a>
            </div>
          </Col>
        </Row>
        <hr className="mt-4" />
        <p className="text-center mb-0">&copy; 2024 MadrasMeals. All rights reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer; 