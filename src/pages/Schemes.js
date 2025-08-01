import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { beneficiaryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { religionOptions, genderOptions, getCategoriesForReligion, getCastesForCategory } from '../utils/religionCasteData';

const Schemes = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    religion: '',
    category: '',
    caste: '',
    voterIdHelp: false,
    congressWork: false,
    leaderMobile: user?.leaderPhone || ''
  });

  const [referenceData, setReferenceData] = useState({});

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [casteOptions, setCasteOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');

  useEffect(() => {
    // No reference data loading needed anymore
  }, []);

  // Update leaderMobile when user data is available
  useEffect(() => {
    if (user?.leaderPhone) {
      setFormData(prev => ({
        ...prev,
        leaderMobile: user.leaderPhone
      }));
    }
  }, [user]);

  // Update categories when religion changes
  useEffect(() => {
    if (formData.religion) {
      const categories = getCategoriesForReligion(formData.religion);
      setCategoryOptions(categories);
      // Reset category and caste when religion changes
      setFormData(prev => ({
        ...prev,
        category: '',
        caste: ''
      }));
      setCasteOptions([]);
    } else {
      setCategoryOptions([]);
      setCasteOptions([]);
    }
  }, [formData.religion]);

  // Update castes when category changes
  useEffect(() => {
    if (formData.religion && formData.category) {
      const castes = getCastesForCategory(formData.religion, formData.category);
      setCasteOptions(castes);
      // Reset caste when category changes
      setFormData(prev => ({
        ...prev,
        caste: ''
      }));
    } else {
      setCasteOptions([]);
    }
  }, [formData.religion, formData.category]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle boolean checkbox fields
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
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

    if (!formData.age || formData.age < 1 || formData.age > 100) {
      setError('Please enter a valid age between 1 and 100');
      return;
    }

    if (!formData.gender) {
      setError('Please select gender');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    if (!formData.leaderMobile || !/^[6-9]\d{9}$/.test(formData.leaderMobile)) {
      setError('Leader mobile number is missing or invalid. Please update your profile.');
      return;
    }

    if (!formData.religion || !formData.category || !formData.caste) {
      setError('Please select religion, category, and caste');
      return;
    }

    setLoading(true);

    try {
      const response = await beneficiaryAPI.initiate(formData);
      
      if (response.data.success && response.data.registrationNumber) {
        setRegistrationNumber(response.data.registrationNumber);
        setSuccess(`Beneficiary registered successfully! Registration Number: ${response.data.registrationNumber}`);
        
        // Reset form
        setFormData({
          name: '',
          age: '',
          gender: '',
          phone: '',
          religion: '',
          category: '',
          caste: '',
          voterIdHelp: false,
          congressWork: false,
          leaderMobile: user?.leaderPhone || ''
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit form');
    } finally {
      setLoading(false);
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
              Register beneficiaries and collect their information for welfare programs
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
                    <Col md={4}>
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
                    <Col md={4}>
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
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Gender *</Form.Label>
                        <Form.Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="form-select-custom"
                          required
                        >
                          <option value="">Select Gender</option>
                          {genderOptions.map(gender => (
                            <option key={gender.value} value={gender.value}>
                              {gender.label} ({gender.labelEn})
                            </option>
                          ))}
                        </Form.Select>
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
                          className="form-control-custom"
                          maxLength="10"
                          readOnly
                          style={{ backgroundColor: '#f8f9fa' }}
                        />
                        <Form.Text className="text-muted">
                          Auto-populated from your profile
                        </Form.Text>
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
                          {religionOptions.map(religion => (
                            <option key={religion} value={religion}>
                              {religion}
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
                          disabled={!formData.religion}
                          required
                        >
                          <option value="">Select Category</option>
                          {categoryOptions.map(category => (
                            <option key={category} value={category}>
                              {category}
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
                          {casteOptions.map(caste => (
                            <option key={caste} value={caste}>
                              {caste}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Additional Information</Form.Label>
                        <div className="mt-2">
                          <Form.Check
                            type="checkbox"
                            id="voterIdHelp"
                            name="voterIdHelp"
                            label="Do you need help with Voter ID registration?"
                            checked={formData.voterIdHelp}
                            onChange={handleInputChange}
                            className="mb-2"
                          />
                          <Form.Check
                            type="checkbox"
                            id="congressWork"
                            name="congressWork"
                            label="Would you like to work with Congress at Panchayat/Ward level?"
                            checked={formData.congressWork}
                            onChange={handleInputChange}
                            className="mb-2"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

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
    </div>
  );
};

export default Schemes;
