import React, { useState, useEffect } from 'react';
import './MyWorkouts.css';

const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : '/api';

interface Workout {
  _id: string;
  name: string;
  type: string;
  duration: number;
  date: string;
  caloriesBurned: number;
  notes?: string;
}

interface MyWorkoutsProps {
  // onBack prop is no longer needed since navigation is handled by navbar
}

const MyWorkouts: React.FC<MyWorkoutsProps> = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchWorkouts = async (start?: string, end?: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found');
        return;
      }

      let url = `${API_URL}/workouts`;
      const params = new URLSearchParams();
      
      if (start) params.append('startDate', start);
      if (end) params.append('endDate', end);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch workouts');
      }

      const data = await response.json();
      setWorkouts(data.workouts || []);
      setError('');
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError('Failed to load workouts');
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleDateRangeChange = () => {
    fetchWorkouts(startDate, endDate);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateTotals = () => {
    const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0);
    const totalCalories = workouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0);
    return { totalDuration, totalCalories };
  };

  const { totalDuration, totalCalories } = calculateTotals();

  return (
    <div className="my-workouts">
      <div className="my-workouts-container">
        <div className="my-workouts-header">
          <h1 className="my-workouts-title">My Workouts</h1>
        </div>

        <div className="date-filters">
          <div className="date-input-group">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input from-date"
              placeholder="From"
            />
            <span className="date-label">From</span>
          </div>
          
          <div className="date-input-group">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input to-date"
              placeholder="To"
            />
            <span className="date-label">To</span>
          </div>
          
          <button 
            className="filter-button"
            onClick={handleDateRangeChange}
          >
            Filter
          </button>
        </div>

        <div className="workouts-table-container">
          {loading ? (
            <div className="loading">Loading workouts...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div className="workouts-table">
              <div className="table-header">
                <div className="header-cell">Date</div>
                <div className="header-cell">Exercise</div>
                <div className="header-cell">Duration</div>
                <div className="header-cell">Calories Burned</div>
              </div>
              
              {workouts.length === 0 ? (
                <div className="no-workouts">
                  No workouts found for the selected date range.
                </div>
              ) : (
                <>
                  {workouts.map((workout) => (
                    <div key={workout._id} className="table-row">
                      <div className="table-cell">{formatDate(workout.date)}</div>
                      <div className="table-cell">{workout.name}</div>
                      <div className="table-cell">{workout.duration} min</div>
                      <div className="table-cell">{workout.caloriesBurned} kcal</div>
                    </div>
                  ))}
                  
                  <div className="table-row total-row">
                    <div className="table-cell total-label">Total</div>
                    <div className="table-cell"></div>
                    <div className="table-cell total-value">{totalDuration} min</div>
                    <div className="table-cell total-value">{totalCalories} kcal</div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyWorkouts; 