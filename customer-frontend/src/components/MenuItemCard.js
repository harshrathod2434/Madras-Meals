import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import '../styles/menuCard.css'; // We'll create this CSS file

const MenuItemCard = ({ item }) => {
  const { addToCart } = useCart();

  return (
    <Card className="h-100 menu-card shadow-sm border-0 rounded-lg overflow-hidden">
      <div className="menu-img-container">
        <Card.Img
          variant="top"
          src={item.image}
          alt={item.name}
          style={{ height: '280px', objectFit: 'cover', transition: 'transform 0.3s ease-in-out' }}
          className="card-img-animation"
        />
      </div>
      <Card.Body className="d-flex flex-column p-4">
        <Card.Title className="card-title-animation fw-bold">{item.name}</Card.Title>
        <Card.Text className="text-muted">{item.description}</Card.Text>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="h5 mb-0 fw-bold text-primary">₹{item.price}</span>
          <Button
            variant="primary"
            onClick={() => addToCart(item)}
            className="btn-animation rounded-pill px-3"
          >
            Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MenuItemCard; 