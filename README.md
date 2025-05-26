# Fitness Tracker Application

A comprehensive web application for tracking fitness activities, managing workouts, and monitoring progress built with React, TypeScript, Node.js, Express, and MongoDB.

## ✨ Features

### 🔐 User Authentication
- Secure registration and login system with JWT authentication
- Password hashing with bcrypt
- Persistent login sessions with automatic redirect to dashboard
- Secure logout with token cleanup

### 👤 Comprehensive User Management
- **Complete Registration System**: Collects personal information, body metrics, and fitness goals
- **User Profiles**: Editable profile page with all user information
- **Authentication Persistence**: Stay logged in across browser sessions

### 🏋️‍♂️ Workout Management
- **Workout Tracking**: Log different types of workouts with duration and calories burned
- **Workout History**: View and manage complete workout history
- **Exercise Variety**: Support for multiple exercise types (running, walking, cycling, etc.)
- **Detailed Analytics**: Track calories burned, duration, and workout patterns

### 📊 Analytics & Progress Tracking
- **Progress Dashboard**: Comprehensive dashboard with weight trends, goal progress, and total net intake
- **Calorie Calculator**: BMR calculation with goal-based performance scoring
- **Performance Metrics**: Goal-specific performance evaluation (1-100 scale)
- **Visual Charts**: Weight trend visualization and weekly averages
- **Data Synchronization**: Dashboard uses real workout data with estimated calorie intake

### 🎯 Goal-Based System
- **Fitness Goals**: Lose weight, gain weight, or maintain weight
- **Performance Scoring**: Intelligent scoring based on user's specific fitness goals
  - **Lose Weight**: Rewards calorie deficits (500-750 cal/day optimal)
  - **Gain Weight**: Rewards calorie surpluses (500-750 cal/day optimal)
  - **Maintain Weight**: Rewards maintenance calories (±50 cal optimal)
- **Total Net Intake**: Real-time calculation showing calorie intake minus BMR minus exercise calories

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Beautiful Interface**: Modern design with smooth animations and gradients
- **Intuitive Navigation**: Easy-to-use navbar with role-based menu items
- **Form Validation**: Real-time validation with helpful error messages

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **CSS3** with modern features (Grid, Flexbox, Animations)
- **Webpack** with development server and proxy configuration
- **Responsive Design** with mobile-first approach

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** support for cross-origin requests

### Development Tools
- **Hot Reload** for both frontend and backend
- **Proxy Configuration** for seamless API integration
- **Fallback Mechanisms** for robust development experience
- **Debug Tools** for connection testing and troubleshooting

## 📁 Project Structure

```
fitness-tracker/
├── src/
│   ├── components/           # React components
│   │   ├── App.tsx          # Main app component
│   │   ├── FitnessTracker.tsx # Main tracker component
│   │   ├── RegisterPage.tsx  # User registration
│   │   ├── ProfilePage.tsx   # User profile management
│   │   ├── ProgressDashboard.tsx # Analytics dashboard
│   │   ├── CalorieCalculator.tsx # BMR & calorie tracking
│   │   ├── MyWorkouts.tsx    # Workout management
│   │   ├── DebugPage.tsx     # Development debugging
│   │   └── *.css            # Component stylesheets
│   ├── controllers/          # API controllers
│   │   ├── userController.ts # User authentication & management
│   │   └── workoutController.ts # Workout CRUD operations
│   ├── models/              # Database models
│   │   ├── User.ts          # User schema with validation
│   │   └── Workout.ts       # Workout schema
│   ├── routes/              # API routes
│   │   ├── userRoutes.ts    # User endpoints
│   │   └── workoutRoutes.ts # Workout endpoints
│   ├── middleware/          # Express middleware
│   │   └── authMiddleware.ts # JWT authentication
│   ├── scripts/             # Utility scripts
│   │   ├── seedWorkouts.ts  # Seed test data
│   │   └── checkWorkouts.ts # Verify data
│   └── index.ts            # Server entry point
├── public/                  # Static assets
├── webpack.config.js        # Webpack configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── .env                    # Environment variables
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local installation or Atlas cloud)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd fitness-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
JWT_SECRET=your_super_secure_jwt_secret_key_here
NODE_ENV=development
```

### 4. Database Setup
Ensure MongoDB is running on your system:
- **Local MongoDB**: Start mongod service
- **MongoDB Atlas**: Use cloud connection string in MONGODB_URI

### 5. Build TypeScript
```bash
npm run build
```

## 🏃‍♂️ Running the Application

### Development Mode (Recommended)

**Option 1: Run Both Servers Simultaneously**
```bash
npm run dev:fullstack
```
This starts both backend (port 5000) and frontend (port 3000) servers with hot reload.

**Option 2: Run Servers Separately**

Backend only:
```bash
npm run dev
```

Frontend only:
```bash
npm run dev:react
```

### Production Mode
```bash
npm start
```

### Access Points
- **Frontend**: http://localhost:3000 (development) or http://localhost:5000 (production)
- **API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🔗 API Endpoints

### User Authentication
- `POST /api/users/register` - Register new user with complete profile
- `POST /api/users/login` - Login existing user
- `GET /api/users/me` - Get current user profile (protected)
- `PUT /api/users/me` - Update user profile (protected)

### Workout Management (All Protected)
- `GET /api/workouts` - Get all workouts for authenticated user
- `POST /api/workouts` - Create new workout
- `GET /api/workouts/:id` - Get specific workout
- `PUT /api/workouts/:id` - Update specific workout
- `DELETE /api/workouts/:id` - Delete specific workout

### Health & Debug
- `GET /api/health` - Server health check
- Debug tools available in development mode

## 📝 User Registration Fields

### Personal Information
- **Name & Surname**: Full name
- **Email**: Unique identifier with validation
- **Password**: Minimum 6 characters with hashing
- **Birth Date**: For age calculation in BMR

### Body Information
- **Gender**: Male or Female (affects BMR calculation)
- **Height**: Flexible format support (cm, feet/inches)
- **Weight**: Flexible format support (kg, lbs)

### Fitness Goals
- **Lose Weight**: Optimized for calorie deficit tracking
- **Gain Weight**: Optimized for calorie surplus tracking
- **Maintain Weight**: Optimized for maintenance calorie tracking

## 🧪 Testing & Development

### Seeding Test Data
Generate 30 days of mixed workout data for testing:
```bash
npx ts-node src/scripts/seedWorkouts.ts test@test.com
```

### Verify Test Data
Check generated workout data:
```bash
npx ts-node src/scripts/checkWorkouts.ts test@test.com
```

### Debug Tools
- Built-in debug page accessible from navbar when logged in
- Connection testing tools for troubleshooting API issues
- Automatic proxy fallback for development environment

### Test User
For development testing:
- **Email**: test@test.com
- **Password**: test123
- **Pre-seeded with 30 days of mixed running/walking workouts**

## 🏗️ Architecture

### Design Patterns
- **MVC Architecture**: Clear separation of concerns
- **Component-Based**: Reusable React components
- **RESTful API**: Standard HTTP methods and status codes
- **JWT Authentication**: Stateless authentication system

### Key Features
- **Responsive Design**: Mobile-first approach
- **Real-time Validation**: Immediate feedback on forms
- **Persistent Authentication**: Automatic login restoration
- **Proxy Configuration**: Seamless development experience
- **Error Handling**: Comprehensive error management
- **Type Safety**: Full TypeScript implementation

## 🔧 Performance & Optimization

### Dashboard Features
- **Weight Trend**: Visual chart based on actual workout activity and goal-specific calculations
- **Goal Progress**: Dynamic progress tracking toward fitness goals
- **Weekly Averages**: Real-time calculations of intake, burned calories, net calories, and BMR
- **Total Net Intake**: Daily calculation showing intake minus BMR minus exercise calories
- **Recent Workouts**: Display of last 5 workouts with full workout history

### Calorie Calculation
- **BMR**: Mifflin-St Jeor Equation for accurate metabolic rate
- **Activity Tracking**: MET-based calorie burn calculation
- **Goal-Based Scoring**: Intelligent performance metrics
- **Total Net Intake**: Comprehensive calorie balance calculation

### Data Management
- **Efficient Queries**: Optimized MongoDB operations
- **User-Specific Data**: Secure data isolation
- **Caching**: Local storage for authentication state

## 🆘 Troubleshooting

### Common Issues
- **Port Conflicts**: Backend (5000) and Frontend (3000) must be available
- **MongoDB Connection**: Ensure MongoDB service is running
- **Proxy Issues**: Development tools include automatic fallback
- **Authentication**: Check token validity and localStorage

### Debug Tools
- Use built-in Debug page for connection testing
- Check console logs for detailed error information
- Verify environment variables and MongoDB connection

## 📄 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the built-in Debug page
- Review console logs
- Verify environment configuration
- Ensure all services are running 