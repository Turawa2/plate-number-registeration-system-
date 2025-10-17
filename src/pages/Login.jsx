// src/pages/Login.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (login(email, password)) {
      // Success handled in context
    } else {
      setError('Invalid credentials. Use admin@plate.gov.ng / admin123');
    }
  };

  return (
    <div className="login-container d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="login-card">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: '60px', height: '60px'}}>
                    <i className="fas fa-car text-white fs-4"></i>
                  </div>
                  <h3 className="fw-bold text-dark">Nigerian Plate Number System</h3>
                  <p className="text-muted">Admin Portal</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  {error && (
                    <Alert variant="danger" className="mb-3">
                      {error}
                    </Alert>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@plate.gov.ng"
                      required
                      size="lg"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      size="lg"
                    />
                  </Form.Group>

                  <Button 
                    variant="success" 
                    type="submit" 
                    size="lg" 
                    className="w-100 fw-bold"
                  >
                    <i className="fas fa-shield-alt me-2"></i>
                    Sign In to Dashboard
                  </Button>
                </Form>

                <div className="mt-4 p-3 bg-light rounded">
                  <p className="text-center text-muted mb-0 small">
                    <strong>Demo Credentials:</strong><br />
                    Email: admin@plate.gov.ng<br />
                    Password: admin123
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;