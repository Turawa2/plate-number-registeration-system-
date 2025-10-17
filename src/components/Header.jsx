// src/components/Header.js
import React from 'react';
import { Form, InputGroup, Navbar, Container, Nav } from 'react-bootstrap';

const Header = ({ onLogout }) => {
  return (
    <Navbar bg="white" className="border-bottom shadow-sm">
      <Container fluid>
        <Navbar.Brand className="fw-bold text-success">
          Nigerian Plate Number Registration System
        </Navbar.Brand>
        
        <Nav className="ms-auto d-flex align-items-center">
          <Form className="me-3">
            <InputGroup>
              <InputGroup.Text>
                <i className="fas fa-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search plates or owners..."
                style={{minWidth: '300px'}}
              />
            </InputGroup>
          </Form>
          
          <div className="d-flex align-items-center">
            <button className="btn btn-light position-relative me-3">
              <i className="fas fa-bell"></i>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                <span className="visually-hidden">New alerts</span>
              </span>
            </button>
            
            <div className="d-flex align-items-center">
              <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-2" 
                   style={{width: '40px', height: '40px'}}>
                <i className="fas fa-user text-white"></i>
              </div>
              <div>
                <div className="fw-bold text-dark">Admin User</div>
                <small className="text-muted">Plate Registry</small>
              </div>
            </div>
          </div>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;