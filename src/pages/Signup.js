import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    phone: '',
    role: 'volunteer'
  });
  const [step, setStep] = useState(1); // 1: phone & role, 2: OTP
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { signup } = useAuth();
  const navigate = useNavigate();

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
    
    const result = await signup({
      name: '', // Will be filled in profile
      phone: formData.phone,
      role: formData.role
    });

    setLoading(false);

    if (result.success) {
      setSuccess('OTP sent successfully! Please check your phone.');
      setStep(2);
    } else {
      setError(result.message);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!otp || otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }

    setLoading(true);
    
    // For now, we'll just navigate to profile setup
    // In a real app, you'd verify the OTP here
    setTimeout(() => {
      setLoading(false);
      navigate('/profile', { state: { isFirstTime: true, phone: formData.phone, role: formData.role } });
    }, 1000);
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);
    
    const result = await signup({
      name: '',
      phone: formData.phone,
      role: formData.role
    });

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
                {step === 1 ? 'Sign Up' : 'Verify OTP'}
              </h2>
              
              {error && <Alert variant="danger" className="alert-custom alert-danger-custom">{error}</Alert>}
              {success && <Alert variant="success" className="alert-custom alert-success-custom">{success}</Alert>}

              {step === 1 ? (
                <Form onSubmit={handleSendOTP}>
                  <Form.Group className="mb-3">
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

                  <Form.Group className="mb-4">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="form-select-custom"
                      required
                    >
                      <option value="volunteer">Volunteer</option>
                      <option value="leader">Leader</option>
                    </Form.Select>
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
                <Form onSubmit={handleVerifyOTP}>
                  <div className="mb-3">
                    <p className="text-muted">
                      OTP sent to +91 {formData.phone}
                    </p>
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
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
                        Verifying...
                      </>
                    ) : (
                      'Verify OTP'
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
                <span className="text-muted">Already have an account? </span>
                <Link to="/login" className="text-decoration-none">
                  Login here
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default Signup;
