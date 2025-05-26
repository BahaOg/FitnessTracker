import React, { useState, useEffect } from 'react';
import RegisterPage from './RegisterPage';
import ProfilePage from './ProfilePage';
import CalorieCalculator from './CalorieCalculator';
import ProgressDashboard from './ProgressDashboard';
import MyWorkouts from './MyWorkouts';
import './FitnessTracker.css';
import './LoginPage.css';

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  gender: string;
  height: string;
  weight: string;
  birthDate: string;
  GOAL: string;
}

interface Workout {
  _id: string;
  name: string;
  type: string;
  duration: number;
  date: string;
  caloriesBurned?: number;
  notes?: string;
}

interface FitnessTrackerProps {
  onNavigateToLanding?: () => void;
  initialPage?: 'home' | 'register' | 'login';
}

type Page = 'home' | 'register' | 'login' | 'dashboard' | 'profile' | 'calculator' | 'workouts';

// Use relative API URL for both development and production
// The webpack dev server proxy will forward /api requests to localhost:5000 in development
const API_URL = '/api';

const FitnessTracker: React.FC<FitnessTrackerProps> = ({ onNavigateToLanding, initialPage = 'home' }) => {
  const [currentPage, setCurrentPage] = useState<Page>(initialPage);
  const [user, setUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [workoutForm, setWorkoutForm] = useState({
    name: '',
    type: '',
    duration: '',
    date: '',
    caloriesBurned: '',
    notes: ''
  });

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Handle initial page navigation
  useEffect(() => {
    if (initialPage && !isAuthenticated && currentPage === 'home') {
      // Only set initial page if we're currently on home page
      // This prevents overriding user navigation
      setCurrentPage(initialPage);
    }
  }, [initialPage, isAuthenticated]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
      localStorage.setItem('wasLoggedIn', 'true');
      loadWorkouts();
    } else {
      setIsAuthenticated(false);
      // Don't automatically redirect to home - preserve current page
      // Only set to home if we're currently on dashboard (which requires auth)
      if (currentPage === 'dashboard') {
      setCurrentPage('home');
    }
    }
  };

  const handleRegister = async (userData: {
    name: string;
    surname: string;
    email: string;
    password: string;
    gender: string;
    height: string;
    weight: string;
    birthDate: string;
    GOAL: string;
  }) => {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        alert(data.message);
        return false;
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('wasLoggedIn', 'true');
      checkAuth();
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration');
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        alert(data.message);
        return;
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('wasLoggedIn', 'true');
      setLoginForm({ email: '', password: '' });
      checkAuth();
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('wasLoggedIn');
    setUser(null);
    setIsAuthenticated(false);
    setWorkouts([]);
    setCurrentPage('home');
    if (onNavigateToLanding) {
      onNavigateToLanding();
    }
  };

  const loadWorkouts = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) return;
    
    try {
      const response = await fetch(`${API_URL}/workouts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!data.success) {
        alert(data.message);
        return;
      }
      
      setWorkouts(data.workouts);
    } catch (error) {
      console.error('Load workouts error:', error);
      alert('An error occurred while loading workouts');
    }
  };

  const handleAddWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const response = await fetch(`${API_URL}/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...workoutForm,
          duration: parseInt(workoutForm.duration),
          caloriesBurned: workoutForm.caloriesBurned ? parseInt(workoutForm.caloriesBurned) : 0,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        alert(data.message);
        return;
      }
      
      setWorkoutForm({
        name: '',
        type: '',
        duration: '',
        date: '',
        caloriesBurned: '',
        notes: ''
      });
      loadWorkouts();
    } catch (error) {
      console.error('Add workout error:', error);
      alert('An error occurred while adding the workout');
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
    const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/workouts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!data.success) {
        alert(data.message);
        return;
      }
      
      // Remove workout from state
      setWorkouts(workouts.filter(workout => workout._id !== id));
    } catch (error) {
      console.error('Delete workout error:', error);
      alert('An error occurred while deleting the workout');
    }
  };

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const renderNavbar = () => (
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
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}
                  >
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setCurrentPage('register'); }}
                  >
                    Register
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setCurrentPage('login'); }}
                  >
                    Login
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setCurrentPage('dashboard'); loadWorkouts(); }}
                  >
                    Dashboard
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setCurrentPage('workouts'); loadWorkouts(); }}
                  >
                    Workouts
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setCurrentPage('calculator'); }}
                  >
                    Calorie Calculator
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setCurrentPage('profile'); }}
                  >
                    Profile
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handleLogout(); }}
                  >
                    Logout
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );

  const renderHomePage = () => (
    <div className="home-main-container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: 600, width: '100%', borderRadius: 24, background: '#fff' }}>
        <h1 className="display-4 fw-bold text-center mb-2">Welcome to Fitness Tracker</h1>
        <p className="lead text-center mb-4">Track your workouts, set goals, and improve your fitness level</p>
        <p className="text-center mb-4">Register or login to get started with your fitness journey</p>
        <div className="row text-center mb-4">
          <div className="col-4">
            <div>
              <span style={{ fontSize: 40, color: '#3b82f6' }} role="img" aria-label="dumbbell">🏋️‍♂️</span>
              <h5 className="mt-2 mb-1">Track Workouts</h5>
              <div style={{ fontSize: 14, color: '#6b7280' }}>Log your exercises, duration, and calories burned</div>
            </div>
          </div>
          <div className="col-4">
            <div>
              <span style={{ fontSize: 40, color: '#22c55e' }} role="img" aria-label="progress">📈</span>
              <h5 className="mt-2 mb-1">Monitor Progress</h5>
              <div style={{ fontSize: 14, color: '#6b7280' }}>View your fitness journey with detailed statistics</div>
            </div>
          </div>
          <div className="col-4">
            <div>
              <span style={{ fontSize: 40, color: '#f59e42' }} role="img" aria-label="target">🎯</span>
              <h5 className="mt-2 mb-1">Set Goals</h5>
              <div style={{ fontSize: 14, color: '#6b7280' }}>Create and achieve your personal fitness targets</div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center gap-3 mb-4">
          <button 
            className="btn btn-primary btn-lg px-4"
            onClick={() => setCurrentPage('register')}
          >
            Get Started - Register
          </button>
          <button 
            className="btn btn-outline-primary btn-lg px-4"
            onClick={() => setCurrentPage('login')}
          >
            Login
          </button>
        </div>
        <div className="card mt-3 p-3" style={{ borderRadius: 16, background: '#f8fafc' }}>
          <div className="d-flex align-items-center mb-2">
            <span style={{ fontSize: 24, marginRight: 10 }} role="img" aria-label="analytics">📊</span>
            <h5 className="mb-0">Detailed Analytics</h5>
          </div>
          <div style={{ color: '#6b7280', fontSize: 15 }}>
            Track your progress with comprehensive workout history, duration tracking, and calorie burn calculations.
          </div>
        </div>
      </div>
    </div>
  );

  const renderRegisterPage = () => (
    <RegisterPage 
      onRegisterSuccess={handleRegister}
      onBack={() => onNavigateToLanding ? onNavigateToLanding() : setCurrentPage('home')}
    />
  );

  const renderLoginPage = () => (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <button 
            className="back-button"
            onClick={() => onNavigateToLanding ? onNavigateToLanding() : setCurrentPage('home')}
            type="button"
          >
            ← Go Back
          </button>
        </div>
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to continue your fitness journey</p>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
          <input 
            type="email" 
            id="login-email" 
                name="email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                placeholder="Enter your email address"
            required 
          />
        </div>
            
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
          <input 
            type="password" 
            id="login-password" 
                name="password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                placeholder="Enter your password"
            required 
          />
            </div>
          </div>
          
          <button type="submit" className="login-button">
            Sign In
          </button>
          
          <div className="login-footer">
            <p>Don't have an account? 
              <button 
                type="button"
                className="link-button"
                onClick={() => setCurrentPage('register')}
              >
                Create Account
              </button>
            </p>
          </div>
              </form>
      </div>
    </div>
  );

  const renderWorkoutsPage = () => (
    <MyWorkouts />
  );

  const renderDashboardPage = () => {
    if (!user) return null;
    return (
      <ProgressDashboard 
        user={user} 
        workouts={workouts}
      />
    );
  };

  const renderProfilePage = () => {
    if (!user) return null;
    return (
      <ProfilePage 
        user={user} 
        onProfileUpdate={handleProfileUpdate}
      />
    );
  };

  const renderCalorieCalculatorPage = () => {
    if (!user) return null;
    return (
      <CalorieCalculator 
        user={user} 
      />
    );
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return renderHomePage();
      case 'register':
        return renderRegisterPage();
      case 'login':
        return renderLoginPage();
      case 'dashboard':
        return renderDashboardPage();
      case 'workouts':
        return renderWorkoutsPage();
      case 'profile':
        return renderProfilePage();
      case 'calculator':
        return renderCalorieCalculatorPage();
      default:
        return renderHomePage();
    }
  };

  return (
    <>
      {currentPage !== 'register' && currentPage !== 'login' && renderNavbar()}
      {currentPage === 'register' || currentPage === 'login' ? (
        renderCurrentPage()
      ) : (
      <div className="container my-5">
        {renderCurrentPage()}
      </div>
      )}
    </>
  );
};

export default FitnessTracker; 