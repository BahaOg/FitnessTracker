import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import FitnessTracker from './FitnessTracker';

type AppPage = 'landing' | 'app';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');

  // Check if user is already logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If user is logged in, go directly to the app
      setCurrentPage('app');
    }
  }, []);

  const handleNavigateToRegister = () => {
    setCurrentPage('app');
  };

  const handleNavigateToLogin = () => {
    setCurrentPage('app');
  };

  const handleNavigateToLanding = () => {
    setCurrentPage('landing');
  };

  // Listen for logout events to return to landing page
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      if (!token && currentPage === 'app') {
        setCurrentPage('landing');
      }
    };

    // Listen for storage events (when localStorage changes)
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for logout
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (!token && currentPage === 'app') {
        setCurrentPage('landing');
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [currentPage]);

  if (currentPage === 'landing') {
    return (
      <LandingPage 
        onNavigateToRegister={handleNavigateToRegister}
        onNavigateToLogin={handleNavigateToLogin}
      />
    );
  }

  return (
    <FitnessTracker 
      onNavigateToLanding={handleNavigateToLanding}
    />
  );
};

export default App; 