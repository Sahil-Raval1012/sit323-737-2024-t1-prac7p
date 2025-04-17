// calculator-server.js - Enhanced Calculator Microservice
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to serve static files (HTML, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Basic Operations
app.get('/add', (req, res) => {
  try {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    
    // Input validation
    if (isNaN(num1) || isNaN(num2)) {
      return res.status(400).json({
        error: true,
        message: 'Please provide valid numbers'
      });
    }
    
    const result = num1 + num2;
    res.json({
      operation: 'addition',
      num1: num1,
      num2: num2,
      result: result
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

app.get('/subtract', (req, res) => {
  try {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    
    // Input validation
    if (isNaN(num1) || isNaN(num2)) {
      return res.status(400).json({
        error: true,
        message: 'Please provide valid numbers'
      });
    }
    
    const result = num1 - num2;
    res.json({
      operation: 'subtraction',
      num1: num1,
      num2: num2,
      result: result
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

app.get('/multiply', (req, res) => {
  try {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    
    // Input validation
    if (isNaN(num1) || isNaN(num2)) {
      return res.status(400).json({
        error: true,
        message: 'Please provide valid numbers'
      });
    }
    
    const result = num1 * num2;
    res.json({
      operation: 'multiplication',
      num1: num1,
      num2: num2,
      result: result
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

app.get('/divide', (req, res) => {
  try {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    
    // Input validation
    if (isNaN(num1) || isNaN(num2)) {
      return res.status(400).json({
        error: true,
        message: 'Please provide valid numbers'
      });
    }
    
    // Check for division by zero
    if (num2 === 0) {
      return res.status(400).json({
        error: true,
        message: 'Cannot divide by zero'
      });
    }
    
    const result = num1 / num2;
    res.json({
      operation: 'division',
      num1: num1,
      num2: num2,
      result: result
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

// Advanced Operations
app.get('/exponent', (req, res) => {
  try {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    
    // Input validation
    if (isNaN(num1) || isNaN(num2)) {
      return res.status(400).json({
        error: true,
        message: 'Please provide valid numbers'
      });
    }
    
    const result = Math.pow(num1, num2);
    
    // Check if result is valid
    if (!isFinite(result)) {
      return res.status(400).json({
        error: true,
        message: 'Result is too large or undefined'
      });
    }
    
    res.json({
      operation: 'exponent',
      num1: num1,
      num2: num2,
      result: result
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

app.get('/sqrt', (req, res) => {
  try {
    const num1 = parseFloat(req.query.num1);
    
    // Input validation
    if (isNaN(num1)) {
      return res.status(400).json({
        error: true,
        message: 'Please provide a valid number'
      });
    }
    
    // Check if number is negative
    if (num1 < 0) {
      return res.status(400).json({
        error: true,
        message: 'Cannot calculate square root of a negative number'
      });
    }
    
    const result = Math.sqrt(num1);
    res.json({
      operation: 'square root',
      num1: num1,
      result: result
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

app.get('/modulo', (req, res) => {
  try {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    
    // Input validation
    if (isNaN(num1) || isNaN(num2)) {
      return res.status(400).json({
        error: true,
        message: 'Please provide valid numbers'
      });
    }
    
    // Check for modulo by zero
    if (num2 === 0) {
      return res.status(400).json({
        error: true,
        message: 'Cannot perform modulo by zero'
      });
    }
    
    const result = num1 % num2;
    res.json({
      operation: 'modulo',
      num1: num1,
      num2: num2,
      result: result
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    kubernetes: process.env.KUBERNETES_SERVICE_HOST ? true : false
  });
});

// Environment information endpoint
app.get('/env', (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV || 'development',
    podName: process.env.POD_NAME || 'unknown',
    namespace: process.env.NAMESPACE || 'default',
    hostname: process.env.HOSTNAME || 'unknown'
  });
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Enhanced Calculator Microservice',
    version: '1.0.0',
    endpoints: {
      basic: [
        '/add?num1=x&num2=y',
        '/subtract?num1=x&num2=y',
        '/multiply?num1=x&num2=y',
        '/divide?num1=x&num2=y'
      ],
      advanced: [
        '/exponent?num1=x&num2=y',
        '/sqrt?num1=x',
        '/modulo?num1=x&num2=y'
      ],
      system: [
        '/health',
        '/env'
      ]
    }
  });
});

// For any other route, serve the main HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Enhanced Calculator Microservice running on port ${port}`);
  console.log(`Server started at: ${new Date().toISOString()}`);
});