import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    startDate: '',
    endDate: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      setError('Failed to update order status');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      preparing: 'info',
      ready: 'primary',
      delivered: 'success',
      cancelled: 'danger'
    };

    return (
      <Badge bg={variants[status] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredOrders = orders
    .filter(order => {
      if (filters.status !== 'all' && order.status !== filters.status) {
        return false;
      }
      if (filters.startDate) {
        const orderDate = new Date(order.createdAt);
        const startDate = new Date(filters.startDate);
        if (orderDate < startDate) return false;
      }
      if (filters.endDate) {
        const orderDate = new Date(order.createdAt);
        const endDate = new Date(filters.endDate);
        if (orderDate > endDate) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'date') {
        return filters.sortOrder === 'asc'
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      } else if (filters.sortBy === 'price') {
        return filters.sortOrder === 'asc'
          ? a.totalPrice - b.totalPrice
          : b.totalPrice - a.totalPrice;
      }
      return 0;
    });

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <h1>Loading...</h1>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Orders</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group>
                <Form.Label>Sort By</Form.Label>
                <Form.Select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                >
                  <option value="date">Date</option>
                  <option value="price">Price</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mt-3">
            <Col>
              <Form.Group>
                <Form.Label>Sort Order</Form.Label>
                <Form.Select
                  name="sortOrder"
                  value={filters.sortOrder}
                  onChange={handleFilterChange}
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order._id}>
              <td>#{order._id.slice(-6)}</td>
              <td>{order.user.name}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>
                {order.items.map(item => (
                  <div key={item._id}>
                    {item.menuItem.name} x {item.quantity}
                  </div>
                ))}
              </td>
              <td>₹{order.totalPrice}</td>
              <td>{getStatusBadge(order.status)}</td>
              <td>
                {order.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleStatusUpdate(order._id, 'preparing')}
                  >
                    Start Preparing
                  </Button>
                )}
                {order.status === 'preparing' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleStatusUpdate(order._id, 'ready')}
                  >
                    Mark Ready
                  </Button>
                )}
                {order.status === 'ready' && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleStatusUpdate(order._id, 'delivered')}
                  >
                    Mark Delivered
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Orders; 