import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { menuService } from '../services/api';
import MenuItemCard from '../components/MenuItemCard';

const Home = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Desktop carousel items
  const desktopCarouselItems = [
    {
      image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/banner.jpg",
      alt: "South Indian Food Banner"
    },
    {
      image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1745182911/Banner_1_fguumw.webp",
      alt: "South Indian Cuisine Banner"
    },
    {
      image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1745182911/Banner3_1_ejfcdh.webp",
      alt: "Traditional South Indian Food"
    }
  ];

  // Mobile carousel items
  const mobileCarouselItems = [
    {
      image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1745182917/1_hcckoq.png",
      alt: "South Indian Mobile Banner 1"
    },
    {
      image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1745182917/2_wdwzpt.png",
      alt: "South Indian Mobile Banner 2"
    },
    {
      image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1745182917/3_fecimh.png",
      alt: "South Indian Mobile Banner 3"
    }
  ];

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

    // Handle window resize for responsive design
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to get carousel items based on window width
  const getCarouselItems = () => {
    const items = windowWidth >= 768 ? desktopCarouselItems : mobileCarouselItems;
    
    return items.map((item, index) => (
      <Carousel.Item key={index}>
        <img
          className="d-block w-100"
          src={item.image}
          alt={item.alt}
          style={{
            height: windowWidth >= 768 ? '500px' : '400px',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      </Carousel.Item>
    ));
  };

  return (
    <>
      {/* Full Width Carousel Banner */}
      <Carousel 
        className="banner-carousel mt-4" 
        touch={true} 
        indicators={true} 
        interval={5000} 
        controls={true} 
      >
        {getCarouselItems()}
      </Carousel>

      {/* Remaining content in Container */}
      <Container className="py-5">
        {/* Featured Items Section with Border */}
        <div style={{
          border: `1px solid var(--dark-green-border)`,
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '40px',
          backgroundColor: 'var(--dark-green-secondary)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold" style={{ 
              borderBottom: '3px solid var(--dark-green-highlight)',
              paddingBottom: '10px',
              display: 'inline-block'
            }}>
              Featured Items
            </h2>
            <p className="text-white">Experience the authentic taste of South India</p>
          </div>
          
          <Row xs={1} md={2} lg={3} className="g-4">
            {menuItems.map((item) => (
              <Col key={item._id}>
                <MenuItemCard item={item} />
              </Col>
            ))}
          </Row>

          {/* Explore Menu Button */}
          <div className="text-center my-4 pt-3">
            <Button
              as={Link}
              to="/menu"
              variant="primary"
              size="lg"
              className="px-5 py-3 fw-bold"
              style={{
                borderRadius: '30px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                backgroundColor: 'var(--dark-green-highlight)',
                borderColor: 'var(--dark-green-highlight)'
              }}
            >
              Explore Full Menu
              <i className="bi bi-arrow-right-circle ms-2"></i>
            </Button>
          </div>
        </div>

        {/* About Us Section */}
        <section className="my-5 py-5">
          <div style={{ 
            border: `1px solid var(--dark-green-border)`, 
            borderRadius: '12px', 
            padding: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            background: 'linear-gradient(45deg, #234631 0%, #32664a 100%)'
          }}>
            <div className="text-center mb-4">
              <h2 className="fw-bold" style={{ 
                borderBottom: '3px solid var(--dark-green-highlight)',
                paddingBottom: '10px',
                display: 'inline-block',
                color: 'white'
              }}>
                About Us
              </h2>
              <p style={{ color: 'white', opacity: '1' }}>Our journey of bringing authentic South Indian cuisine</p>
            </div>
            <Row className="align-items-center">
              <Col md={6}>
                <p className="lead" style={{ color: 'white', opacity: '1' }}>
                  Welcome to MadrasMeals, where we bring the authentic flavors of South India to your table. 
                  Our journey began with a simple mission: to share the rich culinary heritage of South India 
                  with food enthusiasts around the world.
                </p>
                <p style={{ color: 'white', opacity: '1' }}>
                  Our chefs, trained in traditional South Indian cooking techniques, prepare each dish with 
                  the finest ingredients and utmost care. From the crispy Medu Vada to the comforting Pongal, 
                  every item on our menu tells a story of tradition and taste.
                </p>
                <p style={{ color: 'white', opacity: '1' }}>
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
                  style={{ 
                    maxHeight: '400px', 
                    objectFit: 'cover',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.3)'
                  }}
                />
              </Col>
            </Row>
          </div>
        </section>
      </Container>
    </>
  );
};

export default Home; 