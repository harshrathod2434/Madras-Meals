import React from 'react';
import { Card, Button, InputGroup, Form } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import '../styles/menuCard.css'; // Import the menuCard CSS for consistent styling

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    updateQuantity(item._id, newQuantity);
  };

  return (
    <Card className="mb-3">
      <Card.Body className="d-flex align-items-center">
        <img
          src={item.image}
          alt={item.name}
          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
          className="me-3"
        />
        <div className="flex-grow-1">
          <Card.Title>{item.name}</Card.Title>
          <Card.Text>₹{item.price}</Card.Text>
        </div>
        
        <div className="quantity-controls d-flex align-items-center me-3">
          <Button
            variant="outline-primary"
            className="btn-quantity"
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
          >
            -
          </Button>
          <Form.Control
            value={item.quantity}
            onChange={handleQuantityChange}
            className="text-center quantity-display"
            min="1"
          />
          <Button
            variant="outline-primary"
            className="btn-quantity"
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
          >
            +
          </Button>
        </div>
        
        <Button
          variant="outline-danger"
          className="rounded-circle p-2"
          style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => removeFromCart(item._id)}
        >
          ✕
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CartItem; 