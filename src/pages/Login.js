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
  
  const { login, resendOTP } = useAuth();
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
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    
    const result = await resendOTP(formData.phone);

    setLoading(false);

    if (result.success) {
      setSuccess('OTP sent successfully! Please check your phone.');
      setStep(2);
    } else {
      setError(result.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.otp || formData.otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }

    setLoading(true);
    
    const result = await login(formData.phone, formData.otp);

    setLoading(false);

    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);
    
    const result = await resendOTP(formData.phone);

    setLoading(false);

    if (result.success) {
      setSuccess('OTP resent successfully!');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <Container>
        <div className="d-flex justify-content-center">
          <Card className="auth-card fade-in">
            <Card.Body>
              <h2 className="auth-title">
                {step === 1 ? 'Login' : 'Verify OTP'}
              </h2>
              
              {error && <Alert variant="danger" className="alert-custom alert-danger-custom">{error}</Alert>}
              {success && <Alert variant="success" className="alert-custom alert-success-custom">{success}</Alert>}

              {step === 1 ? (
                <Form onSubmit={handleSendOTP}>
                  <Form.Group className="mb-4">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter 10-digit phone number"
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
                        Sending OTP...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </Form>
              ) : (
                <Form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <p className="text-muted">
                      OTP sent to +91 {formData.phone}
                    </p>
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                      placeholder="Enter 4-digit OTP"
                      className="form-control-custom text-center"
                      maxLength="4"
                      required
                    />
                    <Form.Text className="text-muted">
                      For testing, use: 1234
                    </Form.Text>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn-primary-custom w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="w-100"
                  >
                    Resend OTP
                  </Button>
                </Form>
              )}

              <div className="text-center mt-3">
                <span className="text-muted">Don't have an account? </span>
                <Link to="/signup" className="text-decoration-none">
                  Sign up here
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
