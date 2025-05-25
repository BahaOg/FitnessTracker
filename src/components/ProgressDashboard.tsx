import React, { useState, useEffect } from 'react';
import './ProgressDashboard.css';

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
    start: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 23 days ago
    end: new Date().toISOString().split('T')[0] // today
  });
  
  const [weightData, setWeightData] = useState<WeightEntry[]>([]);
  const [calorieData, setCalorieData] = useState<CalorieEntry[]>([]);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [goalProgress, setGoalProgress] = useState<number>(0);
  const [todayNetCalories, setTodayNetCalories] = useState<number>(0);
  const [weeklyAverages, setWeeklyAverages] = useState({
    intake: 0,
    burned: 0,
    net: 0,
    bmr: 0
  });
  const [estimatedDaysToGoal, setEstimatedDaysToGoal] = useState<number>(0);

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

  // Generate mock weight data (in a real app, this would come from user entries)
  const generateWeightData = (): WeightEntry[] => {
    const data: WeightEntry[] = [];
    const startWeight = parseFloat(user.weight);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= daysDiff; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      // Simulate weight fluctuation (in real app, this would be actual user data)
      const weightVariation = (Math.random() - 0.5) * 2; // ±1kg variation
      const trendFactor = user.GOAL === 'weight_loss' ? -0.1 : user.GOAL === 'muscle_gain' ? 0.05 : 0;
      const weight = startWeight + (i * trendFactor) + weightVariation;
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        weight: Math.round(weight * 10) / 10
      });
    }
    
    return data;
  };

  // Generate mock calorie data
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
      
      // Find workouts for this date
      const dayWorkouts = workouts.filter(w => w.date.split('T')[0] === dateStr);
      const caloriesBurned = dayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
      
      // Simulate calorie intake (in real app, this would be user input)
      const baseIntake = bmr + (Math.random() * 400 - 200); // BMR ± 200 calories
      const intake = Math.round(baseIntake);
      const net = intake - bmr - caloriesBurned;
      
      data.push({
        date: dateStr,
        intake,
        burned: caloriesBurned,
        net
      });
    }
    
    return data;
  };

  // Calculate goal progress
  const calculateGoalProgress = (): number => {
    if (!weightData.length) return 0;
    
    const startWeight = weightData[0].weight;
    const currentWeight = weightData[weightData.length - 1].weight;
    const targetWeight = user.GOAL === 'weight_loss' ? startWeight - 10 : 
                        user.GOAL === 'muscle_gain' ? startWeight + 5 : startWeight;
    
    const progress = Math.abs(currentWeight - startWeight) / Math.abs(targetWeight - startWeight) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  // Calculate weekly averages
  const calculateWeeklyAverages = () => {
    if (!calorieData.length) return;
    
    const bmr = calculateBMR();
    const totalIntake = calorieData.reduce((sum, entry) => sum + entry.intake, 0);
    const totalBurned = calorieData.reduce((sum, entry) => sum + entry.burned, 0);
    const totalNet = calorieData.reduce((sum, entry) => sum + entry.net, 0);
    
    const days = calorieData.length;
    
    setWeeklyAverages({
      intake: Math.round(totalIntake / days),
      burned: Math.round(totalBurned / days),
      net: Math.round(totalNet / days),
      bmr
    });
  };

  // Calculate estimated days to goal
  const calculateEstimatedDaysToGoal = (): number => {
    if (!weightData.length || weightData.length < 7) return 0;
    
    const recentWeightData = weightData.slice(-7); // Last 7 days
    const weightChange = recentWeightData[recentWeightData.length - 1].weight - recentWeightData[0].weight;
    const dailyWeightChange = weightChange / 7;
    
    if (Math.abs(dailyWeightChange) < 0.01) return 999; // No significant change
    
    const currentWeight = parseFloat(user.weight);
    const targetWeight = user.GOAL === 'weight_loss' ? currentWeight - 10 : 
                        user.GOAL === 'muscle_gain' ? currentWeight + 5 : currentWeight;
    
    const remainingWeight = Math.abs(targetWeight - currentWeight);
    const daysToGoal = remainingWeight / Math.abs(dailyWeightChange);
    
    return Math.round(daysToGoal);
  };

  // Get today's net calories
  const getTodayNetCalories = (): number => {
    const today = new Date().toISOString().split('T')[0];
    const todayData = calorieData.find(entry => entry.date === today);
    return todayData ? todayData.net : 0;
  };

  useEffect(() => {
    const weights = generateWeightData();
    const calories = generateCalorieData();
    
    setWeightData(weights);
    setCalorieData(calories);
    setCurrentWeight(parseFloat(user.weight));
    setGoalProgress(calculateGoalProgress());
    setTodayNetCalories(getTodayNetCalories());
    setEstimatedDaysToGoal(calculateEstimatedDaysToGoal());
    
    calculateWeeklyAverages();
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
        <h1>Progress Dashboard</h1>
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

        {/* Net Calories */}
        <div className="dashboard-card net-calories">
          <h3>Net Calories</h3>
          <div className="calories-chart">
            {calorieData.slice(-14).map((entry, index) => (
              <div key={entry.date} className="calorie-bar">
                <div 
                  className={`bar ${entry.net >= 0 ? 'positive' : 'negative'}`}
                  style={{ 
                    height: `${Math.min(Math.abs(entry.net) / 20, 100)}%`,
                    backgroundColor: entry.net >= 0 ? '#EF4444' : '#10B981'
                  }}
                ></div>
              </div>
            ))}
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

        <div className="dashboard-card todays-net">
          <h3>Today's Net Calories</h3>
          <div className={`stat-value ${todayNetCalories >= 0 ? 'positive' : 'negative'}`}>
            {todayNetCalories > 0 ? '+' : ''}{todayNetCalories} <span className="unit">kcal</span>
          </div>
        </div>

        <div className="dashboard-card yesterdays-performance">
          <h3>Yesterday's Performance</h3>
          <div className="stat-value">85</div>
        </div>

        <div className="dashboard-card days-to-goal">
          <h3>Estimated Days to Goal</h3>
          <div className="stat-value">{estimatedDaysToGoal > 999 ? '∞' : estimatedDaysToGoal}</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard; 