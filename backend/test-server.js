const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Test route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Test server is running',
    timestamp: new Date().toISOString()
  });
});

// Test user registration
app.post('/api/users/register', (req, res) => {
  console.log('Register request:', req.body);
  res.json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: '1',
        name: req.body.name,
        email: req.body.email
      },
      token: 'test-token-123'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});