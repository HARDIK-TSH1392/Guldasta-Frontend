import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { referenceAPI } from '../services/api';
import { religionOptions, genderOptions, getCategoriesForReligion, getCastesForCategory } from '../utils/religionCasteData';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  
  const isFirstTime = location.state?.isFirstTime || false;
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    gender: user?.gender || '',
    role: location.state?.role || user?.role || 'volunteer',
    religion: user?.religion || '',
    category: user?.category || '',
    caste: user?.caste || '',
    state: 'Bihar', // Hardcoded to Bihar
    pc: user?.pc || '',
    ac: user?.ac || '',
    leaderPhone: user?.leaderPhone || ''
  });

  const [referenceData, setReferenceData] = useState({
    states: [],
    pcs: [],
    acs: []
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [casteOptions, setCasteOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadReferenceData();
  }, []);

  useEffect(() => {
    // Always load PCs for Bihar since state is hardcoded
    loadPCs();
  }, []);

  useEffect(() => {
    if (formData.pc) {
      loadACs(formData.pc);
    }
  }, [formData.pc]);

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

  const loadReferenceData = async () => {
    try {
      // Load PCs for Bihar since state is hardcoded
      const pcsRes = await referenceAPI.getPCs();
      setReferenceData(prev => ({
        ...prev,
        pcs: pcsRes.data
      }));

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

  const loadPCs = async () => {
    try {
      const response = await referenceAPI.getPCs();
      setReferenceData(prev => ({
        ...prev,
        pcs: response.data,
        acs: [] // Clear ACs when loading PCs
      }));
      // Reset PC and AC when loading fresh PCs
      setFormData(prev => ({
        ...prev,
        pc: '',
        ac: ''
      }));
    } catch (error) {
      console.error('Error loading PCs:', error);
    }
  };

  const loadACs = async (pc) => {
    try {
      const response = await referenceAPI.getACs(pc);
      setReferenceData(prev => ({
        ...prev,
        acs: response.data
      }));
      // Reset AC when PC changes
      setFormData(prev => ({
        ...prev,
        ac: ''
      }));
    } catch (error) {
      console.error('Error loading ACs:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.gender) errors.push('Gender is required');
    if (!formData.religion) errors.push('Religion is required');
    if (!formData.category) errors.push('Category is required');
    if (!formData.caste.trim()) errors.push('Caste is required');
    if (!formData.pc) errors.push('Parliamentary Constituency is required');
    if (!formData.ac) errors.push('Assembly Constituency is required');
    
    if (formData.role === 'volunteer' && !formData.leaderPhone.trim()) {
      errors.push('Leader phone is required for volunteers');
    }
    
    if (formData.leaderPhone && !/^\d{10}$/.test(formData.leaderPhone)) {
      errors.push('Leader phone must be 10 digits');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      
      // Navigate to home after successful profile completion
      setTimeout(() => {
        navigate('/home');
      }, 1500);
      
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">
                {isFirstTime ? 'Complete Your Profile' : 'Update Profile'}
              </h4>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>नाम *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="अपना पूरा नाम दर्ज करें"
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>लिंग *</Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
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
                      <Form.Label>भूमिका</Form.Label>
                      <Form.Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        disabled={!isFirstTime}
                      >
                        <option value="volunteer">Volunteer</option>
                        <option value="leader">Leader</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>धर्म *</Form.Label>
                      <Form.Select
                        name="religion"
                        value={formData.religion}
                        onChange={handleChange}
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
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>श्रेणी *</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        disabled={!formData.religion}
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
                  
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>जाति *</Form.Label>
                      <Form.Select
                        name="caste"
                        value={formData.caste}
                        onChange={handleChange}
                        required
                        disabled={!formData.category}
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
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>संसदीय क्षेत्र (बिहार) *</Form.Label>
                      <Form.Select
                        name="pc"
                        value={formData.pc}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select PC</option>
                        {referenceData.pcs.map(pc => (
                          <option key={pc._id} value={pc.name}>
                            {pc.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>विधानसभा क्षेत्र *</Form.Label>
                      <Form.Select
                        name="ac"
                        value={formData.ac}
                        onChange={handleChange}
                        required
                        disabled={!formData.pc}
                      >
                        <option value="">Select AC</option>
                        {referenceData.acs.map(ac => (
                          <option key={ac._id} value={ac.name}>
                            {ac.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  {formData.role === 'volunteer' && (
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>नेता का फोन *</Form.Label>
                        <Form.Control
                          type="tel"
                          name="leaderPhone"
                          value={formData.leaderPhone}
                          onChange={handleChange}
                          placeholder="Enter leader's phone number"
                          maxLength="10"
                          required
                        />
                      </Form.Group>
                    </Col>
                  )}
                </Row>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="outline-secondary"
                    onClick={handleLogout}
                    disabled={loading}
                  >
                    Logout
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        {isFirstTime ? 'Completing...' : 'Updating...'}
                      </>
                    ) : (
                      isFirstTime ? 'Complete Profile' : 'Update Profile'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
