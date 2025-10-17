// src/context/PlateContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const PlateContext = createContext();

export function PlateProvider({ children }) {
  const [plates, setPlates] = useState([]);

  // Load plates from localStorage on mount
  useEffect(() => {
    const savedPlates = localStorage.getItem('nigerianPlates');
    if (savedPlates) {
      setPlates(JSON.parse(savedPlates));
    }
  }, []);

  // Save plates to localStorage whenever plates change
  useEffect(() => {
    localStorage.setItem('nigerianPlates', JSON.stringify(plates));
  }, [plates]);

  const addPlate = (plateData) => {
    const newPlate = {
      id: Date.now().toString(),
      ...plateData,
      createdAt: new Date().toISOString(),
    };
    setPlates(prev => [...prev, newPlate]);
    return newPlate;
  };

  const updatePlate = (id, plateData) => {
    setPlates(prev => prev.map(plate => 
      plate.id === id ? { ...plate, ...plateData } : plate
    ));
  };

  const deletePlate = (id) => {
    setPlates(prev => prev.filter(plate => plate.id !== id));
  };

  const searchPlates = (query) => {
    return plates.filter(plate => 
      plate.plateNumber.toLowerCase().includes(query.toLowerCase()) ||
      plate.ownerName.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <PlateContext.Provider value={{
      plates,
      addPlate,
      updatePlate,
      deletePlate,
      searchPlates
    }}>
      {children}
    </PlateContext.Provider>
  );
}

export function usePlates() {
  return useContext(PlateContext);
}