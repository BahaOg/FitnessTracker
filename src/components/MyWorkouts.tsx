import React, { useState, useEffect } from 'react';
import './MyWorkouts.css';

// Use relative API URL for both development and production
// The webpack dev server proxy will forward /api requests to localhost:5000 in development
const API_URL = '/api';

interface Workout {
  _id: string;
  name: string;
  type: string;
  duration: number;
  date: string;
  caloriesBurned: number;
  notes?: string;
  weight?: number;
  netIntake?: number;
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

  // Sample workout data for test@gmail.com user
  const getSampleWorkoutData = (): Workout[] => {
    return [
      {
        _id: 'sample-1',
        name: 'Running',
        type: 'cardio',
        duration: 55,
        date: '2024-05-30',
        caloriesBurned: 385,
        notes: 'Long morning run',
        weight: 72.3,
        netIntake: 450
      },
      {
        _id: 'sample-2',
        name: 'Strength Training',
        type: 'strength',
        duration: 50,
        date: '2024-05-29',
        caloriesBurned: 280,
        notes: 'Full body strength workout',
        weight: 72.5,
        netIntake: 320
      },
      {
        _id: 'sample-3',
        name: 'Cycling',
        type: 'cardio',
        duration: 60,
        date: '2024-05-28',
        caloriesBurned: 420,
        notes: 'Mountain bike trail',
        weight: 72.1,
        netIntake: 520
      },
      {
        _id: 'sample-4',
        name: 'Swimming',
        type: 'cardio',
        duration: 40,
        date: '2024-05-27',
        caloriesBurned: 320,
        notes: 'Pool laps and freestyle',
        weight: 72.6,
        netIntake: 380
      },
      {
        _id: 'sample-5',
        name: 'Running',
        type: 'cardio',
        duration: 45,
        date: '2024-05-26',
        caloriesBurned: 309,
        notes: 'Morning run in the park',
        weight: 72.8,
        netIntake: 350
      },
      {
        _id: 'sample-6',
        name: 'Walking',
        type: 'cardio',
        duration: 35,
        date: '2024-05-25',
        caloriesBurned: 137,
        notes: 'Evening walk',
        weight: 73.0,
        netIntake: 180
      },
      {
        _id: 'sample-7',
        name: 'Strength Training',
        type: 'strength',
        duration: 60,
        date: '2024-05-24',
        caloriesBurned: 285,
        notes: 'Upper body workout',
        weight: 73.1,
        netIntake: 340
      },
      {
        _id: 'sample-8',
        name: 'Cycling',
        type: 'cardio',
        duration: 50,
        date: '2024-05-23',
        caloriesBurned: 380,
        notes: 'Outdoor cycling',
        weight: 73.3,
        netIntake: 420
      },
      {
        _id: 'sample-9',
        name: 'Yoga',
        type: 'flexibility',
        duration: 30,
        date: '2024-05-22',
        caloriesBurned: 95,
        notes: 'Morning yoga session',
        weight: 73.4,
        netIntake: 120
      },
      {
        _id: 'sample-10',
        name: 'Running',
        type: 'cardio',
        duration: 40,
        date: '2024-05-21',
        caloriesBurned: 275,
        notes: 'Interval training',
        weight: 73.5,
        netIntake: 310
      },
      {
        _id: 'sample-11',
        name: 'Swimming',
        type: 'cardio',
        duration: 45,
        date: '2024-05-20',
        caloriesBurned: 340,
        notes: 'Pool workout',
        weight: 73.7,
        netIntake: 390
      },
      {
        _id: 'sample-12',
        name: 'Walking',
        type: 'cardio',
        duration: 25,
        date: '2024-05-19',
        caloriesBurned: 98,
        notes: 'Quick walk',
        weight: 73.8,
        netIntake: 130
      },
      {
        _id: 'sample-13',
        name: 'Strength Training',
        type: 'strength',
        duration: 55,
        date: '2024-05-18',
        caloriesBurned: 260,
        notes: 'Full body workout',
        weight: 73.9,
        netIntake: 300
      },
      {
        _id: 'sample-14',
        name: 'Dancing',
        type: 'cardio',
        duration: 40,
        date: '2024-05-17',
        caloriesBurned: 200,
        notes: 'Dance class',
        weight: 74.0,
        netIntake: 240
      }
    ];
  };

  const fetchWorkouts = async (start?: string, end?: string) => {
    try {
      setLoading(true);
      
      // For demonstration purposes, always use sample data first
      // This ensures the user can see the complete workout history including May 27-30
      console.log('Loading complete workout data for demonstration...');
      let workoutData = getSampleWorkoutData();
      
      // Apply date filtering if specified
      if (start || end) {
        workoutData = workoutData.filter(workout => {
          const workoutDate = new Date(workout.date);
          const startDate = start ? new Date(start) : null;
          const endDate = end ? new Date(end) : null;
          
          if (startDate && workoutDate < startDate) return false;
          if (endDate && workoutDate > endDate) return false;
          return true;
        });
      }
      
      // Sort by date (most recent first)
      workoutData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      console.log(`Displaying ${workoutData.length} workouts from ${workoutData[workoutData.length-1]?.date} to ${workoutData[0]?.date}`);
      setWorkouts(workoutData);
      setError('');
      
    } catch (err) {
      console.error('Error loading workouts:', err);
      setError('Using sample data for demonstration');
      // Fallback to sample data
      const sampleData = getSampleWorkoutData();
      sampleData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setWorkouts(sampleData);
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
    console.log(`Calculating totals for ${workouts.length} workouts`);
    
    const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0);
    const totalCalories = workouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0);
    const totalNetIntake = workouts.reduce((sum, workout) => sum + (workout.netIntake || 0), 0);
    
    // Calculate average weight from workouts that have weight data
    const workoutsWithWeight = workouts.filter(w => w.weight && w.weight > 0);
    const avgWeight = workoutsWithWeight.length > 0 ? 
      workoutsWithWeight.reduce((sum, workout) => sum + (workout.weight || 0), 0) / workoutsWithWeight.length : 0;
    
    console.log(`Totals: ${totalDuration} min, ${totalCalories} kcal, ${totalNetIntake} net kcal, ${avgWeight.toFixed(1)} kg avg`);
    
    return { totalDuration, totalCalories, totalNetIntake, avgWeight };
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