# Troubleshooting Registration Issues

If you're experiencing registration errors like "Unexpected token '<' ... is not valid JSON", follow these steps:

## Step 1: Check Prerequisites

1. **Node.js installed**: Make sure you have Node.js version 14 or higher
   ```bash
   node --version
   npm --version
   ```

2. **MongoDB running**: Ensure MongoDB is installed and running
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

## Step 2: Project Setup

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd FitnessTrackerr
   npm install
   ```

2. **Create .env file** in the project root:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/fitness-tracker
   JWT_SECRET=your_jwt_secret_key_here_make_it_strong_and_unique
   NODE_ENV=development
   ```

## Step 3: Start the Servers

1. **Start both frontend and backend servers**:
   ```bash
   npm run dev:fullstack
   ```

   This should start:
   - Backend server on `http://localhost:5000`
   - Frontend server on `http://localhost:3000`

2. **Wait for both servers to fully start**. You should see messages like:
   ```
   Server running on port 5000
   webpack compiled successfully
   ```

## Step 4: Test the Connection

1. **Open your browser** and go to `http://localhost:3000`
2. **Login** to the app (register an account if you don't have one)
3. **Navigate to the Debug page** in the navbar
4. **Click "Run Connection Tests"** to diagnose the issue

## Step 5: Common Issues and Solutions

### Issue 1: "Cannot connect to server"
**Cause**: Backend server not running
**Solution**: 
- Run `npm run dev:fullstack` and ensure both servers start
- Check that port 5000 is not blocked by firewall
- Try `npm run dev` to start only the backend

### Issue 2: "404 Not Found" or HTML responses
**Cause**: Requests hitting wrong server or proxy not working
**Solution**:
- Ensure you're accessing `http://localhost:3000` (not 5000)
- Clear browser cache and reload
- Check that webpack.config.js includes the proxy configuration

### Issue 3: "CORS errors"
**Cause**: Frontend and backend on different origins
**Solution**:
- Use the proxy configuration (already included)
- Don't access the app directly on port 5000

### Issue 4: "MongoDB connection error"
**Cause**: MongoDB not running or wrong connection string
**Solution**:
- Start MongoDB service
- Check MONGODB_URI in .env file
- Try: `mongodb://127.0.0.1:27017/fitness-tracker`

### Issue 5: "Unexpected token '<'" Error
**Cause**: Server returning HTML instead of JSON
**Solution**:
1. Check if backend is running on port 5000:
   ```bash
   curl http://localhost:5000/api/health
   ```
2. If not working, restart servers:
   ```bash
   # Kill all node processes
   taskkill /f /im node.exe  # Windows
   # pkill node  # macOS/Linux
   
   # Restart
   npm run dev:fullstack
   ```

## Step 6: Manual Testing

If automated tests fail, try manual testing:

1. **Test backend directly**:
   ```bash
   curl -X POST http://localhost:5000/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","surname":"User","email":"test@test.com","password":"test123","gender":"male","height":"180","weight":"75","birthDate":"1990-01-01","GOAL":"weight_loss"}'
   ```

2. **Test frontend proxy**:
   - Open browser console on `http://localhost:3000`
   - Run: `fetch('/api/health').then(r => r.json()).then(console.log)`

## Step 7: Port Issues

If you need to use different ports:

1. **Change backend port** (edit .env):
   ```
   PORT=8000
   ```

2. **Update webpack proxy** (edit webpack.config.js):
   ```javascript
   proxy: [{
     context: ['/api'],
     target: 'http://localhost:8000',  // Change to your port
     secure: false,
     changeOrigin: true,
   }]
   ```

## Step 8: Firewall/Antivirus

Some antivirus software blocks local servers:
1. **Temporarily disable antivirus**
2. **Add exception** for Node.js and the project folder
3. **Check Windows Firewall** settings

## Still Having Issues?

1. **Check the browser console** for detailed error messages
2. **Run the Debug page tests** and share the results
3. **Check if another application** is using ports 3000 or 5000:
   ```bash
   netstat -ano | findstr :3000
   netstat -ano | findstr :5000
   ```

## Success Indicators

You know everything is working when:
- ✅ Both servers start without errors
- ✅ Debug page shows all tests passing
- ✅ Health endpoint returns JSON response
- ✅ Registration works without errors

If you're still having issues after following these steps, please share:
1. The output from the Debug page
2. Browser console errors
3. Terminal output when starting servers
4. Your operating system and versions 