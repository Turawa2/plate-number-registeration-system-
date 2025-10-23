import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';

const PlateForm = () => {
  const { admin } = useAuth();
  const [formData, setFormData] = useState({
    owner_name: '',
    plate_number: '',
    vehicle_type: '',
    state: '',
    registration_date: new Date().toISOString().split('T')[0],
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [loading, setLoading] = useState(false);

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 
    'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 
    'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 
    'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  const vehicleTypes = [
    'Private Car', 'Commercial Vehicle', 'Motorcycle', 'Truck', 'Bus', 
    'SUV', 'Mini Van', 'Taxi', 'Trailer', 'Government Vehicle'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowAlert(false);

    try {
      const response = await fetch('http://localhost:9000/api/plates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          created_by: admin.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFormData({
          owner_name: '',
          plate_number: '',
          vehicle_type: '',
          state: '',
          registration_date: new Date().toISOString().split('T')[0],
        });
        setAlertMessage('Plate number registered successfully!');
        setAlertVariant('success');
        setShowAlert(true);
        
        // Refresh the plate list by reloading the page or you can use context to update
        window.dispatchEvent(new Event('plateAdded'));
      } else {
        setAlertMessage(data.message || 'Failed to register plate number');
        setAlertVariant('danger');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setAlertMessage('Failed to connect to server. Please try again.');
      setAlertVariant('danger');
      setShowAlert(true);
    } finally {
      setLoading(false);
      setTimeout(() => setShowAlert(false), 5000);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Row className="justify-content-center">
      <Col lg={8}>
        <Card className="border-0 shadow">
          <Card.Header className="nigerian-green text-white">
            <h5 className="mb-0">
              <i className="fas fa-car me-2"></i>
              Register New Plate Number
            </h5>
          </Card.Header>
          
          <Card.Body className="p-4">
            {showAlert && (
              <Alert variant={alertVariant} className="d-flex align-items-center">
                <i className={`fas ${
                  alertVariant === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'
                } me-2`}></i>
                {alertMessage}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Vehicle Owner's Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="owner_name"
                      value={formData.owner_name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      required
                      size="lg"
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Plate Number *</Form.Label>
                    <Form.Control
                      type="text"
                      name="plate_number"
                      value={formData.plate_number}
                      onChange={handleChange}
                      placeholder="e.g., ABC-123-LAG"
                      required
                      size="lg"
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Vehicle Type *</Form.Label>
                    <Form.Select
                      name="vehicle_type"
                      value={formData.vehicle_type}
                      onChange={handleChange}
                      required
                      size="lg"
                      disabled={loading}
                    >
                      <option value="">Select vehicle type</option>
                      {vehicleTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>State of Registration *</Form.Label>
                    <Form.Select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      size="lg"
                      disabled={loading}
                    >
                      <option value="">Select state</option>
                      {nigerianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group className="mb-4">
                    <Form.Label>Date of Registration *</Form.Label>
                    <Form.Control
                      type="date"
                      name="registration_date"
                      value={formData.registration_date}
                      onChange={handleChange}
                      required
                      size="lg"
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid">
                <Button 
                  variant="success" 
                  type="submit" 
                  size="lg" 
                  className="fw-bold py-3"
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
                      Registering...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Register Plate Number
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default PlateForm;