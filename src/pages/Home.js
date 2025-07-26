import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Carousel, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { referenceAPI } from '../services/api';

const Home = () => {
  const { user } = useAuth();
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    try {
      const response = await referenceAPI.getSchemes();
      setSchemes(response.data);
    } catch (error) {
      console.error('Error loading schemes:', error);
    }
  };

  // Placeholder carousel data
  const carouselItems = [
    {
      id: 1,
      image: 'https://via.placeholder.com/800x400/3b82f6/ffffff?text=Government+Schemes',
      title: 'Government Schemes for All',
      description: 'Empowering citizens through various government welfare schemes'
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/800x400/60a5fa/ffffff?text=Digital+India',
      title: 'Digital India Initiative',
      description: 'Bridging the digital divide and promoting digital literacy'
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/800x400/93c5fd/ffffff?text=Rural+Development',
      title: 'Rural Development Programs',
      description: 'Transforming rural areas through comprehensive development programs'
    }
  ];

  // Placeholder scheme descriptions
  const schemeDescriptions = {
    'PM-KISAN': 'Pradhan Mantri Kisan Samman Nidhi provides income support to farmer families across the country to supplement their financial needs for procuring various inputs related to agriculture and allied activities.',
    'PM-Awas Yojana': 'Pradhan Mantri Awas Yojana aims to provide affordable housing to the urban and rural poor with a target to build 20 million affordable houses by 2022.',
    'PM-Fasal Bima': 'Pradhan Mantri Fasal Bima Yojana provides insurance coverage and financial support to farmers in the event of failure of any of the notified crops as a result of natural calamities.',
    'PM-JAY': 'Pradhan Mantri Jan Arogya Yojana provides health insurance coverage of Rs. 5 lakh per family per year for secondary and tertiary care hospitalization.',
    'PM-Garib Kalyan Yojana': 'Pradhan Mantri Garib Kalyan Yojana provides comprehensive social security and welfare measures for the poor and underprivileged sections of society.'
  };

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row>
            <Col>
              <h1 className="hero-title fade-in">
                Welcome to गुलदस्ता
              </h1>
              <p className="hero-subtitle slide-in-left">
                {user ? `Hello ${user.name}, ` : ''}
                Your gateway to government schemes and welfare programs
              </p>
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
                  <img
                    className="d-block w-100"
                    src={item.image}
                    alt={item.title}
                  />
                  <Carousel.Caption>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Container>

      {/* Schemes Information Section */}
      <Container className="my-5">
        <Row>
          <Col>
            <h2 className="text-center mb-4" style={{ color: 'var(--dark-blue)', fontWeight: '700' }}>
              Available Government Schemes
            </h2>
          </Col>
        </Row>
        <Row>
          {schemes.map((scheme, index) => (
            <Col md={6} lg={4} key={scheme.id} className="mb-4">
              <Card className="scheme-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <Card.Body>
                  <h5 className="scheme-title">{scheme.name}</h5>
                  <p className="scheme-description">
                    {schemeDescriptions[scheme.name] || 'Detailed information about this scheme will be available soon. This scheme aims to provide various benefits and support to eligible beneficiaries across the country.'}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Statistics Section */}
      <section style={{ background: 'var(--lightest-blue)', padding: '4rem 0' }}>
        <Container>
          <Row>
            <Col>
              <h2 className="text-center mb-4" style={{ color: 'var(--dark-blue)', fontWeight: '700' }}>
                Our Impact
              </h2>
            </Col>
          </Row>
          <Row className="text-center">
            <Col md={3} className="mb-4">
              <Card className="card-custom">
                <Card.Body>
                  <h3 style={{ color: 'var(--primary-blue)', fontWeight: '700' }}>10,000+</h3>
                  <p className="text-muted">Beneficiaries Registered</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="card-custom">
                <Card.Body>
                  <h3 style={{ color: 'var(--primary-blue)', fontWeight: '700' }}>500+</h3>
                  <p className="text-muted">Active Volunteers</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="card-custom">
                <Card.Body>
                  <h3 style={{ color: 'var(--primary-blue)', fontWeight: '700' }}>50+</h3>
                  <p className="text-muted">Leaders</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="card-custom">
                <Card.Body>
                  <h3 style={{ color: 'var(--primary-blue)', fontWeight: '700' }}>25+</h3>
                  <p className="text-muted">Districts Covered</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action Section */}
      <Container className="my-5">
        <Row>
          <Col>
            <Card className="card-custom text-center" style={{ background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--dark-blue) 100%)', color: 'white' }}>
              <Card.Body className="p-5">
                <h3 className="mb-3">Ready to Help More People?</h3>
                <p className="mb-4">
                  Register beneficiaries for government schemes and make a difference in their lives.
                </p>
                <a href="/schemes" className="btn btn-light btn-lg">
                  Register Beneficiary
                </a>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
