// src/App.js
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlateProvider } from './context/PlateContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">
      {!isAuthenticated ? <Login /> : <Dashboard />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <PlateProvider>
        <AppContent />
      </PlateProvider>
    </AuthProvider>
  );
}

export default App;