import mongoose from 'mongoose';
import Workout from '../models/Workout';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const sampleWorkouts = [
  {
    name: 'Cycling',
    type: 'cardio',
    duration: 45,
    date: new Date('2024-04-20'),
    caloriesBurned: 400,
    notes: 'Morning bike ride in the park'
  },
  {
    name: 'Walking',
    type: 'cardio',
    duration: 30,
    date: new Date('2024-04-18'),
    caloriesBurned: 120,
    notes: 'Evening walk around the neighborhood'
  },
  {
    name: 'Jogging',
    type: 'cardio',
    duration: 50,
    date: new Date('2024-04-16'),
    caloriesBurned: 350,
    notes: 'Morning jog at the track'
  },
  {
    name: 'Walking',
    type: 'cardio',
    duration: 35,
    date: new Date('2024-04-14'),
    caloriesBurned: 140,
    notes: 'Lunch break walk'
  },
  {
    name: 'Weight Training',
    type: 'strength',
    duration: 60,
    date: new Date('2024-04-12'),
    caloriesBurned: 250,
    notes: 'Upper body workout'
  },
  {
    name: 'Swimming',
    type: 'cardio',
    duration: 40,
    date: new Date('2024-04-10'),
    caloriesBurned: 320,
    notes: 'Pool workout'
  }
];

async function seedWorkouts(userId: string) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker');
    console.log('Connected to MongoDB');

    // Delete existing workouts for this user
    await Workout.deleteMany({ userId });
    console.log('Cleared existing workouts');

    // Add sample workouts
    const workoutsWithUserId = sampleWorkouts.map(workout => ({
      ...workout,
      userId: new mongoose.Types.ObjectId(userId)
    }));

    await Workout.insertMany(workoutsWithUserId);
    console.log(`Added ${sampleWorkouts.length} sample workouts`);

    console.log('Sample workouts seeded successfully!');
  } catch (error) {
    console.error('Error seeding workouts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Usage: node dist/scripts/seedWorkouts.js <userId>
const userId = process.argv[2];
if (!userId) {
  console.error('Please provide a user ID as an argument');
  console.log('Usage: node dist/scripts/seedWorkouts.js <userId>');
  process.exit(1);
}

seedWorkouts(userId); 