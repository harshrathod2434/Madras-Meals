import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Card, Badge, Form, InputGroup, Alert, Modal, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import api, { customerService } from '../services/api';
import Loading from '../components/Loading';
import ErrorAlert from '../components/ErrorAlert';
import BackButton from '../components/BackButton';
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaSync, FaShoppingBag, FaInfoCircle, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    new30Days: 0
  });
  
  // Customer orders modal state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  // State for customer details modal
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if admin token exists
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('You are not logged in. Please log in as an admin to view customer data.');
        setLoading(false);
        return;
      }
      
      console.log('Fetching customers with token:', token ? 'Present' : 'Missing');
      
      const response = await customerService.getAllCustomers();
      console.log('Customer data received:', response.data);
      
      // Process customer data to ensure all fields are properly set
      const processedCustomers = response.data.map(customer => ({
        ...customer,
        // Use phoneNumber field if available, fallback to phone field, or null
        phone: customer.phoneNumber || customer.phone || null,
        // Ensure deliveryAddress is set
        deliveryAddress: customer.deliveryAddress || null,
        // Ensure orderCount is a number
        orderCount: typeof customer.orderCount === 'number' ? customer.orderCount : 0
      }));
      
      setCustomers(processedCustomers);
      
      // Calculate stats
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      
      const activeCustomers = processedCustomers.filter(customer => 
        customer.orderCount > 0
      );
      
      const newCustomers = processedCustomers.filter(customer => 
        new Date(customer.createdAt) >= thirtyDaysAgo
      );
      
      setStats({
        total: processedCustomers.length,
        active: activeCustomers.length,
        new30Days: newCustomers.length
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.response?.data?.error || err.message || 'Error fetching customers');
      setLoading(false);
      
      // If token error, might need to redirect to login
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
      }
    }
  };

  // Fetch customer orders
  const fetchCustomerOrders = async (customerId, customerName) => {
    try {
      setLoadingOrders(true);
      setOrderError(null);
      setSelectedCustomer({ id: customerId, name: customerName });
      setShowOrdersModal(true);
      
      console.log(`Fetching orders for customer: ${customerName} (${customerId})`);
      const response = await customerService.getCustomerOrders(customerId);
      console.log('Customer orders received:', response.data);
      
      setCustomerOrders(response.data);
      setLoadingOrders(false);
    } catch (err) {
      console.error('Error fetching customer orders:', err);
      setOrderError(err.response?.data?.error || err.message || 'Error fetching customer orders');
      setLoadingOrders(false);
    }
  };

  // Handle closing the orders modal
  const handleCloseOrdersModal = () => {
    setShowOrdersModal(false);
    setSelectedCustomer(null);
    setCustomerOrders([]);
    setOrderError(null);
  };

  // Show customer details modal
  const handleViewCustomerDetails = (customer) => {
    setSelectedCustomerDetails(customer);
    setShowCustomerModal(true);
  };

  // Hide customer details modal
  const handleCloseCustomerModal = () => {
    setShowCustomerModal(false);
    setSelectedCustomerDetails(null);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle specific fields
    if (sortField === 'orderCount') {
      aValue = a.orderCount || 0;
      bValue = b.orderCount || 0;
    } else if (sortField === 'createdAt') {
      aValue = new Date(a.createdAt);
      bValue = new Date(b.createdAt);
    } else if (sortField === 'deliveryAddress') {
      aValue = a.deliveryAddress || '';
      bValue = b.deliveryAddress || '';
    } else if (sortField === '_id') {
      // For ID sorting, use string comparison
      aValue = String(a._id || '');
      bValue = String(b._id || '');
    } else if (sortField === 'phone' || sortField === 'phoneNumber') {
      // For phone sorting, try both fields
      aValue = a.phoneNumber || a.phone || '';
      bValue = b.phoneNumber || b.phone || '';
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredCustomers = sortedCustomers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      (customer.phone && String(customer.phone).toLowerCase().includes(searchLower)) ||
      (customer.phoneNumber && String(customer.phoneNumber).toLowerCase().includes(searchLower)) ||
      (customer.deliveryAddress && customer.deliveryAddress.toLowerCase().includes(searchLower)) ||
      (customer._id && customer._id.toLowerCase().includes(searchLower))
    );
  });

  // Format phone number for display
  const formatPhoneNumber = (phoneNumber) => {
    // Get phone from either phone or phoneNumber field
    const phone = phoneNumber;
    
    if (!phone || phone === 'N/A' || phone === 'null') return 'N/A';
    
    // Basic formatting for phone numbers, can be customized
    try {
      // Remove any non-digit characters
      const cleaned = phone.replace(/\D/g, '');
      
      // Format based on length
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
        // Handle leading zero for some international formats, taking the last 10 digits
        return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
      }
      
      // Return as is if we can't format
      return phone;
    } catch (e) {
      return phone || 'N/A';
    }
  };

  // Format address for display in table
  const formatAddress = (address) => {
    if (!address) return 'N/A';
    
    // For display in the table, truncate more aggressively
    if (address.length > 20) {
      return address.substring(0, 20) + '...';
    }
    return address;
  };

  // Format ID for display
  const formatId = (id) => {
    if (!id) return 'N/A';
    // Display the last 6 characters of the MongoDB ID
    return id.substring(id.length - 6);
  };

  if (loading) return <Loading />;
  
  return (
    <Container className="py-4">
      <BackButton />
      <h1 className="mb-4">Customer Management</h1>

      {error && (
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={fetchCustomers}>
              <FaSync className="me-2" /> Try Again
            </Button>
          </div>
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center mb-3">
            <Card.Body>
              <Card.Title>Total Customers</Card.Title>
              <h2>{stats.total}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center mb-3">
            <Card.Body>
              <Card.Title>Active Customers</Card.Title>
              <h2>{stats.active}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center mb-3">
            <Card.Body>
              <Card.Title>New Customers (30 days)</Card.Title>
              <h2>{stats.new30Days}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Customer List</Card.Title>
          
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th onClick={() => handleSort('_id')} style={{ cursor: 'pointer' }}>
                    ID {getSortIcon('_id')}
                  </th>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                    Name {getSortIcon('name')}
                  </th>
                  <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                    Email {getSortIcon('email')}
                  </th>
                  <th onClick={() => handleSort('phone')} style={{ cursor: 'pointer' }}>
                    Phone {getSortIcon('phone')}
                  </th>
                  <th onClick={() => handleSort('deliveryAddress')} style={{ cursor: 'pointer' }}>
                    Address {getSortIcon('deliveryAddress')}
                  </th>
                  <th onClick={() => handleSort('orderCount')} style={{ cursor: 'pointer' }}>
                    Orders {getSortIcon('orderCount')}
                  </th>
                  <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                    Registered {getSortIcon('createdAt')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">No customers found</td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer._id}>
                      <td>
                        <small className="text-muted">#{formatId(customer._id)}</small>
                      </td>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{formatPhoneNumber(customer.phoneNumber || customer.phone)}</td>
                      <td>
                        {customer.deliveryAddress ? (
                          <OverlayTrigger
                            placement="auto"
                            overlay={
                              <Tooltip id={`address-tooltip-${customer._id}`} style={{ maxWidth: '300px' }}>
                                <div style={{ textAlign: 'left', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                  <strong>Full Address:</strong><br />
                                  {customer.deliveryAddress}
                                </div>
                              </Tooltip>
                            }
                          >
                            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                              {formatAddress(customer.deliveryAddress)}
                              <FaInfoCircle size={12} className="ms-1 text-primary" />
                            </div>
                          </OverlayTrigger>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        <Badge bg={customer.orderCount > 0 ? "success" : "secondary"}>
                          {customer.orderCount || 0}
                        </Badge>
                      </td>
                      <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button 
                          size="sm" 
                          variant="outline-info" 
                          className="me-1"
                          onClick={() => handleViewCustomerDetails(customer)}
                          title="View Details"
                        >
                          <FaUser />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline-primary" 
                          className="me-1"
                          onClick={() => fetchCustomerOrders(customer._id, customer.name)}
                          title="View Orders"
                        >
                          <FaShoppingBag />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Customer Details Modal */}
      <Modal
        show={showCustomerModal}
        onHide={handleCloseCustomerModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUser className="me-2" /> Customer Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomerDetails && (
            <Card>
              <Card.Body>
                <div className="mb-3">
                  <h5 className="mb-3 border-bottom pb-2">{selectedCustomerDetails.name}</h5>
                  
                  <div className="d-flex mb-2">
                    <div style={{ width: '30px' }}><FaIdCard className="text-secondary" /></div>
                    <div>
                      <strong>Customer ID:</strong><br />
                      <span className="text-muted">{selectedCustomerDetails._id}</span>
                    </div>
                  </div>
                  
                  <div className="d-flex mb-2">
                    <div style={{ width: '30px' }}><FaEnvelope className="text-secondary" /></div>
                    <div>
                      <strong>Email:</strong><br />
                      <span className="text-muted">{selectedCustomerDetails.email}</span>
                    </div>
                  </div>
                  
                  <div className="d-flex mb-2">
                    <div style={{ width: '30px' }}><FaPhone className="text-secondary" /></div>
                    <div>
                      <strong>Phone:</strong><br />
                      <span className="text-muted">
                        {formatPhoneNumber(selectedCustomerDetails.phoneNumber || selectedCustomerDetails.phone) || 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="d-flex mb-2">
                    <div style={{ width: '30px' }}><FaMapMarkerAlt className="text-secondary" /></div>
                    <div>
                      <strong>Delivery Address:</strong><br />
                      <div className="text-muted" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {selectedCustomerDetails.deliveryAddress || 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex mb-2">
                    <div style={{ width: '30px' }}><FaShoppingBag className="text-secondary" /></div>
                    <div>
                      <strong>Orders:</strong><br />
                      <Badge bg={selectedCustomerDetails.orderCount > 0 ? "success" : "secondary"}>
                        {selectedCustomerDetails.orderCount || 0} orders
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="d-flex">
                    <div style={{ width: '30px' }}><FaInfoCircle className="text-secondary" /></div>
                    <div>
                      <strong>Registered:</strong><br />
                      <span className="text-muted">
                        {new Date(selectedCustomerDetails.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleCloseCustomerModal();
                      fetchCustomerOrders(selectedCustomerDetails._id, selectedCustomerDetails.name);
                    }}
                  >
                    <FaShoppingBag className="me-2" /> View Orders
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
      </Modal>

      {/* Customer Orders Modal */}
      <Modal 
        show={showOrdersModal} 
        onHide={handleCloseOrdersModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaShoppingBag className="me-2" />
            Orders for {selectedCustomer?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingOrders ? (
            <Loading />
          ) : orderError ? (
            <Alert variant="danger">
              <Alert.Heading>Error</Alert.Heading>
              <p>{orderError}</p>
            </Alert>
          ) : customerOrders.length === 0 ? (
            <Alert variant="info">This customer has no orders.</Alert>
          ) : (
            <ListGroup variant="flush">
              {customerOrders.map(order => (
                <ListGroup.Item key={order._id} className="mb-3 border rounded p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">Order #{order._id.slice(-6)}</h5>
                    <Badge bg={getBadgeColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-muted mb-2">
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="fw-bold mb-2">Total: ${order.totalAmount?.toFixed(2) || '0.00'}</p>
                  
                  <h6 className="mt-3 mb-2">Order Items:</h6>
                  <ListGroup variant="flush">
                    {order.items?.map((item, idx) => (
                      <ListGroup.Item key={idx} className="px-0 py-2 border-0 border-bottom">
                        <div className="d-flex justify-content-between">
                          <div>
                            <span className="fw-bold">{item.menuItem?.name || 'Unknown Item'}</span>
                            <span className="text-muted ms-2">x{item.quantity}</span>
                          </div>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseOrdersModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

// Helper function to get badge color based on order status
const getBadgeColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending': return 'warning';
    case 'processing': return 'info';
    case 'completed': return 'success';
    case 'cancelled': return 'danger';
    default: return 'secondary';
  }
};

export default CustomerManagement; 