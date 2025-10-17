// src/components/Sidebar.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Nav } from 'react-bootstrap';

const Sidebar = ({ activeView, setActiveView }) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-home' },
    { id: 'register', label: 'Register Plate', icon: 'fas fa-plus' },
    { id: 'plates', label: 'All Plates', icon: 'fas fa-list' },
  ];

  return (
    <div className="sidebar nigerian-green" style={{width: '250px'}}>
      <div className="p-4 border-bottom border-success">
        <div className="d-flex align-items-center">
          <i className="fas fa-car fs-3 me-3"></i>
          <div>
            <h5 className="mb-0 fw-bold">Plate Registry</h5>
            <small className="text-light">Nigeria</small>
          </div>
        </div>
      </div>

      <Nav className="flex-column p-3">
        {menuItems.map((item) => (
          <Nav.Link
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`mb-2 rounded text-light d-flex align-items-center ${
              activeView === item.id ? 'bg-success' : 'hover-bg-success'
            }`}
            style={{cursor: 'pointer'}}
          >
            <i className={`${item.icon} me-3`} style={{width: '20px'}}></i>
            <span>{item.label}</span>
          </Nav.Link>
        ))}
      </Nav>

      <div className="p-3 border-top border-success mt-auto">
        <button
          onClick={logout}
          className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
        >
          <i className="fas fa-sign-out-alt me-2"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;