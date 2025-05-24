# Fitness Tracker - Full-Stack Application

A complete fitness tracking application with React frontend and Express.js backend integrated into a single server.

## 🚀 Architecture

- **Backend**: Express.js with TypeScript, MongoDB/Mongoose
- **Frontend**: React with TypeScript (TSX)
- **Build System**: Webpack for frontend, TypeScript compiler for backend
- **Deployment**: Single server serving both API and frontend

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── FitnessTracker.tsx   # Main React component
│   └── FitnessTracker.css   # Component styles
├── frontend/            # Frontend entry points
│   ├── index.tsx           # React app entry
│   └── index.html          # HTML template
├── controllers/         # API controllers
├── models/             # Database models
├── routes/             # API routes
├── middleware/         # Express middleware
└── index.ts            # Main server file (serves both API & frontend)

dist/                   # Built backend
dist-frontend/          # Built frontend
```

## 🔧 Setup & Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/fitness-tracker
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

3. **Make sure MongoDB is running** (or use MongoDB Atlas)

## 🛠️ Development

### Option 1: Full-Stack Development (Recommended)
Runs both backend and frontend in development mode with hot reload:

```bash
npm run dev:fullstack
```

This starts:
- Backend server on port 5000 (with nodemon for auto-reload)
- Frontend webpack dev server on port 3000 (with hot reload)

### Option 2: Backend Only Development
```bash
npm run dev
```

### Option 3: Frontend Only Development
```bash
npm run dev:react
```

## 🏗️ Production Build & Deployment

### Build Everything
```bash
npm run build
```

This command:
1. Builds the React frontend (`npm run build:frontend`)
2. Builds the TypeScript backend (`npm run build:backend`)

### Start Production Server
```bash
npm start
```

The server will:
- Serve the React app at `http://localhost:5000`
- Provide API endpoints at `http://localhost:5000/api/*`
- Handle client-side routing for the React SPA

### Quick Production Deploy
```bash
npm run serve
```

This builds and starts the production server in one command.

## 🌐 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### User Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user (protected)

### Workouts
- `GET /api/workouts` - Get user's workouts (protected)
- `POST /api/workouts` - Create new workout (protected)
- `GET /api/workouts/:id` - Get specific workout (protected)
- `PUT /api/workouts/:id` - Update workout (protected)
- `DELETE /api/workouts/:id` - Delete workout (protected)

## 🔑 Features

### Frontend (React/TSX)
- ✅ User registration and authentication
- ✅ Workout creation, viewing, and deletion
- ✅ Responsive design with Bootstrap 5
- ✅ Type-safe with TypeScript
- ✅ Modern React hooks and functional components
- ✅ Client-side routing
- ✅ Form validation and error handling

### Backend (Express/TypeScript)
- ✅ RESTful API design
- ✅ JWT authentication
- ✅ MongoDB integration with Mongoose
- ✅ Password hashing with bcrypt
- ✅ CORS support
- ✅ Environment configuration
- ✅ Error handling

## 🧪 Testing

Test if the server is working:
```bash
node test-server.js
```

## 📝 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start backend development server
- `npm run dev:react` - Start frontend development server
- `npm run dev:fullstack` - Start both backend and frontend in development
- `npm run build` - Build both frontend and backend
- `npm run build:frontend` - Build React frontend only
- `npm run build:backend` - Build TypeScript backend only
- `npm run serve` - Build and start production server
- `npm test` - Run tests (not implemented yet)

## 🚀 Deployment Notes

1. The built application is a single Express server that serves both API and frontend
2. All frontend routes are handled by React Router (client-side routing)
3. The server serves the React build as static files
4. API routes are prefixed with `/api/`
5. The frontend uses relative API URLs (`/api/*`) so it works on any domain

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running locally
- Check your `MONGODB_URI` in the `.env` file
- The server will start even if MongoDB is not connected

### Port Issues
- Default port is 5000, change `PORT` in `.env` if needed
- Make sure no other services are using the same port

### Build Issues
- Run `npm install` to ensure all dependencies are installed
- Clear `dist/` and `dist-frontend/` folders and rebuild
- Check for TypeScript compilation errors

## 🎯 Next Steps

- Add more comprehensive testing
- Implement data visualization for workout statistics
- Add workout categories and filtering
- Implement user profiles and settings
- Add export/import functionality
- Deploy to cloud platforms (Heroku, Vercel, etc.) 