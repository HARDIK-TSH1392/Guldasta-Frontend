import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { referenceAPI } from '../services/api';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  
  const isFirstTime = location.state?.isFirstTime || false;
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    role: location.state?.role || user?.role || 'volunteer',
    religion: user?.religion || '',
    caste: user?.caste || '',
    pc: user?.pc || '',
    ac: user?.ac || '',
    panchayat: user?.panchayat || '',
    leaderPhone: user?.leaderPhone || ''
  });

  const [referenceData, setReferenceData] = useState({
    religions: [],
    castes: [],
    pcs: [],
    acs: [],
    panchayats: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadReferenceData();
  }, []);

  useEffect(() => {
    if (formData.pc) {
      loadACs(formData.pc);
    }
  }, [formData.pc]);

  const loadReferenceData = async () => {
    try {
      const [religionsRes, pcsRes, panchayatsRes] = await Promise.all([
        referenceAPI.getReligions(),
        referenceAPI.getPCs(),
        referenceAPI.getPanchayats()
      ]);

      setReferenceData(prev => ({
        ...prev,
        religions: religionsRes.data,
        pcs: pcsRes.data,
        panchayats: panchayatsRes.data
      }));

      // Load castes if religion is already selected
      if (formData.religion) {
        const castesRes = await referenceAPI.getCastes(formData.religion);
        setReferenceData(prev => ({
          ...prev,
          castes: castesRes.data
        }));
      }

      // Load ACs if PC is already selected
      if (formData.pc) {
        const acsRes = await referenceAPI.getACs(formData.pc);
        setReferenceData(prev => ({
          ...prev,
          acs: acsRes.data
        }));
      }
    } catch (error) {
      console.error('Error loading reference data:', error);
      setError('Failed to load form data');
    }
  };

  const loadACs = async (pc) => {
    try {
      const response = await referenceAPI.getACs(pc);
      setReferenceData(prev => ({
        ...prev,
        acs: response.data
      }));
    } catch (error) {
      console.error('Error loading ACs:', error);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Load castes when religion changes
    if (name === 'religion' && value) {
      try {
        const response = await referenceAPI.getCastes(value);
        setReferenceData(prev => ({
          ...prev,
          castes: response.data
        }));
        setFormData(prev => ({
          ...prev,
          caste: '' // Reset caste when religion changes
        }));
      } catch (error) {
        console.error('Error loading castes:', error);
      }
    }

    // Load ACs when PC changes
    if (name === 'pc' && value) {
      setFormData(prev => ({
        ...prev,
        ac: '' // Reset AC when PC changes
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (formData.role === 'volunteer' && !formData.leaderPhone.trim()) {
      setError('Leader phone number is required for volunteers');
      return;
    }

    if (formData.leaderPhone && !/^[6-9]\d{9}$/.test(formData.leaderPhone)) {
      setError('Please enter a valid 10-digit leader phone number');
      return;
    }

    setLoading(true);

    const result = await updateProfile(formData);

    setLoading(false);

    if (result.success) {
      setSuccess('Profile updated successfully!');
      
      if (isFirstTime) {
        // For first time users, log them out and redirect to login
        setTimeout(() => {
          logout();
          navigate('/login', { 
            state: { 
              message: 'Profile setup complete! Please login again to continue.' 
            }
          });
        }, 2000);
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="page-container" style={{ paddingTop: '100px' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="card-custom fade-in">
              <Card.Body className="p-4">
                <h2 className="auth-title">
                  {isFirstTime ? 'Complete Your Profile' : 'Update Profile'}
                </h2>
                
                {isFirstTime && (
                  <Alert variant="info" className="alert-custom">
                    Please complete your profile information. You will be logged out after completion and need to login again.
                  </Alert>
                )}

                {error && <Alert variant="danger" className="alert-custom alert-danger-custom">{error}</Alert>}
                {success && <Alert variant="success" className="alert-custom alert-success-custom">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="form-control-custom"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="form-select-custom"
                          disabled={!isFirstTime}
                        >
                          <option value="volunteer">Volunteer</option>
                          <option value="leader">Leader</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Religion</Form.Label>
                        <Form.Select
                          name="religion"
                          value={formData.religion}
                          onChange={handleInputChange}
                          className="form-select-custom"
                        >
                          <option value="">Select Religion</option>
                          {referenceData.religions.map(religion => (
                            <option key={religion.id} value={religion.name}>
                              {religion.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Caste</Form.Label>
                        <Form.Select
                          name="caste"
                          value={formData.caste}
                          onChange={handleInputChange}
                          className="form-select-custom"
                          disabled={!formData.religion}
                        >
                          <option value="">Select Caste</option>
                          {referenceData.castes.map(caste => (
                            <option key={caste.id} value={caste.name}>
                              {caste.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Parliamentary Constituency (PC)</Form.Label>
                        <Form.Select
                          name="pc"
                          value={formData.pc}
                          onChange={handleInputChange}
                          className="form-select-custom"
                        >
                          <option value="">Select PC</option>
                          {referenceData.pcs.map(pc => (
                            <option key={pc.id} value={pc.name}>
                              {pc.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Assembly Constituency (AC)</Form.Label>
                        <Form.Select
                          name="ac"
                          value={formData.ac}
                          onChange={handleInputChange}
                          className="form-select-custom"
                          disabled={!formData.pc}
                        >
                          <option value="">Select AC</option>
                          {referenceData.acs.map(ac => (
                            <option key={ac.id} value={ac.name}>
                              {ac.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Panchayat</Form.Label>
                        <Form.Select
                          name="panchayat"
                          value={formData.panchayat}
                          onChange={handleInputChange}
                          className="form-select-custom"
                        >
                          <option value="">Select Panchayat</option>
                          {referenceData.panchayats.map(panchayat => (
                            <option key={panchayat.id} value={panchayat.name}>
                              {panchayat.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    {formData.role === 'volunteer' && (
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Leader Phone Number *</Form.Label>
                          <Form.Control
                            type="tel"
                            name="leaderPhone"
                            value={formData.leaderPhone}
                            onChange={handleInputChange}
                            placeholder="Enter leader's phone number"
                            className="form-control-custom"
                            maxLength="10"
                            required
                          />
                        </Form.Group>
                      </Col>
                    )}
                  </Row>

                  <Button
                    type="submit"
                    className="btn-primary-custom w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        {isFirstTime ? 'Setting up profile...' : 'Updating profile...'}
                      </>
                    ) : (
                      isFirstTime ? 'Complete Setup' : 'Update Profile'
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
