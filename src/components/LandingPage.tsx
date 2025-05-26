import React from 'react';
import './LandingPage.css';

interface LandingPageProps {
  onNavigateToRegister: () => void;
  onNavigateToLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToRegister, onNavigateToLogin }) => {
  return (
    <div className="landing-container">
      <div className="landing-card">
        <h1 className="landing-title">Welcome to Fitness Tracker</h1>
        <p className="landing-subtitle">Track your workouts, set goals, and improve your fitness level</p>
        
        {/* Feature highlights */}
        <div className="features-grid">
          <div className="feature-card">
            <h4>Track Workouts</h4>
            <p>Log your exercises, duration, and calories burned</p>
          </div>
          <div className="feature-card">
            <h4>Monitor Progress</h4>
            <p>View your fitness journey with detailed statistics. Track your progress with comprehensive workout history and calorie burn calculations</p>
          </div>
          <div className="feature-card">
            <h4>Set Goals</h4>
            <p>Create and achieve your personal fitness targets</p>
          </div>
        </div>

        {/* Call to action buttons */}
        <div className="landing-buttons">
          <button 
            className="register-button"
            onClick={onNavigateToRegister}
          >
            Get Started - Register
          </button>
          <button 
            className="login-button"
            onClick={onNavigateToLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 