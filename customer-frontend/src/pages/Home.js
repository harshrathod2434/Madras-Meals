import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { menuService } from '../services/api';
import MenuItemCard from '../components/MenuItemCard';

const Home = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await menuService.getAllMenuItems();
        // Filter to keep only Pongal, Upma, and Medu Vada
        const filteredItems = response.data.filter(item => 
          ['Pongal', 'Upma', 'Medu Vada'].includes(item.name)
        );
        setMenuItems(filteredItems);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <div>
      <div
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/banner.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
          marginBottom: '2rem'
        }}
      >
      </div>

      <Container>
        <h2 className="mb-4">Featured Items</h2>
        <Row xs={1} md={2} lg={3} className="g-4">
          {menuItems.map((item) => (
            <Col key={item._id}>
              <MenuItemCard item={item} />
            </Col>
          ))}
        </Row>

        {/* About Us Section */}
        <section className="my-5 py-5">
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '30px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            backgroundColor: '#f9f9f9'
          }}>
            <h2 className="text-center mb-4">About Us</h2>
            <Row className="align-items-center">
              <Col md={6}>
                <p className="lead">
                  Welcome to MadrasMeals, where we bring the authentic flavors of South India to your table. 
                  Our journey began with a simple mission: to share the rich culinary heritage of South India 
                  with food enthusiasts around the world.
                </p>
                <p>
                  Our chefs, trained in traditional South Indian cooking techniques, prepare each dish with 
                  the finest ingredients and utmost care. From the crispy Medu Vada to the comforting Pongal, 
                  every item on our menu tells a story of tradition and taste.
                </p>
                <p>
                  We believe in sustainable practices and source our ingredients locally whenever possible. 
                  Our commitment to quality and authenticity has made us a favorite among food lovers who 
                  appreciate genuine South Indian cuisine.
                </p>
              </Col>
              <Col md={6}>
                <img 
                  src="https://res.cloudinary.com/dyzvzef89/image/upload/v1744968419/madras-meals/about.jpg" 
                  alt="About MadrasMeals" 
                  className="img-fluid rounded"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
              </Col>
            </Row>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default Home; 