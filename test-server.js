const http = require('http');
const path = require('path');

// Test if server is running
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  res.on('data', (chunk) => {
    console.log(`Body: ${chunk}`);
  });
  
  res.on('end', () => {
    console.log('API Health check complete');
    
    // Test frontend
    const frontendOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/',
      method: 'GET'
    };
    
    const frontendReq = http.request(frontendOptions, (frontendRes) => {
      console.log(`Frontend Status: ${frontendRes.statusCode}`);
      frontendRes.on('data', (chunk) => {
        console.log('Frontend is being served');
      });
      frontendRes.on('end', () => {
        console.log('Frontend check complete');
        process.exit(0);
      });
    });
    
    frontendReq.on('error', (err) => {
      console.error(`Frontend request error: ${err.message}`);
      process.exit(1);
    });
    
    frontendReq.end();
  });
});

req.on('error', (err) => {
  console.error(`API request error: ${err.message}`);
  console.log('Server might not be running. Try: npm start');
  process.exit(1);
});

req.end(); 