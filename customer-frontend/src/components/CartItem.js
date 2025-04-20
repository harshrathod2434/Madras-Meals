import React from 'react';
import { Card, Button, InputGroup, Form } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

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
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
          className="me-3"
        />
        <div className="flex-grow-1">
          <Card.Title>{item.name}</Card.Title>
          <Card.Text>₹{item.price}</Card.Text>
        </div>
        <InputGroup style={{ width: '150px' }}>
          <Button
            variant="outline-secondary"
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
          >
            -
          </Button>
          <Form.Control
            type="number"
            value={item.quantity}
            onChange={handleQuantityChange}
            min="1"
            className="text-center"
          />
          <Button
            variant="outline-secondary"
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
          >
            +
          </Button>
        </InputGroup>
        <Button
          variant="danger"
          className="ms-3"
          onClick={() => removeFromCart(item._id)}
        >
          <i className="fas fa-trash"></i>
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CartItem; 