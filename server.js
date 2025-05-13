// calculator-server.js - Enhanced Calculator Microservice with MongoDB
const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection Details
const mongoUsername = process.env.MONGO_USERNAME || 'admin';
const mongoPassword = process.env.MONGO_PASSWORD || 'password';
const mongoDbName = process.env.MONGO_DB_NAME || 'calculator';
const mongoHost = process.env.MONGO_HOST || 'mongodb';
const mongoPort = process.env.MONGO_PORT || '27017';

const mongoURI = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDbName}`;
let db;

// Connect to MongoDB
async function connectToMongo() {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    console.log('Connected to MongoDB successfully!');
    db = client.db(mongoDbName);
    
    // Create collections if they don't exist
    await db.createCollection('calculations');
    console.log('Calculations collection created or already exists');
    
    // Create indexes for better performance
    await db.collection('calculations').createIndex({ timestamp: 1 });
    console.log('Indexes created or already exist');
    
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    // Continue even if MongoDB connection fails
    return null;
  }
}

// Initialize MongoDB connection
connectToMongo().catch(console.error);

// Function to save calculation to database
async function saveCalculation(operation, num1, num2, result) {
  if (!db) return; // Skip if database is not connected
  
  try {
    const calculation = {
      operation,
      num1,
      num2,
      result,
      timestamp: new Date()
    };
    
    await db.collection('calculations').insertOne(calculation);
  } catch (error) {
    console.error('Error saving calculation:', error.message);
  }
}

// Function to get calculation history
async function getCalculationHistory(limit = 10) {
  if (!db) return []; // Return empty array if database is not connected
  
  try {
    return await db.collection('calculations')
      .find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
  } catch (error) {
    console.error('Error retrieving calculation history:', error.message);
    return [];
  }
}

// Middleware to serve static files (HTML, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Basic Operations
app.get('/add', async (req, res) => {
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
    
    // Save to database
    await saveCalculation('addition', num1, num2, result);
    
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

app.get('/subtract', async (req, res) => {
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
    
    // Save to database
    await saveCalculation('subtraction', num1, num2, result);
    
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

app.get('/multiply', async (req, res) => {
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
    
    // Save to database
    await saveCalculation('multiplication', num1, num2, result);
    
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

app.get('/divide', async (req, res) => {
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
    
    // Save to database
    await saveCalculation('division', num1, num2, result);
    
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
app.get('/exponent', async (req, res) => {
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
    
    // Save to database
    await saveCalculation('exponent', num1, num2, result);
    
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

app.get('/sqrt', async (req, res) => {
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
    
    // Save to database
    await saveCalculation('square root', num1, null, result);
    
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

app.get('/modulo', async (req, res) => {
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
    
    // Save to database
    await saveCalculation('modulo', num1, num2, result);
    
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

// NEW: Added history endpoint to retrieve calculation history
app.get('/history', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const history = await getCalculationHistory(limit);
    
    res.json({
      count: history.length,
      calculations: history
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
    kubernetes: process.env.KUBERNETES_SERVICE_HOST ? true : false,
    mongodb: db ? 'connected' : 'disconnected'
  });
});

// Environment information endpoint
app.get('/env', (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV || 'development',
    podName: process.env.POD_NAME || 'unknown',
    namespace: process.env.NAMESPACE || 'default',
    hostname: process.env.HOSTNAME || 'unknown',
    mongoConnection: {
      host: mongoHost,
      port: mongoPort,
      database: mongoDbName,
      connected: db ? true : false
    }
  });
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Enhanced Calculator Microservice with MongoDB',
    version: '2.0.0',
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
      database: [
        '/history?limit=10'
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