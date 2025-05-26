import React, { useState } from 'react';

const DebugPage: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    addResult('Starting connection tests...');

    // Test 1: Check if we can reach the health endpoint
    try {
      addResult('Testing health endpoint at /api/health...');
      const healthResponse = await fetch('/api/health');
      addResult(`Health endpoint status: ${healthResponse.status}`);
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        addResult(`Health response: ${JSON.stringify(healthData)}`);
      } else {
        const healthText = await healthResponse.text();
        addResult(`Health endpoint error: ${healthText.substring(0, 200)}`);
      }
    } catch (error) {
      addResult(`Health endpoint failed: ${error}`);
    }

    // Test 2: Check the register endpoint with OPTIONS request
    try {
      addResult('Testing CORS on register endpoint...');
      const corsResponse = await fetch('/api/users/register', {
        method: 'OPTIONS'
      });
      addResult(`CORS preflight status: ${corsResponse.status}`);
    } catch (error) {
      addResult(`CORS test failed: ${error}`);
    }

    // Test 3: Try a test registration with dummy data
    try {
      addResult('Testing register endpoint with dummy data...');
      const testData = {
        name: 'Test',
        surname: 'User',
        email: 'test@test.com',
        password: 'test123',
        gender: 'male',
        height: '180',
        weight: '75',
        birthDate: '1990-01-01',
        GOAL: 'weight_loss'
      };

      const registerResponse = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      addResult(`Register endpoint status: ${registerResponse.status}`);
      
      const contentType = registerResponse.headers.get('content-type');
      addResult(`Response content-type: ${contentType}`);

      if (contentType && contentType.includes('application/json')) {
        const registerData = await registerResponse.json();
        addResult(`Register response: ${JSON.stringify(registerData)}`);
      } else {
        const registerText = await registerResponse.text();
        addResult(`Register non-JSON response: ${registerText.substring(0, 300)}`);
      }
    } catch (error) {
      addResult(`Register endpoint failed: ${error}`);
    }

    setIsLoading(false);
    addResult('Connection tests completed.');
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Debug Connection Test</h1>
      <p>This page helps debug connection issues with the backend server.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testConnection} 
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Testing...' : 'Run Connection Tests'}
        </button>
        
        <button 
          onClick={clearResults}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Clear Results
        </button>
      </div>

      <div 
        style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '5px',
          padding: '15px',
          maxHeight: '400px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}
      >
        {testResults.length === 0 ? (
          <p style={{ color: '#6c757d', margin: 0 }}>
            Click "Run Connection Tests" to start debugging...
          </p>
        ) : (
          testResults.map((result, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              {result}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '5px' }}>
        <h3>Common Issues and Solutions:</h3>
        <ul>
          <li><strong>Health endpoint fails:</strong> Backend server is not running. Run <code>npm run dev:fullstack</code></li>
          <li><strong>404 errors:</strong> Backend routes not properly configured or wrong port</li>
          <li><strong>CORS errors:</strong> Frontend and backend running on different origins without proper CORS setup</li>
          <li><strong>HTML responses:</strong> Request is hitting the frontend server instead of the API proxy</li>
        </ul>
      </div>
    </div>
  );
};

export default DebugPage; 