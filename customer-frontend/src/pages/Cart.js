import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';

const Cart = () => {
  const { cart, clearCart, getTotalPrice } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useProfileDetails, setUseProfileDetails] = useState(true);
  const [deliveryDetails, setDeliveryDetails] = useState({
    deliveryAddress: '',
    phoneNumber: ''
  });

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare order details
      const orderDetails = {
        items: cart.map(item => ({
          menuItem: item._id,
          quantity: item.quantity
        }))
      };

      // Add delivery details based on user's choice
      if (useProfileDetails) {
        if (!user.deliveryAddress || !user.phoneNumber) {
          setError('Please update your profile with delivery details or enter them below');
          setLoading(false);
          return;
        }
      } else {
        if (!deliveryDetails.deliveryAddress || !deliveryDetails.phoneNumber) {
          setError('Please enter delivery details');
          setLoading(false);
          return;
        }
        orderDetails.deliveryAddress = deliveryDetails.deliveryAddress;
        orderDetails.phoneNumber = deliveryDetails.phoneNumber;
      }

      const response = await fetch('http://localhost:2000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderDetails)
      });

      const data = await response.json();

      if (response.ok) {
        clearCart();
        navigate('/my-orders');
      } else {
        setError(data.error || 'Failed to place order');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  const handleDeliveryDetailsChange = (e) => {
    setDeliveryDetails({
      ...deliveryDetails,
      [e.target.name]: e.target.value
    });
  };

  if (cart.length === 0) {
    return (
      <Container className="py-5 text-center">
        <div className="text-center">
          <h2 className="fw-bold" style={{ 
            borderBottom: '3px solid var(--dark-green-highlight)',
            paddingBottom: '10px',
            display: 'inline-block'
          }}>
            Your Cart
          </h2>
          <p className="text-white">Your cart is currently empty</p>
        </div>
        <p className="mt-4 text-white">Browse our menu to add some delicious items!</p>
        <Button 
          variant="primary" 
          onClick={() => navigate('/menu')}
          size="lg"
          className="px-4 py-2 mt-3"
          style={{
            borderRadius: '30px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            backgroundColor: 'var(--dark-green-highlight)',
            borderColor: 'var(--dark-green-highlight)'
          }}
        >
          View Menu
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold" style={{ 
          borderBottom: '3px solid var(--dark-green-highlight)',
          paddingBottom: '10px',
          display: 'inline-block'
        }}>
          Your Cart
        </h2>
        <p className="text-white">Review your order before checkout</p>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row>
        <Col md={8}>
          {cart.map(item => (
            <CartItem key={item._id} item={item} />
          ))}
        </Col>
        
        <Col md={4}>
          <div className="border rounded p-3" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h4 className="mb-3 fw-bold">Order Summary</h4>
            <p className="d-flex justify-content-between">
              <span>Total:</span>
              <strong>₹{getTotalPrice()}</strong>
            </p>

            {user && (
              <Form className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="useProfileDetails"
                  label="Use profile delivery details"
                  checked={useProfileDetails}
                  onChange={(e) => setUseProfileDetails(e.target.checked)}
                  className="mb-3"
                />

                {!useProfileDetails && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Delivery Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="deliveryAddress"
                        value={deliveryDetails.deliveryAddress}
                        onChange={handleDeliveryDetailsChange}
                        placeholder="Enter delivery address"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phoneNumber"
                        value={deliveryDetails.phoneNumber}
                        onChange={handleDeliveryDetailsChange}
                        placeholder="Enter phone number"
                        required
                      />
                    </Form.Group>
                  </>
                )}
              </Form>
            )}

            <Button
              variant="primary"
              onClick={handleCheckout}
              disabled={loading}
              className="w-100 py-2 fw-bold"
              style={{ borderRadius: '6px' }}
            >
              {loading ? 'Processing...' : 'Checkout'}
            </Button>

            {!user && (
              <p className="mt-2 text-center">
                Please <Button variant="link" onClick={() => navigate('/login')}>login</Button> to checkout
              </p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart; 