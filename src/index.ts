import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import userRoutes from './routes/userRoutes';
import workoutRoutes from './routes/workoutRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from React build
const frontendPath = path.join(__dirname, '../dist-frontend');
app.use(express.static(frontendPath));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);

// API health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Fitness Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve React app for all non-API routes (SPA routing)
app.get('*', (req, res) => {
  // Don't serve React app for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ 
      success: false, 
      message: 'API endpoint not found' 
    });
  }
  
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit the process, just log the error
    console.log('Server will continue running without database connection');
  }
};

// Start server independently
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at: http://localhost:${PORT}/api`);
  console.log(`Frontend available at: http://localhost:${PORT}`);
});

// Try to connect to MongoDB
connectDB(); 