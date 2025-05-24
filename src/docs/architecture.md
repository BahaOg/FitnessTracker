# Fitness Tracker - Architectural Documentation

This document outlines the architecture of the Fitness Tracker application based on the 4+1 architectural model.

## 1. Use Case View

### Primary Actors:
- **User** - A person who uses the application to track their fitness activities

### Main Use Cases:
1. **User Registration**
   - User provides name, email, and password
   - System validates input and creates user account
   - System generates authentication token

2. **User Login**
   - User provides email and password
   - System validates credentials
   - System generates authentication token

3. **Create Workout**
   - User enters workout details (name, type, duration, date, calories burned, notes)
   - System saves workout data associated with user

4. **View Workouts**
   - User requests to see their workouts
   - System retrieves and displays all workouts associated with the user

5. **Delete Workout**
   - User selects a workout to delete
   - System removes the workout from the database

### Use Case Diagram:
```
+-----+                +-------------------+
|     |  Register      |                   |
|     | ------------->|                   |
|     |                |                   |
|     |  Login         |                   |
|     | ------------->|                   |
| User|                | Fitness Tracker   |
|     |  Create Workout|    System         |
|     | ------------->|                   |
|     |                |                   |
|     |  View Workouts |                   |
|     | ------------->|                   |
|     |                |                   |
|     |  Delete Workout|                   |
|     | ------------->|                   |
+-----+                +-------------------+
```

## 2. Logical View

### Component Architecture:
The application follows an MVC (Model-View-Controller) architecture with RESTful API endpoints.

#### Models:
- **User Model**: Stores user information and handles password encryption
- **Workout Model**: Stores workout details with a reference to the user

#### Controllers:
- **User Controller**: Handles user registration, authentication, and profile management
- **Workout Controller**: Manages CRUD operations for workouts

#### Views (Frontend):
- **Home Page**: Landing page with registration/login options
- **Register/Login Forms**: User input forms for authentication
- **Dashboard**: Shows user's workouts and form to add new workouts

### Class Diagram:
```
+---------------+       +----------------+
|     User      |       |    Workout     |
+---------------+       +----------------+
| id: ObjectId  |       | id: ObjectId   |
| name: String  |       | userId: ObjectId|
| email: String |       | type: String    |
| password: String|     | name: String    |
| createdAt: Date|      | duration: Number|
| updatedAt: Date|      | date: Date      |
+---------------+       | caloriesBurned: Number|
| comparePassword()|    | notes: String   |
+---------------+       | createdAt: Date |
                        | updatedAt: Date |
                        +----------------+
```

## 3. Process View

### Authentication Flow:
1. User submits registration/login form
2. Server validates input
3. If valid, server generates JWT token
4. Token is sent back to client
5. Client stores token in localStorage
6. Token is included in subsequent API requests
7. Server validates token for protected routes

### Workout Management Flow:
1. User submits workout form
2. Client includes authentication token in request
3. Server validates token
4. Server processes workout data
5. Server sends response to client
6. Client updates UI accordingly

## 4. Development View

### Project Structure:
```
fitness-tracker/
├── src/
│   ├── controllers/      # API controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── services/         # Business logic
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

### Technologies Used:
- **Backend**: Node.js, Express.js, TypeScript, MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT), bcrypt
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5
- **Development**: npm, nodemon, ts-node

## 5. Physical View

### Deployment Architecture:
The application follows a traditional three-tier architecture:

1. **Client Tier**: Browser-based frontend (HTML/CSS/JS)
2. **Application Tier**: Node.js Express server with RESTful API
3. **Data Tier**: MongoDB database

```
+--------------+       +---------------+      +-------------+
|              |       |               |      |             |
|  Web Browser |<----->| Express API   |<---->|  MongoDB    |
|  (Frontend)  |       | (Backend)     |      | (Database)  |
|              |       |               |      |             |
+--------------+       +---------------+      +-------------+
```

### Deployment Diagram:
```
+---------------------------+
|                           |
|  Client Device (Browser)  |
|                           |
+-------------+-------------+
              |
              v
+---------------------------+
|                           |
|  Server (Node.js/Express) |
|                           |
+-------------+-------------+
              |
              v
+---------------------------+
|                           |
|      MongoDB Database     |
|                           |
+---------------------------+
```

## 6. Security Considerations

- Password hashing using bcrypt
- JWT-based authentication
- Input validation and sanitization
- Protected API routes with middleware
- HTTPS recommended for production

## 7. Scalability Considerations

- Stateless authentication allows for horizontal scaling
- Database indexes for performance
- Separation of concerns allows for independent scaling of components
- MongoDB can be scaled with sharding and replication 