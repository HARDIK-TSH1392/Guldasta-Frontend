import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CustomNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar className="navbar-custom" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
          बिहार अधिकार
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/home" 
                  className={`nav-link-custom ${location.pathname === '/home' ? 'active' : ''}`}
                >
                  Home
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/schemes" 
                  className={`nav-link-custom ${location.pathname === '/schemes' ? 'active' : ''}`}
                >
                  Schemes
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/profile" 
                  className={`nav-link-custom ${location.pathname === '/profile' ? 'active' : ''}`}
                >
                  Profile
                </Nav.Link>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={handleLogout}
                  className="ms-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/login" 
                  className={`nav-link-custom ${location.pathname === '/login' ? 'active' : ''}`}
                >
                  Login
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/signup" 
                  className={`nav-link-custom ${location.pathname === '/signup' ? 'active' : ''}`}
                >
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
