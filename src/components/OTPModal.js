import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';

const OTPModal = ({ 
  show, 
  onHide, 
  phoneNumber, 
  onVerify, 
  onResend, 
  loading = false,
  title = "OTP Verification"
}) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (show) {
      setOtp('');
      setError('');
      setCountdown(30); // 30 second countdown for resend
    }
  }, [show]);

  // Countdown timer for resend button
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('Please enter OTP');
      return;
    }

    if (!/^\d{4}$/.test(otp)) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }

    try {
      await onVerify(otp);
    } catch (err) {
      setError(err.message || 'Verification failed');
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    
    try {
      await onResend();
      setCountdown(30); // Reset countdown
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    return phone.replace(/(\d{5})(\d{5})/, '$1-$2');
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-3">
          <p className="mb-2">
            OTP has been sent to
          </p>
          <strong className="text-primary">
            +91 {formatPhoneNumber(phoneNumber)}
          </strong>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Enter 4-digit OTP</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                setOtp(value);
                setError('');
              }}
              maxLength={4}
              className="text-center fs-4 letter-spacing-wide"
              style={{ letterSpacing: '0.5em' }}
              autoFocus
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading || otp.length !== 4}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>

            <Button 
              variant="outline-secondary" 
              onClick={handleResend}
              disabled={countdown > 0 || resendLoading}
            >
              {resendLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Resend OTP (${countdown}s)`
              ) : (
                'Resend OTP'
              )}
            </Button>
          </div>
        </Form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Didn't receive the OTP? Check your phone or try resending.
          </small>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OTPModal;
