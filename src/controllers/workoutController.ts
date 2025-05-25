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
    const { startDate, endDate } = req.query;
    
    // Build query filter
    const filter: any = { userId };
    
    // Add date range filter if provided
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        // Add one day to endDate to include the entire end date
        const end = new Date(endDate as string);
        end.setDate(end.getDate() + 1);
        filter.date.$lt = end;
      }
    }
    
    const workouts = await Workout.find(filter)
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