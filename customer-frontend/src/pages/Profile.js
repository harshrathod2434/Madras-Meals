import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col, InputGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  
  // Extract country code and phone number from user data
  const extractPhoneDetails = (fullPhoneNumber) => {
    if (!fullPhoneNumber) return { countryCode: '+91', phoneNumber: '' };
    
    // Check if the number already has a country code format (e.g., +91...)
    if (fullPhoneNumber.startsWith('+')) {
      // Find the first digit after the + and country code
      const countryCodeEndIndex = fullPhoneNumber.search(/\d(?!\+)/);
      if (countryCodeEndIndex > 1) {
        return {
          countryCode: fullPhoneNumber.substring(0, countryCodeEndIndex),
          phoneNumber: fullPhoneNumber.substring(countryCodeEndIndex)
        };
      }
    }
    
    // If the number starts with 0, it likely has no country code
    if (fullPhoneNumber.startsWith('0')) {
      return { countryCode: '+91', phoneNumber: fullPhoneNumber.substring(1) };
    }
    
    // Default handling - assume Indian number without explicit country code
    return { countryCode: '+91', phoneNumber: fullPhoneNumber };
  };
  
  const { countryCode: initialCountryCode, phoneNumber: initialPhoneNumber } = 
    extractPhoneDetails(user?.phoneNumber);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    deliveryAddress: user?.deliveryAddress || '',
    countryCode: initialCountryCode,
    phoneNumber: initialPhoneNumber
  });
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user) {
      const { countryCode, phoneNumber } = extractPhoneDetails(user.phoneNumber);
      
      setFormData({
        name: user.name || '',
        email: user.email || '',
        deliveryAddress: user.deliveryAddress || '',
        countryCode,
        phoneNumber
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validate phone number
    const phoneNumberRegex = /^\d{10}$/;
    if (!phoneNumberRegex.test(formData.phoneNumber)) {
      setMessage({ 
        type: 'danger', 
        text: 'Phone number should be exactly 10 digits without spaces or special characters' 
      });
      setLoading(false);
      return;
    }

    try {
      // Combine country code and phone number
      const fullPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`;
      
      const result = await updateUser({
        deliveryAddress: formData.deliveryAddress,
        phoneNumber: fullPhoneNumber
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
      const { countryCode, phoneNumber } = extractPhoneDetails(user?.phoneNumber);
      
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        deliveryAddress: user?.deliveryAddress || '',
        countryCode,
        phoneNumber
      });
    }
    setEditMode(!editMode);
    setMessage({ type: '', text: '' });
  };

  // Common country codes for the dropdown
  const countryCodes = [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'USA/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'Australia' },
    { code: '+971', country: 'UAE' },
    { code: '+65', country: 'Singapore' },
    { code: '+60', country: 'Malaysia' }
  ];

  return (
    <Container className="py-5">
      {message.text && (
        <Alert variant={message.type} className="mb-4">
          {message.text}
        </Alert>
      )}
      <div style={{ 
        border: '1px solid var(--dark-green-border)', 
        borderRadius: '12px', 
        padding: '30px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        backgroundColor: 'var(--dark-green-card)',
        marginBottom: '20px'
      }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0 text-white">My Profile</h2>
          <Button 
            variant={editMode ? "secondary" : "primary"}
            onClick={toggleEditMode}
            style={{
              backgroundColor: editMode ? '#6c757d' : 'var(--dark-green-highlight)',
              borderColor: editMode ? '#6c757d' : 'var(--dark-green-highlight)'
            }}
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="text-white">Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.name}
              disabled
              className="bg-dark text-white border-dark"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-white">Email</Form.Label>
            <Form.Control
              type="email"
              value={formData.email}
              disabled
              className="bg-dark text-white border-dark"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-white">Delivery Address</Form.Label>
            <Form.Control
              type="text"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              placeholder="Enter your delivery address"
              disabled={!editMode}
              required
              className={!editMode ? "bg-dark text-white border-dark" : ""}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-white">Phone Number</Form.Label>
            <Row>
              <Col xs={4} md={3}>
                <Form.Select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  disabled={!editMode}
                  required
                  className={!editMode ? "bg-dark text-white border-dark" : ""}
                >
                  {countryCodes.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.code} ({country.country})
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs={8} md={9}>
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone number"
                  disabled={!editMode}
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                  className={!editMode ? "bg-dark text-white border-dark" : ""}
                />
                {editMode && (
                  <Form.Text className="text-white">
                    Enter a 10-digit number without spaces, dashes or country code
                  </Form.Text>
                )}
              </Col>
            </Row>
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
            style={{
              backgroundColor: 'var(--dark-green-highlight)',
              borderColor: 'var(--dark-green-highlight)'
            }}
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Profile; 