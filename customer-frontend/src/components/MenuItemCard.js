import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import '../styles/menuCard.css'; // We'll create this CSS file

const MenuItemCard = ({ item }) => {
  const { addToCart } = useCart();

  return (
    <Card className="h-100 menu-card">
      <Card.Img
        variant="top"
        src={item.image}
        alt={item.name}
        style={{ height: '200px', objectFit: 'cover' }}
        className="card-img-animation"
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="card-title-animation">{item.name}</Card.Title>
        <Card.Text>{item.description}</Card.Text>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="h5 mb-0">₹{item.price}</span>
          <Button
            variant="primary"
            onClick={() => addToCart(item)}
            className="btn-animation"
          >
            Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MenuItemCard; 