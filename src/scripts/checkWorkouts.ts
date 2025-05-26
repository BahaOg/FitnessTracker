import mongoose from 'mongoose';
import Workout from '../models/Workout';
import User from '../models/User';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function checkWorkoutsByEmail(email: string) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker');
    console.log('Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User with email ${email} not found.`);
      await mongoose.disconnect();
      return;
    }
    console.log(`Found user: ${user.name} ${user.surname} (ID: ${user._id})`);

    // Get workouts for this user
    const workouts = await Workout.find({ userId: user._id }).sort({ date: -1 });
    console.log(`Found ${workouts.length} workouts for user ${email}`);

    // Analyze the workout data
    const runningWorkouts = workouts.filter(w => w.name === 'Running');
    const walkingWorkouts = workouts.filter(w => w.name === 'Walking');
    
    console.log(`\nWorkout breakdown:`);
    console.log(`Running workouts: ${runningWorkouts.length}`);
    console.log(`Walking workouts: ${walkingWorkouts.length}`);
    
    console.log(`\nFirst 10 workouts (most recent):`);
    workouts.slice(0, 10).forEach((workout, index) => {
      const date = new Date(workout.date).toISOString().split('T')[0];
      console.log(`${index + 1}. ${workout.name} - ${workout.duration}min - ${workout.caloriesBurned}cal - ${date}`);
    });

    // Duration stats
    const durations = workouts.map(w => w.duration);
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);
    const avgDuration = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
    
    console.log(`\nDuration stats:`);
    console.log(`Min: ${minDuration} minutes`);
    console.log(`Max: ${maxDuration} minutes`);
    console.log(`Average: ${avgDuration} minutes`);

  } catch (error) {
    console.error('Error checking workouts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Usage: npx ts-node src/scripts/checkWorkouts.ts <userEmail>
const userEmail = process.argv[2];
if (!userEmail) {
  console.error('Please provide a user email as an argument');
  console.log('Usage: npx ts-node src/scripts/checkWorkouts.ts <userEmail>');
  process.exit(1);
}

checkWorkoutsByEmail(userEmail); 