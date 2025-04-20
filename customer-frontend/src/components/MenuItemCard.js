import React from 'react';
import { Card, Button, InputGroup, Form } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import '../styles/menuCard.css'; // We'll create this CSS file

const MenuItemCard = ({ item }) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  
  // Check if item is already in cart
  const cartItem = cart.find(cartItem => cartItem._id === item._id);
  const isInCart = !!cartItem;

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
      <Card.Body className="d-flex flex-column p-4" style={{ 
        background: 'linear-gradient(to bottom, var(--dark-green-card), var(--dark-green-card) 80%, var(--dark-green-accent))'
      }}>
        <Card.Title className="card-title-animation fw-bold text-white">{item.name}</Card.Title>
        <Card.Text className="text-white">{item.description}</Card.Text>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="h5 mb-0 fw-bold text-white">₹{item.price}</span>
          
          {!isInCart ? (
            <Button
              variant="primary"
              onClick={() => addToCart(item)}
              className="btn-animation"
              style={{ borderRadius: '4px' }}
            >
              Add to Cart
            </Button>
          ) : (
            <div className="quantity-controls d-flex align-items-center">
              <Button
                variant="outline-primary"
                className="btn-quantity"
                onClick={() => updateQuantity(item._id, cartItem.quantity - 1)}
              >
                -
              </Button>
              <Form.Control
                readOnly
                value={cartItem.quantity}
                className="text-center quantity-display"
              />
              <Button
                variant="outline-primary"
                className="btn-quantity"
                onClick={() => updateQuantity(item._id, cartItem.quantity + 1)}
              >
                +
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default MenuItemCard; 