import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkout extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  name: string;
  duration: number;
  date: Date;
  caloriesBurned: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const WorkoutSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: [true, 'Please provide workout type'],
      enum: ['cardio', 'strength', 'flexibility', 'sports', 'other'],
    },
    name: {
      type: String,
      required: [true, 'Please provide workout name'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Please provide workout duration in minutes'],
      min: 1,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    caloriesBurned: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IWorkout>('Workout', WorkoutSchema); 