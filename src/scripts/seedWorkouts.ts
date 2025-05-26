import mongoose from 'mongoose';
import Workout from '../models/Workout';
import User from '../models/User';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Generate 30 days of fake workout data
const sampleWorkouts = Array.from({ length: 30 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - index);
  const workoutTypes = ['Cycling', 'Walking', 'Jogging', 'Weight Training', 'Swimming'];
  const type = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
  const duration = Math.floor(Math.random() * 30) + 30; // 30-60 minutes
  const caloriesBurned = Math.floor(Math.random() * 300) + 100; // 100-400 calories
  return {
    name: type,
    type: type === 'Weight Training' ? 'strength' : 'cardio',
    duration,
    date,
    caloriesBurned,
    notes: `${type} workout on ${date.toISOString().split('T')[0]}`
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