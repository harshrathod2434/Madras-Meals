import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    deliveryAddress: user?.deliveryAddress || '',
    phoneNumber: user?.phoneNumber || ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        deliveryAddress: user.deliveryAddress || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await updateUser({
        deliveryAddress: formData.deliveryAddress,
        phoneNumber: formData.phoneNumber
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setEditMode(false);
      } else {
        setMessage({ type: 'danger', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'An error occurred. Please try again.' });
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleEditMode = () => {
    if (editMode) {
      // If leaving edit mode without saving, reset the form
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        deliveryAddress: user?.deliveryAddress || '',
        phoneNumber: user?.phoneNumber || ''
      });
    }
    setEditMode(!editMode);
    setMessage({ type: '', text: '' });
  };

  return (
    <Container className="py-5">
      {message.text && (
        <Alert variant={message.type} className="mb-4">
          {message.text}
        </Alert>
      )}
      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '25px', 
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        marginBottom: '20px'
      }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">My Profile</h2>
          <Button 
            variant={editMode ? "secondary" : "primary"}
            onClick={toggleEditMode}
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.name}
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={formData.email}
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Delivery Address</Form.Label>
            <Form.Control
              type="text"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              placeholder="Enter your delivery address"
              disabled={!editMode}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              disabled={!editMode}
              required
            />
          </Form.Group>
        </Form>
      </div>

      {editMode && (
        <div className="d-grid">
          <Button 
            variant="success" 
            size="lg" 
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Profile; 