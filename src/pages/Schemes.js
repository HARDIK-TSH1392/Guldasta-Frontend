import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { referenceAPI, beneficiaryAPI } from '../services/api';

const Schemes = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    religion: '',
    category: '',
    caste: '',
    schemes: [],
    leaderMobile: ''
  });

  const [referenceData, setReferenceData] = useState({
    religions: [],
    categories: [],
    castes: [],
    schemes: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // OTP Modal state
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    loadReferenceData();
  }, []);

  const loadReferenceData = async () => {
    try {
      const [religionsRes, categoriesRes, schemesRes] = await Promise.all([
        referenceAPI.getReligions(),
        referenceAPI.getCategories(),
        referenceAPI.getSchemes()
      ]);

      setReferenceData(prev => ({
        ...prev,
        religions: religionsRes.data,
        categories: categoriesRes.data,
        schemes: schemesRes.data
      }));
    } catch (error) {
      console.error('Error loading reference data:', error);
      setError('Failed to load form data');
    }
  };

  const handleInputChange = async (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle scheme selection
      setFormData(prev => ({
        ...prev,
        schemes: checked 
          ? [...prev.schemes, value]
          : prev.schemes.filter(scheme => scheme !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // Load castes when category changes
      if (name === 'category' && value) {
        try {
          const response = await referenceAPI.getCastes(value);
          setReferenceData(prev => ({
            ...prev,
            castes: response.data
          }));
          setFormData(prev => ({
            ...prev,
            caste: '' // Reset caste when category changes
          }));
        } catch (error) {
          console.error('Error loading castes:', error);
        }
      }
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

    if (!formData.age || formData.age < 1 || formData.age > 100) {
      setError('Please enter a valid age between 1 and 100');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.leaderMobile)) {
      setError('Please enter a valid 10-digit leader mobile number');
      return;
    }

    if (!formData.religion || !formData.category || !formData.caste) {
      setError('Please select religion, category, and caste');
      return;
    }

    if (formData.schemes.length === 0) {
      setError('Please select at least one scheme');
      return;
    }

    setLoading(true);

    try {
      const response = await beneficiaryAPI.initiate(formData);
      
      if (response.data.registrationNumber) {
        setRegistrationNumber(response.data.registrationNumber);
        setSuccess('Form submitted successfully! Please verify OTP sent to beneficiary\'s phone.');
        setShowOTPModal(true);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (!otp || otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }

    setOtpLoading(true);

    try {
      const response = await beneficiaryAPI.verify(formData.phone, otp);
      
      if (response.data.success) {
        setSuccess(`Beneficiary registered successfully! Registration Number: ${registrationNumber}`);
        setShowOTPModal(false);
        
        // Reset form
        setFormData({
          name: '',
          age: '',
          phone: '',
          religion: '',
          category: '',
          caste: '',
          schemes: [],
          leaderMobile: ''
        });
        setOtp('');
        setRegistrationNumber('');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ paddingTop: '100px' }}>
      <Container>
        <Row>
          <Col>
            <h2 className="text-center mb-4" style={{ color: 'var(--dark-blue)', fontWeight: '700' }}>
              Beneficiary Registration
            </h2>
            <p className="text-center text-muted mb-5">
              Register beneficiaries for government schemes and welfare programs
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="card-custom fade-in">
              <Card.Body className="p-4">
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
                          placeholder="Enter beneficiary's full name"
                          className="form-control-custom"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Age *</Form.Label>
                        <Form.Control
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          placeholder="Enter age"
                          className="form-control-custom"
                          min="1"
                          max="100"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number *</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter 10-digit phone number"
                          className="form-control-custom"
                          maxLength="10"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Leader Mobile *</Form.Label>
                        <Form.Control
                          type="tel"
                          name="leaderMobile"
                          value={formData.leaderMobile}
                          onChange={handleInputChange}
                          placeholder="Enter leader's mobile number"
                          className="form-control-custom"
                          maxLength="10"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Religion *</Form.Label>
                        <Form.Select
                          name="religion"
                          value={formData.religion}
                          onChange={handleInputChange}
                          className="form-select-custom"
                          required
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
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Category *</Form.Label>
                        <Form.Select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="form-select-custom"
                          required
                        >
                          <option value="">Select Category</option>
                          {referenceData.categories.map(category => (
                            <option key={category.id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Caste *</Form.Label>
                        <Form.Select
                          name="caste"
                          value={formData.caste}
                          onChange={handleInputChange}
                          className="form-select-custom"
                          disabled={!formData.category}
                          required
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

                  <Form.Group className="mb-4">
                    <Form.Label>Select Schemes *</Form.Label>
                    <div className="mt-2">
                      {referenceData.schemes.map(scheme => (
                        <Form.Check
                          key={scheme.id}
                          type="checkbox"
                          id={`scheme-${scheme.id}`}
                          label={scheme.name}
                          value={scheme.name}
                          checked={formData.schemes.includes(scheme.name)}
                          onChange={handleInputChange}
                          className="mb-2"
                        />
                      ))}
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn-primary-custom w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Registration'
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* OTP Verification Modal */}
      <Modal show={showOTPModal} onHide={() => setShowOTPModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Verify OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            OTP has been sent to <strong>+91 {formData.phone}</strong>
          </p>
          <p className="text-muted small">
            Registration Number: <strong>{registrationNumber}</strong>
          </p>
          
          <Form.Group className="mb-3">
            <Form.Label>Enter OTP</Form.Label>
            <Form.Control
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 4-digit OTP"
              className="form-control-custom text-center"
              maxLength="4"
            />
            <Form.Text className="text-muted">
              For testing, use: 1234
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOTPModal(false)}>
            Cancel
          </Button>
          <Button 
            className="btn-primary-custom"
            onClick={handleOTPVerification}
            disabled={otpLoading}
          >
            {otpLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Schemes;
