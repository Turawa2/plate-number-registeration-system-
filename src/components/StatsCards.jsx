// src/components/StatsCards.js
import React from 'react';
import { usePlates } from '../context/PlateContext';
import { Row, Col, Card } from 'react-bootstrap';

const StatsCards = () => {
  const { plates } = usePlates();

  const stats = [
    {
      title: 'Total Plates',
      value: plates.length,
      icon: 'fas fa-car',
      color: 'primary',
    },
    {
      title: 'Unique States',
      value: new Set(plates.map(p => p.state)).size,
      icon: 'fas fa-map-marker-alt',
      color: 'success',
    },
    {
      title: 'Vehicle Owners',
      value: new Set(plates.map(p => p.ownerName)).size,
      icon: 'fas fa-users',
      color: 'info',
    },
    {
      title: 'This Month',
      value: plates.filter(p => {
        const plateDate = new Date(p.createdAt);
        const now = new Date();
        return plateDate.getMonth() === now.getMonth() && 
               plateDate.getFullYear() === now.getFullYear();
      }).length,
      icon: 'fas fa-calendar',
      color: 'warning',
    },
  ];

  return (
    <Row className="mb-4">
      {stats.map((stat, index) => (
        <Col key={index} md={3} className="mb-3">
          <Card className="stats-card h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-muted mb-2">{stat.title}</h6>
                  <h3 className="fw-bold text-dark">{stat.value}</h3>
                </div>
                <div className={`bg-${stat.color} rounded-circle d-flex align-items-center justify-content-center`} 
                     style={{width: '60px', height: '60px'}}>
                  <i className={`${stat.icon} text-white fs-4`}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsCards;