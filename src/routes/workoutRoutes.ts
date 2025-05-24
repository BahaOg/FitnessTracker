import { Router } from 'express';
import {
  createWorkout,
  getUserWorkouts,
  getWorkout,
  updateWorkout,
  deleteWorkout,
} from '../controllers/workoutController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All workout routes are protected
router.use(authMiddleware);

router.route('/')
  .post(createWorkout)
  .get(getUserWorkouts);

router.route('/:id')
  .get(getWorkout)
  .put(updateWorkout)
  .delete(deleteWorkout);

export default router; 