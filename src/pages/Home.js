import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { referenceAPI } from '../services/api';

const Home = () => {
  const { user } = useAuth();

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
                  {/* Responsive Image */}
                  <picture>
                    <source 
                      media="(max-width: 768px)" 
                      srcSet={item.mobileImage} 
                    />
                    <img
                      className="d-block w-100"
                      src={item.webImage}
                      alt={`Slide ${item.id}`}
                      style={{
                        height: 'auto',
                        maxHeight: '500px',
                        objectFit: 'cover'
                      }}
                    />
                  </picture>
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
