import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import FitnessTracker from './FitnessTracker';

type AppPage = 'landing' | 'app';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [initialAppPage, setInitialAppPage] = useState<'home' | 'register' | 'login'>('home');

  // Check if user is already logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If user is logged in, go directly to the app
      setCurrentPage('app');
    }
  }, []);

  const handleNavigateToRegister = () => {
    setInitialAppPage('register');
    setCurrentPage('app');
  };

  const handleNavigateToLogin = () => {
    setInitialAppPage('login');
    setCurrentPage('app');
  };

  const handleNavigateToLanding = () => {
    setCurrentPage('landing');
  };

  // Listen for logout events to return to landing page
  useEffect(() => {
    const handleStorageChange = () => {
      // Only listen for actual logout events, not just absence of token
      // This prevents redirecting users who are on public pages like register
    };

    // Listen for storage events (when localStorage changes)
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
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
      initialPage={initialAppPage}
    />
  );
};

export default App; 