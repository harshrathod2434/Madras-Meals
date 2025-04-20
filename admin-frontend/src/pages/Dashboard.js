import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Dashboard card data
  const dashboardCards = [
    {
      id: 1,
      title: 'View & Edit Menu Items',
      description: 'Browse and modify existing menu items',
      icon: 'bi-menu-button-wide',
      color: '#4e73df',
      link: '/menu',
      onClick: () => navigate('/menu')
    },
    {
      id: 2,
      title: 'Add Menu Items',
      description: 'Add new dishes manually or upload a CSV file',
      icon: 'bi-plus-circle',
      color: '#1cc88a',
      link: '/menu/add',
      onClick: () => navigate('/menu/add')
    },
    {
      id: 3,
      title: 'View & Edit Orders',
      description: 'Manage customer orders and update status',
      icon: 'bi-cart3',
      color: '#f6c23e',
      link: '/orders',
      onClick: () => navigate('/orders')
    },
    {
      id: 4,
      title: 'Manage Admin Access',
      description: 'Add or remove admin users and assign roles',
      icon: 'bi-people',
      color: '#e74a3b',
      link: '/admin-access',
      onClick: () => navigate('/admin-access')
    },
    {
      id: 5,
      title: 'Customer Profiles',
      description: 'View customer details and order history',
      icon: 'bi-person-lines-fill',
      color: '#36b9cc',
      link: '/customers',
      onClick: () => navigate('/customers')
    },
    {
      id: 6,
      title: 'Analytics & Reports',
      description: 'Visualize order trends and revenue growth',
      icon: 'bi-bar-chart-line',
      color: '#6f42c1',
      link: '/analytics',
      onClick: () => navigate('/analytics')
    }
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-4">
      {/* Welcome Message */}
      <div className="welcome-section text-center mb-4">
        <h1 className="display-4">Welcome, {user.name}</h1>
        <p className="lead text-muted">Manage your restaurant operations efficiently</p>
      </div>

      {/* Dashboard Cards Grid */}
      <Row className="g-4">
        {dashboardCards.map(card => (
          <Col key={card.id} md={6} lg={4}>
            <Card 
              className="dashboard-card h-100 shadow-sm" 
              onClick={card.onClick} 
              style={{ cursor: 'pointer' }}
            >
              <Card.Body className="text-center">
                <div className="icon-circle" style={{ backgroundColor: card.color }}>
                  <i className={`bi ${card.icon} fs-4`}></i>
                </div>
                <Card.Title className="mt-3 mb-2 fw-bold">{card.title}</Card.Title>
                <Card.Text className="text-muted">{card.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Dashboard; 