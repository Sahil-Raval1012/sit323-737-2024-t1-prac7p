const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/app.log' })
    ]
});

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Helper function to log and return response
function processCalculation(operation, num1, num2, res) {
    try {
        logger.info(`Calculating ${operation} with numbers ${num1} and ${num2}`);
        
        let result;
        let operationName;
        
        switch (operation) {
            case 'add':
                result = num1 + num2;
                operationName = 'Addition';
                break;
            case 'subtract':
                result = num1 - num2;
                operationName = 'Subtraction';
                break;
            case 'multiply':
                result = num1 * num2;
                operationName = 'Multiplication';
                break;
            case 'divide':
                if (num2 === 0) {
                    logger.error('Division by zero attempted');
                    return res.status(400).json({ error: 'Cannot divide by zero' });
                }
                result = num1 / num2;
                operationName = 'Division';
                break;
            default:
                logger.error(`Invalid operation: ${operation}`);
                return res.status(400).json({ error: 'Invalid operation' });
        }
        
        logger.info(`${operationName} result: ${result}`);
        res.json({ result });
    } catch (error) {
        logger.error(`Error in ${operation} calculation: ${error.message}`);
        res.status(500).json({ error: 'An error occurred during calculation' });
    }
}

// Calculator routes
app.post('/calculator/add', (req, res) => {
    const { num1, num2 } = req.body;
    processCalculation('add', num1, num2, res);
});

app.post('/calculator/subtract', (req, res) => {
    const { num1, num2 } = req.body;
    processCalculation('subtract', num1, num2, res);
});

app.post('/calculator/multiply', (req, res) => {
    const { num1, num2 } = req.body;
    processCalculation('multiply', num1, num2, res);
});

app.post('/calculator/divide', (req, res) => {
    const { num1, num2 } = req.body;
    processCalculation('divide', num1, num2, res);
});

// Health check endpoint for Kubernetes
app.get('/health', (req, res) => {
    logger.info('Health check called');
    res.status(200).send('Healthy');
});

// Pod information endpoint
app.get('/api/pod-info', (req, res) => {
    const podName = process.env.HOSTNAME || 'local-environment';
    logger.info(`Pod info requested by client. Running on pod: ${podName}`);
    res.json({
        podName: podName,
        timestamp: new Date().toISOString()
    });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Pod/Host identifier: ${process.env.HOSTNAME || 'local-environment'}`);
});