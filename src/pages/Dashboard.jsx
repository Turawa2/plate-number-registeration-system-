// src/pages/Dashboard.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCards from '../components/StatsCards';
import PlateTable from '../components/PlateTable';
import PlateForm from '../components/PlateForm';
import { Container, Row, Col } from 'react-bootstrap';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const { logout } = useAuth();

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <div>
            <StatsCards />
            <PlateTable />
          </div>
        );
      case 'register':
        return <PlateForm />;
      case 'plates':
        return <PlateTable />;
      default:
        return <StatsCards />;
    }
  };

  return (
    <div className="d-flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-grow-1 d-flex flex-column">
        <Header onLogout={logout} />
        
        <main className="flex-grow-1 p-4">
          <Container fluid>
            {renderContent()}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;