import React from 'react';
import './FitnessTracker.css';

interface LandingPageProps {
  onNavigateToRegister: () => void;
  onNavigateToLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToRegister, onNavigateToLogin }) => {
  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand" href="#" onClick={(e) => e.preventDefault()}>
            Fitness Tracker
          </a>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a 
                  className="nav-link" 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); }}
                >
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className="nav-link" 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); onNavigateToRegister(); }}
                >
                  Register
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className="nav-link" 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); onNavigateToLogin(); }}
                >
                  Login
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Landing Content */}
      <div className="container my-5">
        <div className="jumbotron text-center">
          <h1 className="display-4">Welcome to Fitness Tracker</h1>
          <p className="lead">Track your workouts, set goals, and improve your fitness level</p>
          <hr className="my-4" />
          <p>Register or login to get started with your fitness journey</p>
          
          {/* Feature highlights */}
          <div className="row mt-5 mb-4">
            <div className="col-md-4">
              <div className="feature-card">
                <i className="fas fa-dumbbell fa-3x text-primary mb-3"></i>
                <h4>Track Workouts</h4>
                <p>Log your exercises, duration, and calories burned</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <i className="fas fa-chart-line fa-3x text-success mb-3"></i>
                <h4>Monitor Progress</h4>
                <p>View your fitness journey with detailed statistics</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <i className="fas fa-target fa-3x text-warning mb-3"></i>
                <h4>Set Goals</h4>
                <p>Create and achieve your personal fitness targets</p>
              </div>
            </div>
          </div>

          {/* Call to action buttons */}
          <div className="d-flex justify-content-center gap-3">
            <button 
              className="btn btn-primary btn-lg px-4"
              onClick={onNavigateToRegister}
            >
              Get Started - Register
            </button>
            <button 
              className="btn btn-outline-primary btn-lg px-4"
              onClick={onNavigateToLogin}
            >
              Login
            </button>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="row mt-5">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">🏃‍♂️ Multiple Workout Types</h5>
                <p className="card-text">
                  Support for various workout categories including cardio, strength training, 
                  flexibility exercises, sports activities, and more.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">📊 Detailed Analytics</h5>
                <p className="card-text">
                  Track your progress with comprehensive workout history, 
                  duration tracking, and calorie burn calculations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage; 