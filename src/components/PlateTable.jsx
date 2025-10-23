import React, { useState, useEffect } from 'react';
import { Card, Table, Form, Button, InputGroup, Modal, Row, Col, Alert, Spinner } from 'react-bootstrap';

const PlateTable = () => {
  const [plates, setPlates] = useState([]);
  const [filteredPlates, setFilteredPlates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPlate, setEditingPlate] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [plateToDelete, setPlateToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [loading, setLoading] = useState(true);

  // Fetch plates from backend
  const fetchPlates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:9000/api/plates?search=${searchQuery}`);
      const data = await response.json();
      
      if (data.success) {
        setPlates(data.data);
        setFilteredPlates(data.data);
      } else {
        setShowAlert('Failed to fetch plates');
        setAlertVariant('danger');
      }
    } catch (error) {
      console.error('Error fetching plates:', error);
      setShowAlert('Failed to connect to server');
      setAlertVariant('danger');
    } finally {
      setLoading(false);
    }
  };

  // Initial load and listen for plate additions
  useEffect(() => {
    fetchPlates();

    // Listen for plate added event from PlateForm
    const handlePlateAdded = () => {
      fetchPlates();
    };

    window.addEventListener('plateAdded', handlePlateAdded);
    return () => window.removeEventListener('plateAdded', handlePlateAdded);
  }, []);

  // Handle search
  useEffect(() => {
    const searchPlates = async () => {
      if (searchQuery) {
        try {
          const response = await fetch(`http://localhost:9000/api/plates?search=${searchQuery}`);
          const data = await response.json();
          if (data.success) {
            setFilteredPlates(data.data);
          }
        } catch (error) {
          console.error('Search error:', error);
        }
      } else {
        setFilteredPlates(plates);
      }
    };

    const timeoutId = setTimeout(searchPlates, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, plates]);

  const handleEdit = (plate) => {
    setEditingPlate(plate);
    setEditForm({ 
      plate_number: plate.plate_number,
      owner_name: plate.owner_name 
    });
  };

const handleUpdate = async () => {
  try {
   
    const response = await fetch(`http://localhost:9000/api/plates/${editingPlate.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...editForm,
        vehicle_type: editingPlate.vehicle_type,
        state: editingPlate.state,
        registration_date: editingPlate.registration_date // Use the original date format
      }),
    });

    const data = await response.json();

    if (data.success) {
      setEditingPlate(null);
      setEditForm({});
      setShowAlert('Plate updated successfully!');
      setAlertVariant('success');
      fetchPlates(); // Refresh the list
      
      // Notify other components
      window.dispatchEvent(new Event('plateUpdated'));
    } else {
      setShowAlert(data.message || 'Failed to update plate');
      setAlertVariant('danger');
    }
  } catch (error) {
    console.error('Update error:', error);
    setShowAlert('Failed to connect to server');
    setAlertVariant('danger');
  }
  
  setTimeout(() => setShowAlert(''), 3000);
};

  const handleDeleteClick = (plate) => {
    setPlateToDelete(plate);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:9000/api/plates/${plateToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setShowDeleteModal(false);
        setPlateToDelete(null);
        setShowAlert('Plate deleted successfully!');
        setAlertVariant('success');
        fetchPlates(); // Refresh the list
      } else {
        setShowAlert(data.message || 'Failed to delete plate');
        setAlertVariant('danger');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setShowAlert('Failed to connect to server');
      setAlertVariant('danger');
    }
    
    setTimeout(() => setShowAlert(''), 3000);
  };

  const exportToCSV = async () => {
    try {
      const response = await fetch('http://localhost:9000/api/admin/export/csv');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nigerian-plates.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      setShowAlert('Failed to export CSV');
      setAlertVariant('danger');
      setTimeout(() => setShowAlert(''), 3000);
    }
  };

  return (
    <>
      <Card className="border-0 shadow">
        <Card.Header className="bg-white d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <h5 className="mb-2 mb-md-0">
            <i className="fas fa-list me-2"></i>
            Registered Plate Numbers
          </h5>
          
          <div className="d-flex flex-column flex-md-row gap-2 w-100 w-md-auto">
            <InputGroup style={{minWidth: '250px'}}>
              <InputGroup.Text>
                <i className="fas fa-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search plates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
            
            <Button variant="success" onClick={exportToCSV}>
              <i className="fas fa-download me-2"></i>
              Export CSV
            </Button>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          {showAlert && (
            <Alert variant={alertVariant} className="m-3 d-flex align-items-center">
              <i className={`fas ${
                alertVariant === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'
              } me-2`}></i>
              {showAlert}
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
              <p className="mt-2 text-muted">Loading plates...</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Plate Number</th>
                      <th>Owner Name</th>
                      <th>Vehicle Type</th>
                      <th>State</th>
                      <th>Date Registered</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlates.map((plate) => (
                      <tr key={plate.id}>
                        <td>
                          <span className="badge plate-badge bg-success fs-6">
                            {plate.plate_number}
                          </span>
                        </td>
                        <td className="fw-semibold">{plate.owner_name}</td>
                        <td>{plate.vehicle_type}</td>
                        <td>{plate.state}</td>
                        <td>{new Date(plate.registration_date).toLocaleDateString()}</td>
                        <td className="text-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            onClick={() => handleEdit(plate)}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(plate)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {filteredPlates.length === 0 && (
                <div className="text-center py-5">
                  <i className="fas fa-car fs-1 text-muted mb-3"></i>
                  <p className="text-muted fs-5">
                    {searchQuery ? 'No plates found matching your search.' : 'No plate numbers registered yet.'}
                  </p>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Edit Modal */}
      <Modal show={!!editingPlate} onHide={() => setEditingPlate(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-edit me-2"></i>
            Edit Plate Number
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Plate Number</Form.Label>
                <Form.Control
                  type="text"
                  value={editForm.plate_number || ''}
                  onChange={(e) => setEditForm({...editForm, plate_number: e.target.value})}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Owner Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editForm.owner_name || ''}
                  onChange={(e) => setEditForm({...editForm, owner_name: e.target.value})}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditingPlate(null)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete plate number{' '}
          <strong>{plateToDelete?.plate_number}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            <i className="fas fa-trash me-2"></i>
            Delete Plate
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PlateTable;