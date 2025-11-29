
import React, { createContext, useContext, useState, useEffect } from 'react';
import { INDIAN_CITIES } from '../constants';

interface LocationContextType {
  location: string;
  setLocation: (loc: string) => void;
  detectLocation: () => Promise<void>;
  isLocating: boolean;
}

const LocationContext = createContext<LocationContextType>({
  location: 'Mumbai',
  setLocation: () => {},
  detectLocation: async () => {},
  isLocating: false,
});

export const useLocationContext = () => useContext(LocationContext);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState(() => localStorage.getItem('escape_location') || 'Mumbai');
  const [isLocating, setIsLocating] = useState(false);

  const setLocation = (loc: string) => {
    setLocationState(loc);
    localStorage.setItem('escape_location', loc);
  };

  const detectLocation = async () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    // Simulate geolocation delay and mapping to nearest supported city
    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock logic: randomly select a city to simulate "detection" for this demo
          // In a real app, we would reverse geocode lat/lng
          setTimeout(() => {
            const randomCity = INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];
            setLocation(randomCity);
            setIsLocating(false);
            resolve();
          }, 1500);
        },
        (error) => {
          console.error("Error detecting location", error);
          alert("Unable to retrieve your location");
          setIsLocating(false);
          resolve();
        }
      );
    });
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, detectLocation, isLocating }}>
      {children}
    </LocationContext.Provider>
  );
};
