import React, { useState, useEffect } from 'react';
import './CalorieCalculator.css';

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

interface CalorieCalculatorProps {
  user: User;
  // onBack, onNavigate, and onLogout props are no longer needed since navigation is handled by main navbar
}

const CalorieCalculator: React.FC<CalorieCalculatorProps> = ({ user }) => {
  const [dailyCalorieIntake, setDailyCalorieIntake] = useState<string>('2000');
  const [exercise, setExercise] = useState<string>('walking');
  const [duration, setDuration] = useState<string>('60');
  const [bmr, setBmr] = useState<number>(0);
  const [caloriesBurned, setCaloriesBurned] = useState<number>(0);
  const [totalNetIntake, setTotalNetIntake] = useState<number>(0);
  const [performance, setPerformance] = useState<number>(0);

  // Calculate age from birth date
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateBMR = (): number => {
    const weight = parseFloat(user.weight);
    const height = parseFloat(user.height);
    const age = calculateAge(user.birthDate);
    
    if (isNaN(weight) || isNaN(height) || isNaN(age)) return 0;

    let bmrValue: number;
    if (user.gender.toLowerCase() === 'male') {
      bmrValue = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmrValue = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    return Math.round(bmrValue);
  };

  // Get MET value for different exercises
  const getMETValue = (exerciseType: string): number => {
    const metValues: { [key: string]: number } = {
      walking: 3.5,
      jogging: 7.0,
      running: 9.8,
      cycling: 6.8,
      swimming: 8.0,
      weightlifting: 6.0,
      yoga: 2.5,
      dancing: 4.8,
      basketball: 8.0,
      tennis: 7.3
    };
    return metValues[exerciseType] || 3.5;
  };

  // Calculate calories burned using MET formula
  const calculateCaloriesBurned = (): number => {
    const weight = parseFloat(user.weight);
    const durationMinutes = parseFloat(duration);
    const metValue = getMETValue(exercise);
    
    if (isNaN(weight) || isNaN(durationMinutes)) return 0;
    
    // Formula: Calories = (MET × 3.5 × weight) / 200 × duration_in_minutes
    const calories = (metValue * 3.5 * weight) / 200 * durationMinutes;
    return Math.round(calories);
  };

  // Calculate performance score (1-100)
  const calculatePerformance = (): number => {
    const intake = parseFloat(dailyCalorieIntake);
    const burned = caloriesBurned;
    const basalRate = bmr;
    
    if (isNaN(intake) || basalRate === 0) return 0;
    
    // Calculate net calories (intake - BMR - exercise calories)
    const netCalories = intake - basalRate - burned;
    
    // Performance calculation based on goal and net calories
    // Ideal range: -500 to +500 calories from maintenance
    const idealRange = 500;
    const deviation = Math.abs(netCalories);
    
    let score: number;
    if (deviation <= idealRange) {
      // Good performance if within ideal range
      score = 100 - (deviation / idealRange) * 25; // 75-100 range
    } else {
      // Lower performance if outside ideal range
      const excessDeviation = deviation - idealRange;
      score = 75 - Math.min(excessDeviation / 100, 74); // 1-75 range
    }
    
    return Math.max(1, Math.round(score));
  };

  // Update calculations when inputs change
  useEffect(() => {
    const newBmr = calculateBMR();
    const newCaloriesBurned = calculateCaloriesBurned();
    const intake = parseFloat(dailyCalorieIntake);
    const newTotalNetIntake = intake - newBmr - newCaloriesBurned;
    const newPerformance = calculatePerformance();
    
    setBmr(newBmr);
    setCaloriesBurned(newCaloriesBurned);
    setTotalNetIntake(newTotalNetIntake);
    setPerformance(newPerformance);
  }, [user, dailyCalorieIntake, exercise, duration]);

  const handleCalculate = () => {
    // Trigger recalculation
    const newBmr = calculateBMR();
    const newCaloriesBurned = calculateCaloriesBurned();
    const intake = parseFloat(dailyCalorieIntake);
    const newTotalNetIntake = intake - newBmr - newCaloriesBurned;
    const newPerformance = calculatePerformance();
    
    setBmr(newBmr);
    setCaloriesBurned(newCaloriesBurned);
    setTotalNetIntake(newTotalNetIntake);
    setPerformance(newPerformance);
  };

  const getPerformanceColor = (score: number): string => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FFC107'; // Yellow
    if (score >= 40) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  return (
    <div className="calorie-calculator-container">
      <div className="calculator-content-wrapper">
        <div className="calorie-calculator-card">
          <div className="calculator-header">
            <h1 className="calculator-title">Calorie Calculator</h1>
          </div>
          
          <div className="calculator-content">
            <div className="bmr-section">
              <h3>Basal Metabolic Rate</h3>
              <div className="bmr-value">{bmr} cal/day</div>
            </div>
            
            <div className="input-section">
              <div className="input-group">
                <label htmlFor="daily-intake">Daily Calorie Intake</label>
                <input
                  type="number"
                  id="daily-intake"
                  value={dailyCalorieIntake}
                  onChange={(e) => setDailyCalorieIntake(e.target.value)}
                  placeholder="2000"
                />
              </div>
            </div>
            
            <div className="exercise-section">
              <div className="exercise-inputs">
                <div className="input-group">
                  <label htmlFor="exercise">Exercise</label>
                  <select
                    id="exercise"
                    value={exercise}
                    onChange={(e) => setExercise(e.target.value)}
                  >
                    <option value="walking">Walking</option>
                    <option value="jogging">Jogging</option>
                    <option value="running">Running</option>
                    <option value="cycling">Cycling</option>
                    <option value="swimming">Swimming</option>
                    <option value="weightlifting">Weight Lifting</option>
                    <option value="yoga">Yoga</option>
                    <option value="dancing">Dancing</option>
                    <option value="basketball">Basketball</option>
                    <option value="tennis">Tennis</option>
                  </select>
                </div>
                
                <div className="input-group">
                  <label htmlFor="duration">Duration</label>
                  <input
                    type="text"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="1 h"
                  />
                </div>
              </div>
              
              <div className="basal-burn-rate">
                <span>Basal Burn Rate</span>
                <span>{caloriesBurned} calories/day</span>
              </div>
            </div>
            
            <button className="calculate-button" onClick={handleCalculate}>
              Calculate
            </button>
            
            <div className="results-section">
              <div className="result-row">
                <span>Calories Burned</span>
                <span className="negative">-{caloriesBurned} kcal</span>
              </div>
              
              <div className="result-row">
                <span>Calories Consumed</span>
                <span>{dailyCalorieIntake} kcal</span>
              </div>
              
              <div className="result-row">
                <span>Total Net Intake</span>
                <span className={totalNetIntake < 0 ? 'negative' : 'positive'}>
                  {totalNetIntake > 0 ? '+' : ''}{totalNetIntake} kcal
                </span>
              </div>
            </div>
            
            <div className="performance-section">
              <div className="performance-header">
                <span>Performance</span>
                <span>{performance} / 100</span>
              </div>
              <div className="performance-bar">
                <div 
                  className="performance-fill"
                  style={{ 
                    width: `${performance}%`,
                    backgroundColor: getPerformanceColor(performance)
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieCalculator; 