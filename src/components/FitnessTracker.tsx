import React, { useState, useEffect } from 'react';
import './FitnessTracker.css';

interface User {
  id: string;
  name: string;
  email: string;
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

type Page = 'home' | 'register' | 'login' | 'dashboard';

// Use relative API URL since frontend and backend are on the same server
const API_URL = '/api';

const FitnessTracker: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Form states
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: ''
  });

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

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
      loadWorkouts();
    } else {
      setIsAuthenticated(false);
      setCurrentPage('home');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerForm),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        alert(data.message);
        return;
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setRegisterForm({ name: '', email: '', password: '' });
      checkAuth();
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration');
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
    setUser(null);
    setIsAuthenticated(false);
    setWorkouts([]);
    setCurrentPage('home');
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
    const token = localStorage.getItem('token');
    if (!token) return;
    
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/workouts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!data.success) {
        alert(data.message);
        return;
      }
      
      loadWorkouts();
    } catch (error) {
      console.error('Delete workout error:', error);
      alert('An error occurred while deleting the workout');
    }
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
    <div className="jumbotron text-center">
      <h1 className="display-4">Welcome to Fitness Tracker</h1>
      <p className="lead">Track your workouts, set goals, and improve your fitness level</p>
      <hr className="my-4" />
      <p>Register or login to get started</p>
      <div>
        <button 
          className="btn btn-primary btn-lg me-2"
          onClick={() => setCurrentPage('register')}
        >
          Register
        </button>
        <button 
          className="btn btn-secondary btn-lg"
          onClick={() => setCurrentPage('login')}
        >
          Login
        </button>
      </div>
    </div>
  );

  const renderRegisterPage = () => (
    <div>
      <h2 className="mb-4">Register</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="register-name" className="form-label">Name</label>
          <input 
            type="text" 
            className="form-control" 
            id="register-name" 
            value={registerForm.name}
            onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="register-email" className="form-label">Email</label>
          <input 
            type="email" 
            className="form-control" 
            id="register-email" 
            value={registerForm.email}
            onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="register-password" className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control" 
            id="register-password" 
            value={registerForm.password}
            onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );

  const renderLoginPage = () => (
    <div>
      <h2 className="mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="login-email" className="form-label">Email</label>
          <input 
            type="email" 
            className="form-control" 
            id="login-email" 
            value={loginForm.email}
            onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="login-password" className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control" 
            id="login-password" 
            value={loginForm.password}
            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );

  const renderWorkoutsList = () => (
    <div className="list-group">
      {workouts.length === 0 ? (
        <div className="text-center py-5">
          <p>No workouts found. Add your first workout!</p>
        </div>
      ) : (
        workouts.map((workout) => (
          <div key={workout._id} className={`list-group-item workout-item ${workout.type}`}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5>{workout.name}</h5>
                <p className="mb-1">Type: {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}</p>
                <p className="mb-1">Duration: {workout.duration} minutes</p>
                <p className="mb-1">Date: {new Date(workout.date).toLocaleDateString()}</p>
                {workout.caloriesBurned && <p className="mb-1">Calories: {workout.caloriesBurned}</p>}
                {workout.notes && <p className="text-muted">{workout.notes}</p>}
              </div>
              <div>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteWorkout(workout._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderDashboardPage = () => (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <div className="row">
        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>My Workouts</h3>
          </div>
          {renderWorkoutsList()}
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              Add New Workout
            </div>
            <div className="card-body">
              <form onSubmit={handleAddWorkout}>
                <div className="mb-3">
                  <label htmlFor="workout-name" className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="workout-name" 
                    value={workoutForm.name}
                    onChange={(e) => setWorkoutForm({...workoutForm, name: e.target.value})}
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="workout-type" className="form-label">Type</label>
                  <select 
                    className="form-select" 
                    id="workout-type" 
                    value={workoutForm.type}
                    onChange={(e) => setWorkoutForm({...workoutForm, type: e.target.value})}
                    required
                  >
                    <option value="">Select workout type</option>
                    <option value="cardio">Cardio</option>
                    <option value="strength">Strength</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="sports">Sports</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="workout-duration" className="form-label">Duration (minutes)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="workout-duration" 
                    value={workoutForm.duration}
                    onChange={(e) => setWorkoutForm({...workoutForm, duration: e.target.value})}
                    required 
                    min="1" 
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="workout-date" className="form-label">Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    id="workout-date" 
                    value={workoutForm.date}
                    onChange={(e) => setWorkoutForm({...workoutForm, date: e.target.value})}
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="workout-calories" className="form-label">Calories Burned</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="workout-calories" 
                    value={workoutForm.caloriesBurned}
                    onChange={(e) => setWorkoutForm({...workoutForm, caloriesBurned: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="workout-notes" className="form-label">Notes</label>
                  <textarea 
                    className="form-control" 
                    id="workout-notes" 
                    rows={3}
                    value={workoutForm.notes}
                    onChange={(e) => setWorkoutForm({...workoutForm, notes: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Save Workout</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
      default:
        return renderHomePage();
    }
  };

  return (
    <>
      {renderNavbar()}
      <div className="container my-5">
        {renderCurrentPage()}
      </div>
    </>
  );
};

export default FitnessTracker; 