import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // Handle carousel image click
  const handleCarouselClick = () => {
    navigate('/schemes');
  };

  // Carousel data with responsive images
  const carouselItems = [
    {
      id: 1,
      mobileImage: '/images/carousel/mobile/1.jpg',
      webImage: '/images/carousel/web/1.jpg',
      title: '',
      description: ''
    },
    {
      id: 2,
      mobileImage: '/images/carousel/mobile/2.jpg',
      webImage: '/images/carousel/web/2.jpg',
      title: '',
      description: ''
    },
    {
      id: 3,
      mobileImage: '/images/carousel/mobile/3.jpg',
      webImage: '/images/carousel/web/3.jpg',
      title: '',
      description: ''
    },
    {
      id: 4,
      mobileImage: '/images/carousel/mobile/4.jpg',
      webImage: '/images/carousel/web/4.jpg',
      title: '',
      description: ''
    },
    {
      id: 5,
      mobileImage: '/images/carousel/mobile/5.jpg',
      webImage: '/images/carousel/web/5.jpg',
      title: '',
      description: ''
    }
  ];

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row>
            <Col>
              <h1 className="hero-title fade-in">
                Welcome to बिहार अधिकार
              </h1>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Carousel Section */}
      <Container className="my-5">
        <Row>
          <Col>
            <Carousel className="carousel-custom slide-in-right">
              {carouselItems.map(item => (
                <Carousel.Item key={item.id}>
                  {/* Clickable Image Container */}
                  <div 
                    onClick={handleCarouselClick}
                    style={{ 
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {/* Responsive Image */}
                    <picture>
                      <source 
                        media="(max-width: 768px)" 
                        srcSet={item.mobileImage} 
                      />
                      <img
                        className="d-block w-100"
                        src={item.webImage}
                        alt={`Slide ${item.id} - Click to view schemes`}
                        style={{
                          height: 'auto',
                          maxHeight: '500px',
                          objectFit: 'cover'
                        }}
                      />
                    </picture>
                    
                    {/* Optional: Add a subtle overlay hint */}
                    <div 
                      className="carousel-overlay"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0';
                      }}
                    >
                      <div 
                        style={{
                          background: 'rgba(255,255,255,0.9)',
                          padding: '10px 20px',
                          borderRadius: '25px',
                          color: '#333',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        Click to View Schemes
                      </div>
                    </div>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
