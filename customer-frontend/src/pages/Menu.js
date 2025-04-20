import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { menuService } from '../services/api';
import MenuItemCard from '../components/MenuItemCard';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await menuService.getAllMenuItems();
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  const filteredItems = menuItems
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        return a.price - b.price;
      }
      return 0;
    });

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h2 className="display-4 fw-bold" style={{ 
          color: 'white', 
          borderBottom: '3px solid var(--dark-green-highlight)',
          paddingBottom: '10px',
          display: 'inline-block'
        }}>
          Our Menu
        </h2>
        <p className="text-white">Explore our delicious South Indian delicacies</p>
      </div>
      
      <div className="d-flex flex-column flex-md-row justify-content-between mb-4">
        <Form.Control
          type="search"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-3 mb-md-0"
          style={{ maxWidth: '300px' }}
        />
        
        <Form.Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </Form.Select>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredItems.map((item) => (
          <Col key={item._id}>
            <MenuItemCard item={item} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Menu; 