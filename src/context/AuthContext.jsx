import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const savedAdmin = localStorage.getItem('plateAdmin');
    if (savedAdmin) {
      try {
        const adminData = JSON.parse(savedAdmin);
        setAdmin(adminData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved admin data:', error);
        localStorage.removeItem('plateAdmin');
      }
    }
    setLoading(false);
  }, []);

  const login = (adminData) => {
    setAdmin(adminData);
    setIsAuthenticated(true);
    localStorage.setItem('plateAdmin', JSON.stringify(adminData));
  };

  const logout = () => {
    setAdmin(null);
    setIsAuthenticated(false);
    localStorage.removeItem('plateAdmin');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      admin,
      login, 
      logout,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}