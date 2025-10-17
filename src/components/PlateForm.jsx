// src/components/PlateForm.js
import React, { useState } from 'react';
import { usePlates } from '../context/PlateContext';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';

const PlateForm = () => {
  const { addPlate } = usePlates();
  const [formData, setFormData] = useState({
    ownerName: '',
    plateNumber: '',
    vehicleType: '',
    state: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [showAlert, setShowAlert] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    addPlate(formData);
    setFormData({
      ownerName: '',
      plateNumber: '',
      vehicleType: '',
      state: '',
      date: new Date().toISOString().split('T')[0],
    });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
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
              <Alert variant="success" className="d-flex align-items-center">
                <i className="fas fa-check-circle me-2"></i>
                Plate number registered successfully!
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Vehicle Owner's Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      required
                      size="lg"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Plate Number *</Form.Label>
                    <Form.Control
                      type="text"
                      name="plateNumber"
                      value={formData.plateNumber}
                      onChange={handleChange}
                      placeholder="e.g., ABC-123-LAG"
                      required
                      size="lg"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Vehicle Type *</Form.Label>
                    <Form.Select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      required
                      size="lg"
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
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      size="lg"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid">
                <Button variant="success" type="submit" size="lg" className="fw-bold">
                  <i className="fas fa-save me-2"></i>
                  Register Plate Number
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