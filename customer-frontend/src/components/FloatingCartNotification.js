import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/floatingCart.css';

const FloatingCartNotification = ({ item, isVisible, onClose }) => {
  const navigate = useNavigate();
  const [animation, setAnimation] = useState('slide-in');
  
  useEffect(() => {
    if (isVisible) {
      setAnimation('slide-in');
      
      // Start exit animation after 3.5 seconds
      const timer = setTimeout(() => {
        setAnimation('slide-out');
        // Call onClose after animation completes
        setTimeout(() => onClose(), 500);
      }, 3500);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);
  
  if (!isVisible) return null;
  
  return (
    <div className={`floating-cart-notification ${animation}`}>
      <Card className="border-0 shadow-lg text-white">
        <Card.Body className="d-flex align-items-center p-3">
          <div className="me-3">
            <img 
              src={item?.image}
              alt={item?.name}
              className="notification-image"
              width={60}
              height={60}
            />
          </div>
          <div className="flex-grow-1">
            <div className="fw-bold text-white mb-1">
              <i className="bi bi-check-circle-fill me-2"></i>
              Added to cart!
            </div>
            <div className="item-name text-white">{item?.name}</div>
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            className="ms-2"
            onClick={() => navigate('/cart')}
          >
            View Cart
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FloatingCartNotification; 