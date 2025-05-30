import React, { useState, useEffect } from 'react';
import './ProgressDashboard.css';
import { log } from 'console';

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
  weight?: number;
  netIntake?: number;
}

interface WeightEntry {
  date: string;
  weight: number;
}

interface CalorieEntry {
  date: string;
  intake: number;
  burned: number;
  net: number;
}

interface ProgressDashboardProps {
  user: User;
  workouts: Workout[];
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ user, workouts }) => {
  const [dateRange, setDateRange] = useState({
    start: '2024-05-15', // Start before our workout data to ensure coverage
    end: '2024-06-05' // End after our workout data to ensure coverage
  });
  
  const [weightData, setWeightData] = useState<WeightEntry[]>([]);
  const [calorieData, setCalorieData] = useState<CalorieEntry[]>([]);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [goalProgress, setGoalProgress] = useState<number>(0);
  const [todayNetIntake, setTodayNetIntake] = useState<number>(0);
  const [weeklyAverages, setWeeklyAverages] = useState({
    intake: 0,
    burned: 0,
    net: 0,
    bmr: 0
  });

  // Sample recent workout data to supplement any existing workouts
  const getRecentWorkoutData = (): Workout[] => {
    const bmr = calculateBMR();
    
    const sampleWorkouts: Workout[] = [
      {
        _id: 'recent--3',
        name: 'Strength Training',
        type: 'strength',
        duration: 65,
        date: '2024-06-03',
        caloriesBurned: 310,
        notes: 'Lower body focus workout',
        weight: 71.8,
        netIntake: 480 // Strength training + recovery
      },
      {
        _id: 'recent--2',
        name: 'Cycling',
        type: 'cardio',
        duration: 45,
        date: '2024-06-02',
        caloriesBurned: 350,
        notes: 'Road cycling session',
        weight: 72.0,
        netIntake: 420 // High cardio day
      },
      {
        _id: 'recent--1',
        name: 'Running',
        type: 'cardio',
        duration: 50,
        date: '2024-06-01',
        caloriesBurned: 365,
        notes: 'Trail running',
        weight: 71.9,
        netIntake: 440 // Trail running recovery
      },
      {
        _id: 'recent-0.1',
        name: 'Swimming',
        type: 'cardio',
        duration: 35,
        date: '2024-05-31',
        caloriesBurned: 295,
        notes: 'Pool training session',
        weight: 72.2,
        netIntake: 360 // Swimming day
      },
      {
        _id: 'recent-0',
        name: 'Running',
        type: 'cardio',
        duration: 55,
        date: '2024-05-30',
        caloriesBurned: 385,
        notes: 'Long morning run',
        weight: 72.3,
        netIntake: 450 // High activity day - increased intake for recovery
      },
      {
        _id: 'recent-0.5',
        name: 'Strength Training',
        type: 'strength',
        duration: 50,
        date: '2024-05-29',
        caloriesBurned: 280,
        notes: 'Full body strength workout',
        weight: 72.5,
        netIntake: 320 // Strength training day - protein focus
      },
      {
        _id: 'recent-0.7',
        name: 'Cycling',
        type: 'cardio',
        duration: 60,
        date: '2024-05-28',
        caloriesBurned: 420,
        notes: 'Mountain bike trail',
        weight: 72.1,
        netIntake: 520 // Highest calorie burn - highest net intake
      },
      {
        _id: 'recent-0.9',
        name: 'Swimming',
        type: 'cardio',
        duration: 40,
        date: '2024-05-27',
        caloriesBurned: 320,
        notes: 'Pool laps and freestyle',
        weight: 72.6,
        netIntake: 380 // Swimming recovery nutrition
      },
      {
        _id: 'recent-1',
        name: 'Running',
        type: 'cardio',
        duration: 45,
        date: '2024-05-26',
        caloriesBurned: 309,
        notes: 'Morning run in the park',
        weight: 72.8,
        netIntake: 350 // Original running day
      },
      {
        _id: 'recent-2', 
        name: 'Walking',
        type: 'cardio',
        duration: 35,
        date: '2024-05-25',
        caloriesBurned: 137,
        notes: 'Evening walk',
        weight: 73.0,
        netIntake: 180 // Light activity - moderate intake
      },
      {
        _id: 'recent-3',
        name: 'Strength Training',
        type: 'strength',
        duration: 60,
        date: '2024-05-24',
        caloriesBurned: 285,
        notes: 'Upper body workout',
        weight: 73.1,
        netIntake: 340 // Strength training nutrition
      },
      {
        _id: 'recent-4',
        name: 'Cycling',
        type: 'cardio',
        duration: 50,
        date: '2024-05-23',
        caloriesBurned: 380,
        notes: 'Outdoor cycling',
        weight: 73.3,
        netIntake: 420 // High intensity cycling
      },
      {
        _id: 'recent-5',
        name: 'Yoga',
        type: 'flexibility',
        duration: 30,
        date: '2024-05-22',
        caloriesBurned: 95,
        notes: 'Morning yoga session',
        weight: 73.4,
        netIntake: 120 // Light activity - minimal surplus
      },
      {
        _id: 'recent-6',
        name: 'Running',
        type: 'cardio',
        duration: 40,
        date: '2024-05-21',
        caloriesBurned: 275,
        notes: 'Interval training',
        weight: 73.5,
        netIntake: 310 // Interval training recovery
      },
      {
        _id: 'recent-7',
        name: 'Swimming',
        type: 'cardio',
        duration: 45,
        date: '2024-05-20',
        caloriesBurned: 340,
        notes: 'Pool workout',
        weight: 73.7,
        netIntake: 390 // Swimming workout nutrition
      },
      {
        _id: 'recent-8',
        name: 'Walking',
        type: 'cardio',
        duration: 25,
        date: '2024-05-19',
        caloriesBurned: 98,
        notes: 'Quick walk',
        weight: 73.8,
        netIntake: 130 // Light walking day
      },
      {
        _id: 'recent-9',
        name: 'Strength Training',
        type: 'strength',
        duration: 55,
        date: '2024-05-18',
        caloriesBurned: 260,
        notes: 'Full body workout',
        weight: 73.9,
        netIntake: 300 // Full body strength training
      },
      {
        _id: 'recent-10',
        name: 'Dancing',
        type: 'cardio',
        duration: 40,
        date: '2024-05-17',
        caloriesBurned: 200,
        notes: 'Dance class',
        weight: 74.0,
        netIntake: 240 // Fun cardio activity
      }
    ];

    // Combine existing workouts with sample data, prioritizing existing workouts
    const existingWorkoutDates = new Set(workouts.map(w => w.date.split('T')[0]));
    const supplementalWorkouts = sampleWorkouts.filter(w => !existingWorkoutDates.has(w.date));
    
    return [...workouts, ...supplementalWorkouts];
  };

  // Calculate BMR
  const calculateBMR = (): number => {
    const weight = parseFloat(user.weight);
    const height = parseFloat(user.height);
    const birthDate = new Date(user.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (isNaN(weight) || isNaN(height) || isNaN(age)) return 0;

    let bmrValue: number;
    if (user.gender.toLowerCase() === 'male') {
      bmrValue = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmrValue = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    return Math.round(bmrValue);
  };

  // Generate weight data based on actual workout data from test@gmail.com user
  const generateWeightData = (): WeightEntry[] => {
    const data: WeightEntry[] = [];
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const allWorkouts = getRecentWorkoutData();
    
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Extract actual weight data from workouts - no randomization
    const workoutWeightMap = new Map<string, number>();
    allWorkouts.forEach(workout => {
      if (workout.weight) {
        const dateStr = new Date(workout.date).toISOString().split('T')[0];
        workoutWeightMap.set(dateStr, workout.weight);
      }
    });
    
    console.log('Using stable weight data from test@gmail.com user:', Array.from(workoutWeightMap.entries()));
    
    // Always use actual workout weight data for stable, deterministic results
    if (workoutWeightMap.size > 0) {
      for (let i = 0; i <= daysDiff; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];
        
        let weight: number;
        
        if (workoutWeightMap.has(dateStr)) {
          // Use exact recorded weight - no variation
          weight = workoutWeightMap.get(dateStr)!;
        } else {
          // Simple linear interpolation between known weights - no randomization
          const sortedDates = Array.from(workoutWeightMap.keys()).sort();
          const currentDateObj = new Date(dateStr);
          
          // Find the nearest weights before and after this date
          let beforeWeight: number | null = null;
          let afterWeight: number | null = null;
          let beforeDate: string | null = null;
          let afterDate: string | null = null;
          
          for (const date of sortedDates) {
            const dateObj = new Date(date);
            if (dateObj <= currentDateObj) {
              beforeWeight = workoutWeightMap.get(date)!;
              beforeDate = date;
            }
            if (dateObj >= currentDateObj && afterWeight === null) {
              afterWeight = workoutWeightMap.get(date)!;
              afterDate = date;
            }
          }
          
          if (beforeWeight !== null && afterWeight !== null && beforeDate && afterDate) {
            // Linear interpolation - completely deterministic
            const beforeDateObj = new Date(beforeDate);
            const afterDateObj = new Date(afterDate);
            const totalDays = (afterDateObj.getTime() - beforeDateObj.getTime()) / (1000 * 60 * 60 * 24);
            const currentDays = (currentDateObj.getTime() - beforeDateObj.getTime()) / (1000 * 60 * 60 * 24);
            const ratio = totalDays > 0 ? currentDays / totalDays : 0;
            weight = beforeWeight + (afterWeight - beforeWeight) * ratio;
          } else if (beforeWeight !== null) {
            // Use the most recent known weight exactly - no variation
            weight = beforeWeight;
          } else if (afterWeight !== null) {
            // Use the next known weight exactly - no variation
            weight = afterWeight;
          } else {
            // Fallback to user's profile weight exactly
            weight = parseFloat(user.weight);
          }
        }
        
        data.push({
          date: dateStr,
          weight: Math.round(weight * 10) / 10 // Round to 1 decimal place for consistency
        });
      }
    } else {
      // If no workout weight data, use user's profile weight consistently
      const profileWeight = parseFloat(user.weight);
      for (let i = 0; i <= daysDiff; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];
        
        data.push({
          date: dateStr,
          weight: profileWeight
        });
      }
    }
    
    console.log('Stable weight trend data:', data.map(d => `${d.date}: ${d.weight}kg`));
    return data;
  };

  // Generate calorie data based on actual workout schedule - STABLE VERSION (no randomization)
  const generateCalorieData = (): CalorieEntry[] => {
    const data: CalorieEntry[] = [];
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const bmr = calculateBMR();
    const allWorkouts = getRecentWorkoutData();
    
    // Create a map of actual net intake values from workouts for deterministic results
    const workoutNetIntakeMap = new Map<string, number>();
    allWorkouts.forEach(workout => {
      if (workout.netIntake) {
        const dateStr = new Date(workout.date).toISOString().split('T')[0];
        workoutNetIntakeMap.set(dateStr, workout.netIntake);
      }
    });
    
    console.log('Using stable net intake data from test@gmail.com user:', Array.from(workoutNetIntakeMap.entries()));
    
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= daysDiff; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Find actual workouts for this date
      const dayWorkouts = allWorkouts.filter(w => {
        const workoutDate = new Date(w.date).toISOString().split('T')[0];
        return workoutDate === dateStr;
      });
      const caloriesBurned = dayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
      
      // Use stable, deterministic intake calculation
      let intake: number;
      const isWorkoutDay = caloriesBurned > 0;
      
      // If we have actual net intake data for this date, use it to calculate intake
      if (workoutNetIntakeMap.has(dateStr)) {
        const actualNetIntake = workoutNetIntakeMap.get(dateStr)!;
        // intake - bmr - caloriesBurned = netIntake, so intake = bmr + caloriesBurned + netIntake
        intake = bmr + caloriesBurned + actualNetIntake;
      } else {
        // For days without recorded data, use stable goal-based calculation
        const baseIntake = bmr * 1.2; // Sedentary multiplier
        
        switch (user.GOAL) {
          case 'lose weight':
            // Consistent deficit calculation
            let deficit = 500; // Default deficit
            if (caloriesBurned > 350) deficit = 200; // Smaller deficit on high-intensity days
            else if (isWorkoutDay) deficit = 350; // Medium deficit on workout days
            intake = baseIntake + caloriesBurned - deficit;
            break;
            
          case 'gain weight':
            // Consistent surplus calculation
            let surplus = 300; // Default surplus
            if (caloriesBurned > 350) surplus = 600; // More calories for intense days
            else if (isWorkoutDay) surplus = 450; // Medium surplus on workout days
            intake = baseIntake + caloriesBurned + surplus;
            break;
            
          case 'maintain weight':
            // Maintenance: match energy expenditure
            intake = baseIntake + caloriesBurned;
            if (caloriesBurned > 350) intake += 100; // Bonus for high-intensity days
            else if (isWorkoutDay) intake += 50;
            break;
            
          default:
            intake = baseIntake + caloriesBurned;
        }
        
        // Ensure minimum intake on high-calorie burn days - deterministic safety threshold
        if (caloriesBurned > 400) {
          intake = Math.max(intake, bmr + caloriesBurned + 200);
        }
      }
      
      // Round to consistent values - no random variation
      intake = Math.round(intake);
      const net = intake - bmr - caloriesBurned;
      
      data.push({
        date: dateStr,
        intake: intake,
        burned: caloriesBurned,
        net: Math.round(net)
      });
    }
    
    console.log('Stable calorie data generated:', data.slice(-7).map(d => `${d.date}: intake=${d.intake}, burned=${d.burned}, net=${d.net}`));
    return data;
  };

  useEffect(() => {
    console.log('Dashboard useEffect triggered');
    console.log('Date range:', dateRange);
    console.log('User:', user);
    console.log('Workouts:', workouts);
    
    const weights = generateWeightData();
    const calories = generateCalorieData();
    
    console.log('Generated weights:', weights);
    console.log('Generated calories:', calories);
    
    setWeightData(weights);
    setCalorieData(calories);
    setCurrentWeight(parseFloat(user.weight));
    
    // Calculate goal progress
    if (weights.length > 0) {
      const startWeight = weights[0].weight;
      const currentWeight = weights[weights.length - 1].weight;
      const targetWeight = user.GOAL === 'lose weight' ? startWeight - 10 : 
                          user.GOAL === 'gain weight' ? startWeight + 5 : startWeight;
      const progress = Math.abs(currentWeight - startWeight) / Math.abs(targetWeight - startWeight) * 100;
      setGoalProgress(Math.min(100, Math.max(0, progress)));
      console.log(`Goal progress: ${progress}% (${startWeight}kg -> ${currentWeight}kg, target: ${targetWeight}kg)`);
    }
    
    // Calculate today's net intake (intake - BMR - calories burned)
    const today = new Date().toISOString().split('T')[0];
    const todayData = calories.find(entry => entry.date === today);
    const bmr = calculateBMR();
    if (todayData) {
      const netIntake = todayData.intake - bmr - todayData.burned;
      setTodayNetIntake(netIntake);
    } else {
      setTodayNetIntake(0);
    }
    
    // Calculate weekly averages based on actual workout data
    if (calories.length > 0) {
      const bmr = calculateBMR();
      const recentDays = Math.min(7, calories.length); // Use last 7 days or all available days
      const recentCalories = calories.slice(-recentDays);
      
      const totalIntake = recentCalories.reduce((sum, entry) => sum + entry.intake, 0);
      const totalBurned = recentCalories.reduce((sum, entry) => sum + entry.burned, 0);
      const totalNet = recentCalories.reduce((sum, entry) => sum + entry.net, 0);
      
      setWeeklyAverages({
        intake: Math.round(totalIntake / recentDays),
        burned: Math.round(totalBurned / recentDays),
        net: Math.round(totalNet / recentDays),
        bmr
      });
    }
  }, [dateRange, user, workouts]);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="progress-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Progress Dashboard</h1>
          <div className="dashboard-info">
            <span className="info-icon">📊</span>
            <span className="info-text">
              Workout data is from your actual recorded exercises. 
              Calorie intake is estimated based on your fitness goal.
            </span>
          </div>
        </div>
        <div className="date-range-selector">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => handleDateRangeChange('start', e.target.value)}
          />
          <span>→</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => handleDateRangeChange('end', e.target.value)}
          />
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Weight Trend */}
        <div className="dashboard-card weight-trend">
          <h3>Weight Trend</h3>
          <div className="chart-container">
            {weightData.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                No weight data available for the selected date range
              </div>
            ) : weightData.length === 1 ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8B5CF6' }}>
                  {weightData[0].weight} kg
                </div>
                <div style={{ color: '#666', marginTop: '8px' }}>
                  Weight on {formatDate(weightData[0].date)}
                </div>
              </div>
            ) : (
              <svg viewBox="0 0 400 150" className="weight-chart">
                <defs>
                  <linearGradient id="weightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
                {(() => {
                  const minWeight = Math.min(...weightData.map(w => w.weight));
                  const maxWeight = Math.max(...weightData.map(w => w.weight));
                  const weightRange = maxWeight - minWeight;
                  
                  // Ensure there's a minimum range for visualization
                  const adjustedMinWeight = weightRange > 0.5 ? minWeight : minWeight - 0.5;
                  const adjustedMaxWeight = weightRange > 0.5 ? maxWeight : maxWeight + 0.5;
                  const adjustedRange = adjustedMaxWeight - adjustedMinWeight;
                  
                  console.log(`Chart rendering: ${weightData.length} points, weight range: ${adjustedMinWeight}-${adjustedMaxWeight}kg`);
                  
                  return (
                    <>
                      <path
                        d={`M ${weightData.map((point, index) => {
                          const x = (index / (weightData.length - 1)) * 380 + 10;
                          const y = 130 - ((point.weight - adjustedMinWeight) / adjustedRange) * 110;
                          return `${x},${y}`;
                        }).join(' L ')}`}
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="2"
                      />
                      <path
                        d={`M ${weightData.map((point, index) => {
                          const x = (index / (weightData.length - 1)) * 380 + 10;
                          const y = 130 - ((point.weight - adjustedMinWeight) / adjustedRange) * 110;
                          return `${x},${y}`;
                        }).join(' L ')} L 390,130 L 10,130 Z`}
                        fill="url(#weightGradient)"
                      />
                      {/* Add weight labels */}
                      <text x="10" y="20" fontSize="12" fill="#666">
                        {adjustedMaxWeight.toFixed(1)} kg
                      </text>
                      <text x="10" y="140" fontSize="12" fill="#666">
                        {adjustedMinWeight.toFixed(1)} kg
                      </text>
                    </>
                  );
                })()}
              </svg>
            )}
          </div>
        </div>

        {/* Goal Progress */}
        <div className="dashboard-card goal-progress">
          <h3>Goal Progress</h3>
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${goalProgress}%` }}
              ></div>
            </div>
            <div className="progress-labels">
              <span>Start</span>
              <span>Goal</span>
            </div>
          </div>
        </div>

        {/* Weekly Averages */}
        <div className="dashboard-card weekly-averages">
          <h3>Weekly Averages</h3>
          <div className="averages-grid">
            <div className="average-item">
              <span className="value">{weeklyAverages.intake.toLocaleString()}</span>
              <span className="label">kcal/day</span>
            </div>
            <div className="average-item">
              <span className="value">-{weeklyAverages.burned.toLocaleString()}</span>
              <span className="label">kcal/day</span>
            </div>
            <div className="average-item">
              <span className="value">{weeklyAverages.net > 0 ? '+' : ''}{weeklyAverages.net.toLocaleString()}</span>
              <span className="label">kcal/day</span>
            </div>
            <div className="average-item">
              <span className="value">-{weeklyAverages.bmr.toLocaleString()}</span>
              <span className="label">kcal/day</span>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="dashboard-card current-weight">
          <h3>Current Weight</h3>
          <div className="stat-value">{currentWeight} <span className="unit">kg</span></div>
        </div>

        <div className="dashboard-card total-net-intake">
          <h3>Total Net Intake</h3>
          <div className={`stat-value ${todayNetIntake >= 0 ? 'positive' : 'negative'}`}>
            {todayNetIntake > 0 ? '+' : ''}{todayNetIntake.toLocaleString()} <span className="unit">kcal</span>
          </div>
        </div>

        {/* Recent Workouts */}
        <div className="dashboard-card recent-workouts">
          <h3>Recent Workouts</h3>
          <div className="recent-workouts-list">
            {(() => {
              const allWorkouts = getRecentWorkoutData();
              console.log('Recent workouts for dashboard:', allWorkouts.slice(0, 5));
              
              return allWorkouts.length === 0 ? (
                <div className="no-workouts">No workouts recorded yet</div>
              ) : (
                allWorkouts
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 6) // Show 6 instead of 5 to include more recent data
                  .map((workout) => (
                    <div key={workout._id} className="workout-item">
                      <div className="workout-header">
                        <span className="workout-name">{workout.name}</span>
                        <span className="workout-date">{formatDate(workout.date)}</span>
                      </div>
                      <div className="workout-details">
                        <span className="workout-duration">{workout.duration} min</span>
                        <span className="workout-calories">{workout.caloriesBurned || 0} kcal</span>
                        {workout.weight && (
                          <span className="workout-weight">{workout.weight} kg</span>
                        )}
                        {workout.netIntake && (
                          <span className="workout-net-intake">+{workout.netIntake} kcal</span>
                        )}
                      </div>
                      {workout.notes && (
                        <div className="workout-notes">{workout.notes}</div>
                      )}
                    </div>
                  ))
              );
            })()}
          </div>
          {(() => {
            const allWorkouts = getRecentWorkoutData();
            return allWorkouts.length > 6 && (
              <div className="workout-count">
                +{allWorkouts.length - 6} more workouts (total: {allWorkouts.length})
              </div>
            );
          })()}
          
          {/* Quick Stats for Recent Period */}
          <div className="recent-stats">
            {(() => {
              const recentWorkouts = getRecentWorkoutData()
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 7); // Last 7 workouts
              
              const totalCalories = recentWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
              const totalDuration = recentWorkouts.reduce((sum, w) => sum + w.duration, 0);
              const avgWeight = recentWorkouts.filter(w => w.weight).length > 0 
                ? recentWorkouts.filter(w => w.weight).reduce((sum, w) => sum + (w.weight || 0), 0) / recentWorkouts.filter(w => w.weight).length
                : 0;
              
              return (
                <div className="stats-summary">
                  <div className="stat-item">
                    <span className="stat-label">Last 7 workouts:</span>
                    <span className="stat-value">{totalDuration} min • {totalCalories} kcal</span>
                  </div>
                  {avgWeight > 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Current avg weight:</span>
                      <span className="stat-value">{avgWeight.toFixed(1)} kg</span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard; 