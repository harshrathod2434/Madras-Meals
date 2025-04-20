import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Modal, Form, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { menuService } from '../services/api';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState(null);
  const navigate = useNavigate();
  
  // Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: 0
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      console.log('Fetching menu items...');
      const response = await menuService.getAllMenuItems();
      console.log('Menu items received:', response.data);
      setMenuItems(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('Failed to load menu items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    console.log('Edit item:', item);
    setCurrentItem(item);
    setEditForm({
      name: item.name,
      description: item.description || '',
      price: item.price
    });
    setImagePreview(item.image || '');
    setShowEditModal(true);
    setUpdateSuccess(false);
    setModalError(null);
  };

  const handleDelete = (itemId) => {
    navigate(`/menu/delete/${itemId}`);
  };

  const handleAddNew = () => {
    navigate('/menu/add');
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setCurrentItem(null);
    setSelectedImage(null);
    setImagePreview('');
    setModalError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Image selected:', file.name, file.type, file.size);
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    
    if (!currentItem) {
      console.error('No current item set');
      return;
    }

    try {
      setUpdating(true);
      setModalError(null);
      
      // Create a formData object to send
      const formData = new FormData();
      
      // Add basic data
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      formData.append('price', editForm.price);
      
      // Add image if selected
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      // Keep isAvailable state
      if (currentItem.isAvailable !== undefined) {
        formData.append('isAvailable', currentItem.isAvailable.toString());
      }
      
      // Log form data for debugging
      console.log('Current item ID:', currentItem._id);
      console.log('Form data entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? `File: ${value.name}` : value}`);
      }
      
      // Update the menu item
      console.log('Sending update request...');
      const response = await menuService.updateMenuItem(currentItem._id, formData);
      console.log('Update response:', response);
      
      // Refresh the menu items list
      console.log('Refreshing menu items list');
      await fetchMenuItems();
      
      // Show success message
      console.log('Update successful');
      setUpdateSuccess(true);
      
      // Close modal after a delay
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
      
    } catch (err) {
      console.error('Error updating menu item:', err);
      console.error('Error details:', err.response?.data || err.message);
      setModalError(err.response?.data?.error || 'Failed to update menu item. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Menu Items</h1>
        <Button variant="success" onClick={handleAddNew}>
          <i className="bi bi-plus-circle me-1"></i> Add New Item
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : menuItems.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <h3>No menu items found</h3>
            <p className="text-muted">Add your first menu item to get started</p>
            <Button variant="primary" onClick={handleAddNew}>
              <i className="bi bi-plus-circle me-1"></i> Add Menu Item
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="me-2"
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        )}
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td>{item.description || 'No description available'}</td>
                    <td>₹{item.price}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(item)}
                      >
                        <i className="bi bi-pencil-square"></i> Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(item._id)}
                      >
                        <i className="bi bi-trash"></i> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Menu Item</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitEdit}>
          <Modal.Body>
            {updateSuccess && (
              <Alert variant="success" className="mb-3">
                Menu item updated successfully!
              </Alert>
            )}
            
            {modalError && (
              <Alert variant="danger" className="mb-3">
                {modalError}
              </Alert>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editForm.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={editForm.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              {imagePreview && (
                <div className="mb-2 text-center">
                  <Image 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ height: '100px', objectFit: 'cover' }} 
                    thumbnail
                  />
                </div>
              )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Form.Text className="text-muted">
                Select a new image to replace the existing one (optional)
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={updating}>
              {updating ? (
                <>
                  <Spinner size="sm" animation="border" className="me-1" /> 
                  Saving...
                </>
              ) : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default MenuPage; 