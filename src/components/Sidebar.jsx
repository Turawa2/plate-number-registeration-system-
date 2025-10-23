import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Nav } from 'react-bootstrap';

const Sidebar = ({ activeView, setActiveView }) => {
  const { logout, admin } = useAuth();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-home' },
    { id: 'register', label: 'Register Plate', icon: 'fas fa-plus' },
    { id: 'plates', label: 'All Plates', icon: 'fas fa-list' },
  ];

  return (
    <div className="sidebar nigerian-green d-flex flex-column" style={{width: '250px', minHeight: '100vh'}}>
      {/* Header */}
      <div className="p-4 border-bottom border-success">
        <div className="d-flex align-items-center">
          <i className="fas fa-car fs-3 me-3"></i>
          <div>
            <h5 className="mb-0 fw-bold">Plate Registry</h5>
            <small className="text-light">Nigeria</small>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <Nav className="flex-column p-3 flex-grow-1">
        {menuItems.map((item) => (
          <Nav.Link
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`mb-2 rounded text-light d-flex align-items-center py-3 ${
              activeView === item.id 
                ? 'bg-success shadow-sm' 
                : 'hover-bg-success text-light-hover'
            }`}
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <i className={`${item.icon} me-3`} style={{width: '20px', textAlign: 'center'}}></i>
            <span className="fw-medium">{item.label}</span>
          </Nav.Link>
        ))}
      </Nav>

      {/* User Info & Logout */}
      <div className="p-3 border-top border-success">
        {admin && (
          <div className="text-light mb-3 px-2">
            <small className="text-light">Logged in as:</small>
            <div className="fw-bold text-truncate">{admin.full_name}</div>
            <small className="text-light">{admin.email}</small>
          </div>
        )}
        
        <button
          onClick={logout}
          className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center py-2"
          style={{
            transition: 'all 0.3s ease'
          }}
        >
          <i className="fas fa-sign-out-alt me-2"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;