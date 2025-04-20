import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/api';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    
    fetchAdmins();
  }, [user, navigate]);
  
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      console.log('Fetching admin users...');
      const response = await adminService.getAllAdmins();
      console.log('Admin users received:', response.data);
      setAdmins(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching admins:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        setError(`Failed to fetch admin users: ${error.response.data.error || error.response.statusText}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        setError('Failed to fetch admin users: No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        setError(`Failed to fetch admin users: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = () => {
    if (!newAdmin.name.trim()) {
      setError('Name is required');
      return false;
    }
    
    if (!newAdmin.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!newAdmin.password) {
      setError('Password is required');
      return false;
    }
    
    if (newAdmin.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    if (newAdmin.password !== newAdmin.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };
  
  const handleCreateAdmin = async () => {
    try {
      if (!validateForm()) {
        return;
      }
      
      const { confirmPassword, ...adminData } = newAdmin;
      
      console.log('Creating new admin:', adminData.name, adminData.email);
      const response = await adminService.createAdmin(adminData);
      console.log('Admin created successfully:', response.data);
      
      setAdmins([...admins, response.data]);
      setSuccessMessage(`Admin user "${response.data.name}" created successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Reset form and close modal
      setNewAdmin({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setShowCreateModal(false);
      setError('');
    } catch (error) {
      console.error('Error creating admin:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        setError(`Failed to create admin: ${error.response.data.error || error.response.statusText}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        setError('Failed to create admin: No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        setError(`Failed to create admin: ${error.message}`);
      }
    }
  };
  
  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
    setShowDeleteModal(true);
  };
  
  const handleDeleteAdmin = async () => {
    try {
      console.log('Deleting admin:', adminToDelete._id, adminToDelete.name);
      await adminService.deleteAdmin(adminToDelete._id);
      console.log('Admin deleted successfully');
      
      setAdmins(admins.filter(admin => admin._id !== adminToDelete._id));
      setSuccessMessage(`Admin user "${adminToDelete.name}" deleted successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Close modal
      setShowDeleteModal(false);
      setAdminToDelete(null);
    } catch (error) {
      console.error('Error deleting admin:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        setError(`Failed to delete admin: ${error.response.data.error || error.response.statusText}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        setError('Failed to delete admin: No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        setError(`Failed to delete admin: ${error.message}`);
      }
      
      // Still close the modal but keep the admin to delete
      setShowDeleteModal(false);
    }
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
      <h1 className="mb-4">Admin Management</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <i className="bi bi-person-plus-fill me-1"></i> Add New Admin
        </Button>
      </div>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin._id}>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{new Date(admin.createdAt).toLocaleString()}</td>
              <td>
                <Button 
                  variant="danger"
                  size="sm"
                  disabled={admin._id === user._id}
                  onClick={() => handleDeleteClick(admin)}
                >
                  <i className="bi bi-trash"></i> Delete
                </Button>
                {admin._id === user._id && (
                  <small className="ms-2 text-muted">
                    (This is your account)
                  </small>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      {/* Create Admin Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newAdmin.name}
                onChange={handleInputChange}
                placeholder="Enter name"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newAdmin.email}
                onChange={handleInputChange}
                placeholder="Enter email"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={newAdmin.password}
                onChange={handleInputChange}
                placeholder="Enter password"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={newAdmin.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateAdmin}>
            Create Admin
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the admin user "{adminToDelete?.name}"?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAdmin}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminManagement; 