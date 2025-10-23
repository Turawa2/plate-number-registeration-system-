import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:9000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        login(data.admin); // Pass admin data to context
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center min-vh-100" 
         style={{ 
           background: 'linear-gradient(135deg, #008751 0%, #006442 100%)',
           padding: '20px'
         }}>
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={4}>
            <Card className="login-card shadow-lg border-0">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: '70px', height: '70px'}}>
                    <i className="fas fa-car text-white fs-3"></i>
                  </div>
                  <h2 className="fw-bold text-dark mb-2">Nigerian Plate Number System</h2>
                  <p className="text-muted mb-0">Admin Portal</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  {error && (
                    <Alert variant="danger" className="mb-3 text-center">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {error}
                    </Alert>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@plate.gov.ng"
                      required
                      size="lg"
                      className="py-3"
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      size="lg"
                      className="py-3"
                      disabled={loading}
                    />
                  </Form.Group>

                  <Button 
                    variant="success" 
                    type="submit" 
                    size="lg" 
                    className="w-100 fw-bold py-3"
                    disabled={loading}
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
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-shield-alt me-2"></i>
                        Sign In to Dashboard
                      </>
                    )}
                  </Button>
                </Form>

                {/* <div className="mt-4 p-3 bg-light rounded text-center">
                  <p className="text-muted mb-0 small">
                    <strong>Demo Credentials</strong><br />
                    Email: admin@plate.gov.ng<br />
                    Password: admin123
                  </p>
                </div> */}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;