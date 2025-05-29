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
    start: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 29 days ago
    end: new Date().toISOString().split('T')[0] // today
  });
  
  const [weightData, setWeightData] = useState<WeightEntry[]>([]);
  const [calorieData, setCalorieData] = useState<CalorieEntry[]>([]);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [goalProgress, setGoalProgress] = useState<number>(0);
  const [totalNetIntake30Days, setTotalNetIntake30Days] = useState<number>(0);
  const [weightChange30Days, setWeightChange30Days] = useState<number>(0);
  const [weeklyAverages, setWeeklyAverages] = useState({
    intake: 0,
    burned: 0,
    net: 0,
    bmr: 0
  });

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

  // Generate weight data based on actual workout activity
  const generateWeightData = (): WeightEntry[] => {
    const data: WeightEntry[] = [];
    const startWeight = parseFloat(user.weight);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate realistic weight change based on goal and expected calorie balance
    let expectedWeightChange = 0;
    const days = daysDiff + 1;
    
    // Estimate daily calorie balance based on goal
    let dailyCalorieBalance = 0;
    switch (user.GOAL) {
      case 'lose weight':
        dailyCalorieBalance = -600; // 600 calorie deficit per day
        expectedWeightChange = -(days * Math.abs(dailyCalorieBalance)) / 7700; // 1kg ≈ 7700 calories
        break;
      case 'gain weight':
        dailyCalorieBalance = 400; // 400 calorie surplus per day
        expectedWeightChange = (days * dailyCalorieBalance) / 7700;
        break;
      case 'maintain weight':
        dailyCalorieBalance = 0;
        expectedWeightChange = 0;
        break;
    }
    
    // Add workout effectiveness factor
    const totalCaloriesBurned = workouts
      .filter(w => {
        const workoutDate = new Date(w.date);
        return workoutDate >= startDate && workoutDate <= endDate;
      })
      .reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    
    // Enhance weight change based on workout activity
    if (totalCaloriesBurned > 0) {
      const workoutEffect = totalCaloriesBurned / 7700 * 0.3; // 30% workout effectiveness
      if (user.GOAL === 'lose weight') {
        expectedWeightChange -= workoutEffect;
      } else if (user.GOAL === 'gain weight') {
        expectedWeightChange += workoutEffect * 0.5; // Less impact on weight gain
      }
    }
    
    for (let i = 0; i <= daysDiff; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      // Progressive weight change following expected trend
      const progressRatio = i / daysDiff;
      const currentWeightChange = expectedWeightChange * progressRatio;
      
      // Add realistic daily fluctuations (±0.2kg)
      const dailyFluctuation = (Math.random() - 0.5) * 0.4;
      const weight = startWeight + currentWeightChange + dailyFluctuation;
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        weight: Math.round(weight * 10) / 10
      });
    }
    
    return data;
  };

  // Generate calorie data based on actual workouts only
  const generateCalorieData = (): CalorieEntry[] => {
    const data: CalorieEntry[] = [];
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const bmr = calculateBMR();
    
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= daysDiff; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Find actual workouts for this date from the workouts prop
      const dayWorkouts = workouts.filter(w => {
        const workoutDate = new Date(w.date).toISOString().split('T')[0];
        return workoutDate === dateStr;
      });
      const caloriesBurned = dayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
      
      // Generate realistic calorie intake based on goal and activity level
      let intake: number;
      const baseVariation = (Math.random() - 0.5) * 400; // ±200 calorie daily variation
      
      switch (user.GOAL) {
        case 'lose weight':
          // Deficit of 500-700 calories from maintenance
          intake = bmr + caloriesBurned - 600 + baseVariation;
          break;
        case 'gain weight':
          // Surplus of 300-500 calories above maintenance
          intake = bmr + caloriesBurned + 400 + baseVariation;
          break;
        case 'maintain weight':
          // Near maintenance with small variations
          intake = bmr + caloriesBurned + baseVariation;
          break;
        default:
          intake = bmr + caloriesBurned + baseVariation;
      }
      
      // Ensure intake is not unrealistically low
      intake = Math.max(intake, bmr * 0.8);
      
      const net = intake - bmr - caloriesBurned;
      
      data.push({
        date: dateStr,
        intake: Math.round(intake),
        burned: caloriesBurned, // Real workout data
        net: Math.round(net)
      });
    }
    
    return data;
  };

  useEffect(() => {
    const weights = generateWeightData();
    const calories = generateCalorieData();
    
    setWeightData(weights);
    console.log(weights);
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
    }
    
    // Calculate total 30-day net intake (sum of all daily net calories)
    if (calories.length > 0) {
      const totalNet = calories.reduce((sum, entry) => sum + entry.net, 0);
      setTotalNetIntake30Days(totalNet);
    } else {
      setTotalNetIntake30Days(0);
    }
    
    // Calculate weight change over 30 days
    if (weights.length > 0) {
      const weightChange = weights[weights.length - 1].weight - weights[0].weight;
      setWeightChange30Days(Math.round(weightChange * 10) / 10); // Round to 1 decimal place
    }
    
    // Calculate weekly averages
    if (calories.length > 0) {
      const bmr = calculateBMR();
      const totalIntake = calories.reduce((sum, entry) => sum + entry.intake, 0);
      const totalBurned = calories.reduce((sum, entry) => sum + entry.burned, 0);
      const totalNet = calories.reduce((sum, entry) => sum + entry.net, 0);
      const days = calories.length;
      
      setWeeklyAverages({
        intake: Math.round(totalIntake / days),
        burned: Math.round(totalBurned / days),
        net: Math.round(totalNet / days),
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
              Showing 30-day data. Workout data from your actual exercises. 
              Calorie intake estimated based on your fitness goal.
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
            <svg viewBox="0 0 400 150" className="weight-chart">
              <defs>
                <linearGradient id="weightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1"/>
                </linearGradient>
              </defs>
              {weightData.length > 1 && (
                <>
                  <path
                    d={`M ${weightData.map((point, index) => {
                      const x = (index / (weightData.length - 1)) * 380 + 10;
                      const minWeight = Math.min(...weightData.map(w => w.weight));
                      const maxWeight = Math.max(...weightData.map(w => w.weight));
                      const y = 130 - ((point.weight - minWeight) / (maxWeight - minWeight)) * 110;
                      return `${x},${y}`;
                    }).join(' L ')}`}
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                  />
                  <path
                    d={`M ${weightData.map((point, index) => {
                      const x = (index / (weightData.length - 1)) * 380 + 10;
                      const minWeight = Math.min(...weightData.map(w => w.weight));
                      const maxWeight = Math.max(...weightData.map(w => w.weight));
                      const y = 130 - ((point.weight - minWeight) / (maxWeight - minWeight)) * 110;
                      return `${x},${y}`;
                    }).join(' L ')} L 390,130 L 10,130 Z`}
                    fill="url(#weightGradient)"
                  />
                </>
              )}
            </svg>
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

        <div className="dashboard-card weight-change">
          <h3>30-Day Weight Change</h3>
          <div className={`stat-value ${weightChange30Days >= 0 ? 'positive' : 'negative'}`}>
            {weightChange30Days > 0 ? '+' : ''}{weightChange30Days} <span className="unit">kg</span>
          </div>
        </div>

        <div className="dashboard-card total-net-intake">
          <h3>30-Day Total Net Intake</h3>
          <div className={`stat-value ${totalNetIntake30Days >= 0 ? 'positive' : 'negative'}`}>
            {totalNetIntake30Days > 0 ? '+' : ''}{totalNetIntake30Days.toLocaleString()} <span className="unit">kcal</span>
          </div>
        </div>

        <div className="dashboard-card avg-daily-burn">
          <h3>Average Daily Burn</h3>
          <div className="stat-value">
            {weeklyAverages.burned.toLocaleString()} <span className="unit">kcal/day</span>
          </div>
        </div>

        {/* Recent Workouts */}
        <div className="dashboard-card recent-workouts">
          <h3>Recent Workouts</h3>
          <div className="recent-workouts-list">
            {workouts.length === 0 ? (
              <div className="no-workouts">No workouts recorded yet</div>
            ) : (
              workouts
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((workout) => (
                  <div key={workout._id} className="workout-item">
                    <div className="workout-header">
                      <span className="workout-name">{workout.name}</span>
                      <span className="workout-date">{formatDate(workout.date)}</span>
                    </div>
                    <div className="workout-details">
                      <span className="workout-duration">{workout.duration} min</span>
                      <span className="workout-calories">{workout.caloriesBurned || 0} kcal</span>
                    </div>
                  </div>
                ))
            )}
          </div>
          {workouts.length > 5 && (
            <div className="workout-count">
              +{workouts.length - 5} more workouts (total: {workouts.length})
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard; 