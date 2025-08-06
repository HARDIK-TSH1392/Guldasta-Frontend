import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    phone: '',
    otp: ''
  });
  const [step, setStep] = useState(1); // 1: phone, 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Show message from profile completion
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate phone number
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      setError('कृपया एक वैध 10 अंकों का मोबाइल नंबर दर्ज करें');
      return;
    }

    setLoading(true);
    
    const result = await signup({
      phone: formData.phone,
      role: 'volunteer'
    });

    setLoading(false);

    if (result.success) {
      setSuccess('OTP सफलतापूर्वक भेजा गया! कृपया अपना फोन चेक करें।');
      setStep(2);
    } else {
      setError(result.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.otp || formData.otp.length !== 4) {
      setError('कृपया 4 अंकों का वैध OTP दर्ज करें');
      return;
    }

    setLoading(true);
    
    const result = await login(formData.phone, formData.otp);

    setLoading(false);

    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message || 'लॉगिन में त्रुटि हुई');
    }
  };

  return (
    <div className="auth-container">
      <Container>
        <div className="d-flex justify-content-center">
          <Card className="auth-card fade-in">
            <Card.Body>
              <h2 className="auth-title">
                {step === 1 ? 'लॉगिन' : 'OTP सत्यापित करें'}
              </h2>
              
              {error && <Alert variant="danger" className="alert-custom alert-danger-custom">{error}</Alert>}
              {success && <Alert variant="success" className="alert-custom alert-success-custom">{success}</Alert>}

              {step === 1 ? (
                <Form onSubmit={handleSendOTP}>
                  <Form.Group className="mb-4">
                    <Form.Label>मोबाइल नंबर</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10 अंकों का मोबाइल नंबर दर्ज करें"
                      className="form-control-custom"
                      required
                      maxLength="10"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn-primary-custom w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        OTP भेजा जा रहा है...
                      </>
                    ) : (
                      'OTP भेजें'
                    )}
                  </Button>
                </Form>
              ) : (
                <Form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <p className="text-muted">
                      +91 {formData.phone} पर OTP भेजा गया
                    </p>
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label>OTP दर्ज करें</Form.Label>
                    <Form.Control
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                      placeholder="4 अंकों का OTP दर्ज करें"
                      className="form-control-custom text-center"
                      maxLength="4"
                      required
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn-primary-custom w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        लॉगिन हो रहा है...
                      </>
                    ) : (
                      'लॉगिन करें'
                    )}
                  </Button>

                </Form>
              )}

              <div className="text-center mt-3">
                <span className="text-muted">खाता नहीं है? </span>
                <Link to="/signup" className="text-decoration-none">
                  यहाँ साइन अप करें
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default Login;
