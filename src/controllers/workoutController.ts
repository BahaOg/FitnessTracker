import { Request, Response } from 'express';
import Workout, { IWorkout } from '../models/Workout';

// Create a new workout
export const createWorkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const workoutData = {
      ...req.body,
      userId,
    };

    const workout = await Workout.create(workoutData);
    
    res.status(201).json({
      success: true,
      workout,
    });
  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all workouts for a user
export const getUserWorkouts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    
    const workouts = await Workout.find({ userId })
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: workouts.length,
      workouts,
    });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get a single workout
export const getWorkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const workoutId = req.params.id;
    
    const workout = await Workout.findOne({
      _id: workoutId,
      userId,
    });
    
    if (!workout) {
      res.status(404).json({ success: false, message: 'Workout not found' });
      return;
    }
    
    res.status(200).json({
      success: true,
      workout,
    });
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update a workout
export const updateWorkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const workoutId = req.params.id;
    
    const workout = await Workout.findOneAndUpdate(
      { _id: workoutId, userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!workout) {
      res.status(404).json({ success: false, message: 'Workout not found' });
      return;
    }
    
    res.status(200).json({
      success: true,
      workout,
    });
  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete a workout
export const deleteWorkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const workoutId = req.params.id;
    
    const workout = await Workout.findOneAndDelete({
      _id: workoutId,
      userId,
    });
    
    if (!workout) {
      res.status(404).json({ success: false, message: 'Workout not found' });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Workout deleted successfully',
    });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}; 