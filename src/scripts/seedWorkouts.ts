import mongoose from 'mongoose';
import Workout from '../models/Workout';
import User from '../models/User';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Generate 30 days of workout data - half running, half walking, mixed together
const sampleWorkouts = Array.from({ length: 30 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - index);
  
  // Create a truly mixed pattern of running and walking
  // Generate a pattern that ensures 50/50 split but mixes them randomly
  const patterns = [
    true, false, true, false, true, false, true, false, true, false, // 10 mixed
    false, true, false, true, false, true, false, true, false, true, // 10 mixed
    true, true, false, false, true, false, true, false, false, true  // 10 mixed
  ];
  const isRunning = patterns[index] ?? (index % 2 === 0);
  const type = isRunning ? 'Running' : 'Walking';
  
  // Duration between 30-120 minutes with some variation
  const duration = Math.floor(Math.random() * 91) + 30; // 30-120 minutes
  
  // Calculate calories based on activity type and duration
  // Running: ~10-15 calories per minute, Walking: ~3-5 calories per minute
  const caloriesPerMinute = isRunning ? (Math.random() * 5 + 10) : (Math.random() * 2 + 3);
  const caloriesBurned = Math.floor(caloriesPerMinute * duration);
  
  return {
    name: type,
    type: 'cardio',
    duration,
    date,
    caloriesBurned,
    notes: `${type} workout - ${duration} minutes on ${date.toISOString().split('T')[0]}`
  };
});

async function seedWorkoutsByEmail(email: string) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker');
    console.log('Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User with email ${email} not found.`);
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
      return;
    }
    console.log(`Found user: ${user.name} ${user.surname} (ID: ${user._id})`);

    const userId = user._id;

    // Delete existing workouts for this user
    await Workout.deleteMany({ userId });
    console.log(`Cleared existing workouts for user ${email}`);

    // Add sample workouts
    const workoutsWithUserId = sampleWorkouts.map(workout => ({
      ...workout,
      userId: new mongoose.Types.ObjectId(userId as any)
    }));

    await Workout.insertMany(workoutsWithUserId);
    console.log(`Added ${sampleWorkouts.length} sample workouts for user ${email}`);

    console.log('Sample workouts seeded successfully!');
  } catch (error) {
    console.error('Error seeding workouts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Usage: npx ts-node src/scripts/seedWorkouts.ts <userEmail>
const userEmail = process.argv[2];
if (!userEmail) {
  console.error('Please provide a user email as an argument');
  console.log('Usage: npx ts-node src/scripts/seedWorkouts.ts <userEmail>');
  process.exit(1);
}

seedWorkoutsByEmail(userEmail); 