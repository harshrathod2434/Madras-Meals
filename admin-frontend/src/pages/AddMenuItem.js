import React, { useState } from 'react';
import { Container, Form, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { menuService } from '../services/api';
import CSVImport from '../components/CSVImport';
import BackButton from '../components/BackButton';

const AddMenuItem = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('single');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setImage(null);
    // Reset file input by recreating it
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      if (image) {
        formData.append('image', image);
      }

      const response = await menuService.createMenuItem(formData);
      setSuccess(`Menu item "${response.data.name}" was successfully created!`);
      resetForm();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleCsvImportSuccess = (items) => {
    setSuccess(`Successfully imported ${items.length} menu items!`);
    setActiveTab('single');
  };

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <BackButton to="/dashboard" label="Back to Dashboard" />
      <h1 className="mb-4">Add Menu Items</h1>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
        className="mb-4"
        fill
      >
        <Tab eventKey="single" title="Add Single Item">
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter item name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter item description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              <Form.Text className="text-muted">
                Recommended size: 800x600 pixels; File type: JPG 
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Menu Item'}
              </Button>
            </div>
          </Form>
        </Tab>
        <Tab eventKey="bulk" title="Bulk Import (CSV)">
          <CSVImport onImportSuccess={handleCsvImportSuccess} />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AddMenuItem; 