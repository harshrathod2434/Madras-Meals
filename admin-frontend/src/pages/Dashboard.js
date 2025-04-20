import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService, menuService } from '../services/api';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [ordersResponse, menuResponse] = await Promise.all([
          orderService.getAllOrders(),
          menuService.getAllMenuItems()
        ]);
        setOrders(ordersResponse.data);
        setMenuItems(menuResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
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

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <h1>Loading...</h1>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Recent Orders</h4>
            </Card.Header>
            <Card.Body>
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6)}</td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>₹{order.totalPrice}</td>
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
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Menu Items</h4>
            </Card.Header>
            <Card.Body>
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.slice(0, 5).map(item => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>₹{item.price}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="primary"
                          className="me-2"
                          onClick={() => navigate(`/menu/edit/${item._id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => navigate(`/menu/delete/${item._id}`)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="text-center">
        <Button
          variant="primary"
          className="me-2"
          onClick={() => navigate('/orders')}
        >
          View All Orders
        </Button>
        <Button
          variant="success"
          onClick={() => navigate('/menu/new')}
        >
          Add New Menu Item
        </Button>
      </div>
    </Container>
  );
};

export default Dashboard; 