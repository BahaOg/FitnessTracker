// DOM Elements
const homePage = document.getElementById('home-page');
const registerPage = document.getElementById('register-page');
const loginPage = document.getElementById('login-page');
const dashboardPage = document.getElementById('dashboard-page');

const navHome = document.getElementById('nav-home');
const navRegister = document.getElementById('nav-register');
const navLogin = document.getElementById('nav-login');
const navDashboard = document.getElementById('nav-dashboard');
const navLogout = document.getElementById('nav-logout');

const homeRegisterBtn = document.getElementById('home-register-btn');
const homeLoginBtn = document.getElementById('home-login-btn');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const workoutForm = document.getElementById('workout-form');
const workoutsList = document.getElementById('workouts-list');
const addWorkoutBtn = document.getElementById('add-workout-btn');

// API URL
const API_URL = 'http://localhost:5000/api';

// Check if user is logged in
const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    showPage(dashboardPage);
    navHome.classList.add('d-none');
    navRegister.classList.add('d-none');
    navLogin.classList.add('d-none');
    navDashboard.classList.remove('d-none');
    navLogout.classList.remove('d-none');
    loadWorkouts();
  } else {
    showPage(homePage);
    navHome.classList.remove('d-none');
    navRegister.classList.remove('d-none');
    navLogin.classList.remove('d-none');
    navDashboard.classList.add('d-none');
    navLogout.classList.add('d-none');
  }
};

// Show a specific page
const showPage = (page) => {
  [homePage, registerPage, loginPage, dashboardPage].forEach(p => {
    if (p === page) {
      p.classList.remove('d-none');
    } else {
      p.classList.add('d-none');
    }
  });
};

// Navigation
navHome.addEventListener('click', (e) => {
  e.preventDefault();
  showPage(homePage);
});

navRegister.addEventListener('click', (e) => {
  e.preventDefault();
  showPage(registerPage);
});

navLogin.addEventListener('click', (e) => {
  e.preventDefault();
  showPage(loginPage);
});

navDashboard.addEventListener('click', (e) => {
  e.preventDefault();
  showPage(dashboardPage);
  loadWorkouts();
});

navLogout.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  checkAuth();
});

homeRegisterBtn.addEventListener('click', () => {
  showPage(registerPage);
});

homeLoginBtn.addEventListener('click', () => {
  showPage(loginPage);
});

// Register user
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      alert(data.message);
      return;
    }
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    checkAuth();
  } catch (error) {
    console.error('Registration error:', error);
    alert('An error occurred during registration');
  }
});

// Login user
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      alert(data.message);
      return;
    }
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    checkAuth();
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login');
  }
});

// Load user workouts
const loadWorkouts = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return;
  }
  
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
    
    renderWorkouts(data.workouts);
  } catch (error) {
    console.error('Load workouts error:', error);
    alert('An error occurred while loading workouts');
  }
};

// Render workouts list
const renderWorkouts = (workouts) => {
  workoutsList.innerHTML = '';
  
  if (workouts.length === 0) {
    workoutsList.innerHTML = `
      <div class="text-center py-5">
        <p>No workouts found. Add your first workout!</p>
      </div>
    `;
    return;
  }
  
  workouts.forEach((workout) => {
    const date = new Date(workout.date).toLocaleDateString();
    
    const workoutItem = document.createElement('div');
    workoutItem.className = `list-group-item workout-item ${workout.type}`;
    
    workoutItem.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h5>${workout.name}</h5>
          <p class="mb-1">Type: ${workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}</p>
          <p class="mb-1">Duration: ${workout.duration} minutes</p>
          <p class="mb-1">Date: ${date}</p>
          ${workout.caloriesBurned ? `<p class="mb-1">Calories: ${workout.caloriesBurned}</p>` : ''}
          ${workout.notes ? `<p class="text-muted">${workout.notes}</p>` : ''}
        </div>
        <div>
          <button class="btn btn-sm btn-outline-danger delete-workout" data-id="${workout._id}">Delete</button>
        </div>
      </div>
    `;
    
    workoutsList.appendChild(workoutItem);
    
    // Add event listener for delete button
    const deleteBtn = workoutItem.querySelector('.delete-workout');
    deleteBtn.addEventListener('click', () => deleteWorkout(workout._id));
  });
};

// Delete workout
const deleteWorkout = async (id) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return;
  }
  
  if (!confirm('Are you sure you want to delete this workout?')) {
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

// Add workout
workoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const token = localStorage.getItem('token');
  
  if (!token) {
    return;
  }
  
  const name = document.getElementById('workout-name').value;
  const type = document.getElementById('workout-type').value;
  const duration = document.getElementById('workout-duration').value;
  const date = document.getElementById('workout-date').value;
  const caloriesBurned = document.getElementById('workout-calories').value || 0;
  const notes = document.getElementById('workout-notes').value;
  
  try {
    const response = await fetch(`${API_URL}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        type,
        duration,
        date,
        caloriesBurned,
        notes,
      }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      alert(data.message);
      return;
    }
    
    workoutForm.reset();
    loadWorkouts();
  } catch (error) {
    console.error('Add workout error:', error);
    alert('An error occurred while adding the workout');
  }
});

// Initialize app
checkAuth(); 