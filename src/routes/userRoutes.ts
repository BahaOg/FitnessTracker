import { Router } from 'express';
import { register, login, getCurrentUser, updateUser } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.put('/me', authMiddleware, updateUser);

export default router; 