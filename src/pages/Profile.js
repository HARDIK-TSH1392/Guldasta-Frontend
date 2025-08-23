import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col, Table, Badge } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { referenceAPI } from '../services/api';
import { religionOptions, genderOptions, getCategoriesForReligion, getCastesForCategory } from '../utils/religionCasteData';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateProfile, logout, fetchUserProfile } = useAuth();
  
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
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadReferenceData();
    loadAnalytics();
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

  const loadAnalytics = async () => {
    try {
      const response = await fetchUserProfile();
      if (response && response.analytics) {
        setAnalytics(response.analytics);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

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
      console.error('Failed to load reference data:', error);
    }
  };

  const loadPCs = async () => {
    try {
      const response = await referenceAPI.getPCs();
      setReferenceData(prev => ({
        ...prev,
        pcs: response.data
      }));
    } catch (error) {
      console.error('Failed to load PCs:', error);
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
      console.error('Failed to load ACs:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setSuccess('Profile updated successfully!');
        // Reload analytics after profile update
        await loadAnalytics();
        if (isFirstTime) {
          setTimeout(() => {
            navigate('/home');
          }, 2000);
        }
      } else {
        setError(result.message || 'Failed to update profile');
      }
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
        <Col md={8} lg={10}>
          {/* Analytics Section - Show only if not first time and analytics available */}
          {!isFirstTime && analytics && (
            <Card className="mb-4">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">📊 Analytics Dashboard</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <Card className="text-center border-primary">
                      <Card.Body>
                        <h3 className="text-primary">{analytics.formsFilledByUser}</h3>
                        <p className="mb-0">Forms Filled by You</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  {(user?.role === 'leader' || user?.role === 'admin') && (
                    <Col md={4}>
                      <Card className="text-center border-success">
                        <Card.Body>
                          <h3 className="text-success">{analytics.formsFilledByVolunteers}</h3>
                          <p className="mb-0">Forms by Your Volunteers</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                  
                  <Col md={4}>
                    <Card className="text-center border-warning">
                      <Card.Body>
                        <h3 className="text-warning">{analytics.topVolunteers.length}</h3>
                        <p className="mb-0">Active Volunteers</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Top 10 Volunteers Table */}
                {analytics.topVolunteers.length > 0 && (
                  <div className="mt-4">
                    <h6>🏆 Top 10 Volunteers</h6>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Mobile</th>
                          <th>Forms Filled</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.topVolunteers.map((volunteer, index) => (
                          <tr key={index}>
                            <td>
                              {index < 3 ? (
                                <Badge bg={index === 0 ? 'warning' : index === 1 ? 'secondary' : 'dark'}>
                                  {index + 1}
                                </Badge>
                              ) : (
                                index + 1
                              )}
                            </td>
                            <td>{volunteer.name}</td>
                            <td>{volunteer.mobile}</td>
                            <td>
                              <Badge bg="primary">{volunteer.formsCount}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Profile Form */}
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
                  
                  <Col md={4}>
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
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>राज्य</Form.Label>
                      <Form.Control
                        type="text"
                        value="Bihar"
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>संसदीय क्षेत्र *</Form.Label>
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
