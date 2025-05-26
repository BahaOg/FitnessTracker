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
    
    // Goal-based performance calculation
    let score: number;
    
    switch (user.GOAL) {
      case 'lose weight':
        if (netCalories > 0) {
          // Positive net calories are bad for weight loss (eating too much)
          // Scale from 1-25 based on how much surplus
          score = Math.max(1, 25 - Math.min(netCalories / 50, 24));
        } else {
          // Negative net calories are good for weight loss
          const deficit = Math.abs(netCalories);
          if (deficit >= 500 && deficit <= 750) {
            // Excellent range: 76-100 points
            score = 76 + ((750 - Math.abs(deficit - 625)) / 125) * 24;
          } else if (deficit >= 300 && deficit <= 900) {
            // Good range: 51-75 points
            const distanceFromIdeal = Math.min(Math.abs(deficit - 625) - 125, 275);
            score = 75 - (distanceFromIdeal / 275) * 24;
          } else if (deficit >= 100 && deficit <= 1200) {
            // Mid range: 26-50 points
            const distanceFromIdeal = Math.min(Math.abs(deficit - 625) - 400, 475);
            score = 50 - (distanceFromIdeal / 475) * 24;
          } else {
            // Poor range: 1-25 points
            const distanceFromIdeal = Math.abs(deficit - 625);
            score = Math.max(1, 25 - Math.min((distanceFromIdeal - 875) / 50, 24));
          }
        }
        break;
        
      case 'gain weight':
        if (netCalories < 0) {
          // Negative net calories are bad for weight gain (eating too little)
          // Scale from 1-25 based on how much deficit
          const deficit = Math.abs(netCalories);
          score = Math.max(1, 25 - Math.min(deficit / 50, 24));
        } else {
          // Positive net calories are good for weight gain
          const surplus = netCalories;
          if (surplus >= 500 && surplus <= 750) {
            // Excellent range: 76-100 points
            score = 76 + ((750 - Math.abs(surplus - 625)) / 125) * 24;
          } else if (surplus >= 300 && surplus <= 900) {
            // Good range: 51-75 points
            const distanceFromIdeal = Math.min(Math.abs(surplus - 625) - 125, 275);
            score = 75 - (distanceFromIdeal / 275) * 24;
          } else if (surplus >= 100 && surplus <= 1200) {
            // Mid range: 26-50 points
            const distanceFromIdeal = Math.min(Math.abs(surplus - 625) - 400, 475);
            score = 50 - (distanceFromIdeal / 475) * 24;
          } else {
            // Poor range: 1-25 points
            const distanceFromIdeal = Math.abs(surplus - 625);
            score = Math.max(1, 25 - Math.min((distanceFromIdeal - 875) / 50, 24));
          }
        }
        break;
        
      case 'maintain weight':
        // Ideal: 0 net calories (perfect maintenance)
        const deviation = Math.abs(netCalories);
        if (deviation <= 50) {
          // Excellent range: 76-100 points
          score = 100 - (deviation / 50) * 24;
        } else if (deviation <= 150) {
          // Good range: 51-75 points
          score = 75 - ((deviation - 50) / 100) * 24;
        } else if (deviation <= 300) {
          // Mid range: 26-50 points
          score = 50 - ((deviation - 150) / 150) * 24;
        } else {
          // Poor range: 1-25 points
          score = Math.max(1, 25 - Math.min((deviation - 300) / 50, 24));
        }
        break;
        
      default:
        // Default to maintenance if goal is not recognized
        score = 50;
    }
    
    return Math.max(1, Math.min(100, Math.round(score)));
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
    if (score >= 76) return '#4CAF50'; // Green - Excellent
    if (score >= 51) return '#FFC107'; // Yellow - Good
    if (score >= 26) return '#FF9800'; // Orange - Mid
    return '#F44336'; // Red - Poor
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
            
            <div className="goal-info-section">
              <h3>Goal: {user.GOAL.charAt(0).toUpperCase() + user.GOAL.slice(1)}</h3>
              <div className="goal-explanation">
                {user.GOAL === 'lose weight' && (
                  <p>For weight loss, aim for a calorie deficit of 500-750 calories daily.</p>
                )}
                {user.GOAL === 'gain weight' && (
                  <p>For weight gain, aim for a calorie surplus of 500-750 calories daily.</p>
                )}
                {user.GOAL === 'maintain weight' && (
                  <p>For weight maintenance, aim for a net calorie intake close to 0.</p>
                )}
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
              <div className="performance-legend">
                <span style={{ color: '#4CAF50' }}>■ Excellent (76-100)</span>
                <span style={{ color: '#FFC107' }}>■ Good (51-75)</span>
                <span style={{ color: '#FF9800' }}>■ Mid (26-50)</span>
                <span style={{ color: '#F44336' }}>■ Poor (1-25)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieCalculator; 