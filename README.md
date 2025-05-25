# Fitness Tracker Application

A web application for tracking fitness activities built with TypeScript, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Secure registration and login system
- **Comprehensive User Profiles**: Complete user registration with personal information, body metrics, and fitness goals
- **Workout Tracking**: Log different types of workouts with duration and calories burned
- **Dashboard**: View and manage your workout history
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Beautiful, intuitive user interface with smooth animations

### Registration System

The application features a comprehensive registration system that collects:

**Personal Information:**
- First Name and Last Name
- Email Address
- Password (minimum 6 characters)
- Birth Date

**Body Information:**
- Gender (Male, Female, Other)
- Height (flexible format: cm, feet/inches)
- Weight (flexible format: kg, lbs)

**Fitness Goals:**
- Weight Loss
- Muscle Gain
- Maintenance
- Endurance
- Strength

The registration form includes real-time validation, error handling, and a modern, responsive design that works across all devices.

## Technologies Used

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5
- Fetch API for AJAX requests

## Project Structure

```
fitness-tracker/
├── src/
│   ├── controllers/      # API controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── docs/             # Documentation
│   └── index.ts          # Entry point
├── public/               # Frontend files
│   ├── index.html        # Main HTML
│   ├── app.js            # Frontend JavaScript
│   └── styles.css        # CSS styles
├── .env                  # Environment variables
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript configuration
```

## Installation

1. Clone the repository:
```
git clone <repository-url>
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the root directory with the following environment variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. Make sure MongoDB is running on your system.

5. Build the TypeScript code:
```
npm run build
```

## Running the Application

1. Start the server:
```
npm start
```

2. For development with auto-reload:
```
npm run dev
```

3. Access the application in your browser at:
```
http://localhost:5000
```

## API Endpoints

The application provides the following RESTful API endpoints:

### User Routes

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login an existing user
- `GET /api/users/me` - Get the current user information (protected)

### Workout Routes (all protected)

- `GET /api/workouts` - Get all workouts for the logged-in user
- `POST /api/workouts` - Create a new workout
- `GET /api/workouts/:id` - Get a specific workout
- `PUT /api/workouts/:id` - Update a specific workout
- `DELETE /api/workouts/:id` - Delete a specific workout

## Testing the API with Postman

1. Import the provided Postman collection (or create a new collection)
2. Use the provided endpoints
3. For protected routes, make sure to include the JWT token in the Authorization header:
   - Type: Bearer Token
   - Token: `<your-jwt-token>` (obtained from login/register response)

## Architecture

The application follows the MVC (Model-View-Controller) architecture pattern:

- **Models**: Define data structure and handle database interactions
- **Controllers**: Handle business logic and request processing
- **Views**: Present data to users (implemented as frontend HTML/JS)

For more details, see the architectural documentation in `src/docs/architecture.md`.

## License

This project is for educational purposes only. 