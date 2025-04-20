import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const MyOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:2000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        } else {
          setError(data.error || 'Failed to fetch orders');
        }
      } catch (error) {
        setError('An error occurred while fetching orders');
      }
      setLoading(false);
    };

    fetchOrders();
  }, [token]);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'preparing':
        return 'info';
      case 'ready':
        return 'success';
      case 'delivered':
        return 'primary';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <h2>Loading orders...</h2>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container className="py-5">
        <h2>No orders yet</h2>
        <p>Your order history will appear here</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">My Orders</h2>
      {orders.map(order => (
        <Card key={order._id} className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <span>Order #{order._id.slice(-6)}</span>
            <Badge bg={getStatusBadgeVariant(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={8}>
                <h5 className="mb-3">Items:</h5>
                {order.items.map(item => (
                  <div key={item._id} className="d-flex justify-content-between mb-2">
                    <span>
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-top pt-2 mt-2">
                  <strong>Total: ₹{order.totalAmount}</strong>
                </div>
              </Col>
              <Col md={4}>
                <h5 className="mb-3">Delivery Details:</h5>
                <p className="mb-2">
                  <strong>Address:</strong><br />
                  {order.deliveryAddress}
                </p>
                <p className="mb-0">
                  <strong>Phone:</strong><br />
                  {order.phoneNumber}
                </p>
              </Col>
            </Row>
            <div className="text-muted mt-3">
              <small>Ordered on: {new Date(order.createdAt).toLocaleString()}</small>
            </div>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default MyOrders; 