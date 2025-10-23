import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Button } from 'react-bootstrap';

const StatsCards = () => {
  const [stats, setStats] = useState({
    totalPlates: 0,
    uniqueStates: 0,
    vehicleOwners: 0,
    thisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch stats from backend
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:9000/api/admin/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError('Failed to load statistics');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Listen for plate updates to refresh stats
  useEffect(() => {
    fetchStats();

    const handlePlateUpdate = () => {
      fetchStats();
    };

    window.addEventListener('plateAdded', handlePlateUpdate);
    window.addEventListener('plateUpdated', handlePlateUpdate);
    window.addEventListener('plateDeleted', handlePlateUpdate);

    return () => {
      window.removeEventListener('plateAdded', handlePlateUpdate);
      window.removeEventListener('plateUpdated', handlePlateUpdate);
      window.removeEventListener('plateDeleted', handlePlateUpdate);
    };
  }, []);

  const statCards = [
    {
      title: 'Total Plates',
      value: stats.totalPlates,
      icon: 'fas fa-car',
      color: 'primary',
      description: 'All registered plate numbers'
    },
    {
      title: 'Unique States',
      value: stats.uniqueStates,
      icon: 'fas fa-map-marker-alt',
      color: 'success',
      description: 'Number of states covered'
    },
    {
      title: 'Vehicle Owners',
      value: stats.vehicleOwners,
      icon: 'fas fa-users',
      color: 'info',
      description: 'Unique vehicle owners'
    },
    {
      title: 'This Month',
      value: stats.thisMonth,
      icon: 'fas fa-calendar',
      color: 'warning',
      description: 'Registrations this month'
    },
  ];

  if (loading) {
    return (
      <Row className="mb-4">
        {statCards.map((stat, index) => (
          <Col key={index} md={3} className="mb-3">
            <Card className="stats-card h-100">
              <Card.Body className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" variant="success" />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  if (error) {
    return (
      <Row className="mb-4">
        <Col md={12}>
          <Card className="border-warning">
            <Card.Body className="text-center text-warning">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
              <Button 
                variant="outline-warning" 
                size="sm" 
                className="ms-3"
                onClick={fetchStats}
              >
                Retry
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <Row className="mb-4">
      {statCards.map((stat, index) => (
        <Col key={index} xs={6} md={3} className="mb-3">
          <Card className="stats-card h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="card-title text-muted mb-2 small fw-semibold text-uppercase">
                    {stat.title}
                  </h6>
                  <h2 className="fw-bold text-dark mb-1" style={{ fontSize: '2.5rem' }}>
                    {stat.value.toLocaleString()}
                  </h2>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.8rem' }}>
                    {stat.description}
                  </p>
                </div>
                <div className={`bg-${stat.color} rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ms-3`} 
                     style={{width: '70px', height: '70px'}}>
                  <i className={`${stat.icon} text-white fs-3`}></i>
                </div>
              </div>
              
              {/* Progress indicator for better visual appeal */}
              <div className="mt-3">
                <div 
                  className={`bg-${stat.color} rounded`}
                  style={{
                    height: '4px',
                    width: '100%',
                    opacity: 0.3
                  }}
                ></div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsCards;