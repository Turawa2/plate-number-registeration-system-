// src/components/PlateTable.js
import React, { useState } from 'react';
import { usePlates } from '../context/PlateContext';
import { Card, Table, Form, Button, InputGroup, Modal, Row, Col, Alert } from 'react-bootstrap';

const PlateTable = () => {
  const { plates, deletePlate, updatePlate, searchPlates } = usePlates();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPlate, setEditingPlate] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [plateToDelete, setPlateToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState('');

  const filteredPlates = searchQuery ? searchPlates(searchQuery) : plates;

  const handleEdit = (plate) => {
    setEditingPlate(plate);
    setEditForm({ ...plate });
  };

  const handleUpdate = () => {
    updatePlate(editingPlate.id, editForm);
    setEditingPlate(null);
    setEditForm({});
    setShowAlert('Plate updated successfully!');
    setTimeout(() => setShowAlert(''), 3000);
  };

  const handleDeleteClick = (plate) => {
    setPlateToDelete(plate);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    deletePlate(plateToDelete.id);
    setShowDeleteModal(false);
    setPlateToDelete(null);
    setShowAlert('Plate deleted successfully!');
    setTimeout(() => setShowAlert(''), 3000);
  };

  const exportToCSV = () => {
    const headers = ['Plate Number', 'Owner Name', 'Vehicle Type', 'State', 'Date Registered'];
    const csvData = plates.map(plate => [
      plate.plateNumber,
      plate.ownerName,
      plate.vehicleType,
      plate.state,
      new Date(plate.date).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nigerian-plates.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Card className="border-0 shadow">
        <Card.Header className="bg-white d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <h5 className="mb-2 mb-md-0">Registered Plate Numbers</h5>
          
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
            <Alert variant="success" className="m-3 d-flex align-items-center">
              <i className="fas fa-check-circle me-2"></i>
              {showAlert}
            </Alert>
          )}

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
                        {plate.plateNumber}
                      </span>
                    </td>
                    <td className="fw-semibold">{plate.ownerName}</td>
                    <td>{plate.vehicleType}</td>
                    <td>{plate.state}</td>
                    <td>{new Date(plate.date).toLocaleDateString()}</td>
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
        </Card.Body>
      </Card>

      {/* Edit Modal */}
      <Modal show={!!editingPlate} onHide={() => setEditingPlate(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Plate Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Plate Number</Form.Label>
                <Form.Control
                  type="text"
                  value={editForm.plateNumber || ''}
                  onChange={(e) => setEditForm({...editForm, plateNumber: e.target.value})}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Owner Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editForm.ownerName || ''}
                  onChange={(e) => setEditForm({...editForm, ownerName: e.target.value})}
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
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete plate number{' '}
          <strong>{plateToDelete?.plateNumber}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete Plate
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PlateTable;