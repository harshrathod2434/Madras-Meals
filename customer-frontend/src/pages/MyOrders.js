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
        <div className="text-center">
          <h2 className="fw-bold" style={{ 
            borderBottom: '3px solid var(--dark-green-highlight)',
            paddingBottom: '10px',
            display: 'inline-block'
          }}>
            My Orders
          </h2>
          <p className="text-white">Loading your order history...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ 
            borderBottom: '3px solid var(--dark-green-highlight)',
            paddingBottom: '10px',
            display: 'inline-block'
          }}>
            My Orders
          </h2>
        </div>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h2 className="fw-bold" style={{ 
            borderBottom: '3px solid var(--dark-green-highlight)',
            paddingBottom: '10px',
            display: 'inline-block'
          }}>
            My Orders
          </h2>
          <p className="text-white">You haven't placed any orders yet</p>
          <p className="mt-3 text-white">Your order history will appear here once you place an order</p>
        </div>
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
          My Orders
        </h2>
        <p className="text-white">Your order history and status updates</p>
      </div>
      
      <div style={{
        border: `1px solid var(--dark-green-border)`,
        borderRadius: '12px',
        padding: '30px',
        marginBottom: '30px',
        backgroundColor: 'var(--dark-green-card)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        {orders.map(order => (
          <Card key={order._id} className="mb-4 border shadow-sm" style={{ backgroundColor: 'var(--dark-green-secondary)', color: 'white' }}>
            <Card.Header className="d-flex justify-content-between align-items-center py-3" style={{ backgroundColor: 'var(--dark-green-accent)', borderBottom: `1px solid var(--dark-green-border)` }}>
              <span className="fw-bold text-white">Order #{order._id.slice(-6)}</span>
              <Badge bg={getStatusBadgeVariant(order.status)} className="py-2 px-3">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <h5 className="mb-3 fw-bold text-white">Items:</h5>
                  {order.items.map(item => (
                    <div key={item._id} className="d-flex justify-content-between mb-2">
                      <span className="text-white">
                        {item.quantity}x {item.menuItem ? item.menuItem.name : 'Unknown Item'}
                      </span>
                      <span className="text-white">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-top pt-2 mt-2" style={{ borderColor: 'var(--dark-green-border)' }}>
                    <strong className="text-white">Total: ₹{order.totalAmount}</strong>
                  </div>
                </Col>
                <Col md={4}>
                  <h5 className="mb-3 fw-bold text-white">Delivery Details:</h5>
                  <p className="mb-2 text-white">
                    <strong>Address:</strong><br />
                    {order.deliveryAddress}
                  </p>
                  <p className="mb-0 text-white">
                    <strong>Phone:</strong><br />
                    {order.phoneNumber}
                  </p>
                </Col>
              </Row>
              <div className="mt-3 text-white opacity-75">
                <small>Ordered on: {new Date(order.createdAt).toLocaleString()}</small>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default MyOrders; 