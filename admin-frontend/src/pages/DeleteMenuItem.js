import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { menuService } from '../services/api';
import BackButton from '../components/BackButton';

const DeleteMenuItem = () => {
  const [menuItem, setMenuItem] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await menuService.getMenuItem(id);
        setMenuItem(response.data);
      } catch (error) {
        setError('Failed to fetch menu item');
      }
    };

    fetchMenuItem();
  }, [id]);

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    try {
      await menuService.deleteMenuItem(id);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete menu item');
      setLoading(false);
    }
  };

  if (!menuItem) {
    return (
      <Container className="py-4 text-center">
        <h1>Loading...</h1>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: '600px' }}>
      <BackButton to="/menu" label="Back to Menu" />
      <h1 className="mb-4">Delete Menu Item</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card>
        <Card.Body>
          <div className="text-center mb-3">
            <img
              src={menuItem.image}
              alt={menuItem.name}
              style={{ maxWidth: '200px', maxHeight: '200px' }}
              className="mb-3"
            />
          </div>
          
          <h4 className="text-center mb-3">{menuItem.name}</h4>
          <p className="text-center mb-3">{menuItem.description}</p>
          <p className="text-center h5 mb-4">₹{menuItem.price}</p>
          
          <Alert variant="danger" className="text-center">
            Are you sure you want to delete this menu item? This action cannot be undone.
          </Alert>
          
          <div className="d-flex justify-content-between">
            <Button
              variant="secondary"
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Menu Item'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DeleteMenuItem; 