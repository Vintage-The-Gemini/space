const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

// Load env vars
dotenv.config();

const app = express();
const server = http.createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

// Route imports
const instrumentRoutes = require('./routes/instruments');
const nasaRoutes = require('./routes/nasaRoutes');

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/instruments', instrumentRoutes);
app.use('/api/nasa', nasaRoutes);

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

// WebSocket Handling
const generateTelemetryData = () => ({
    timestamp: Date.now(),
    altitude: Math.random() * 400 + 100,
    velocity: Math.random() * 27000 + 3000,
    temperature: Math.random() * 100 - 50,
    radiation: Math.random() * 1000,
    power: Math.random() * 100,
    signals: {
        strength: Math.random() * 100,
        quality: Math.random() * 100,
        latency: Math.random() * 1000
    },
    systems: {
        primary: Math.random() > 0.1 ? 'NOMINAL' : 'WARNING',
        backup: Math.random() > 0.05 ? 'NOMINAL' : 'CRITICAL',
        communication: Math.random() > 0.08 ? 'NOMINAL' : 'WARNING'
    }
});

wss.on('connection', (ws) => {
    console.log('New client connected');
    
    const telemetryInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'TELEMETRY_UPDATE',
                data: generateTelemetryData()
            }));
        }
    }, 1000);

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        handleWebSocketMessage(ws, data);
    });

    ws.on('close', () => {
        clearInterval(telemetryInterval);
        console.log('Client disconnected');
    });
});

const handleWebSocketMessage = (ws, message) => {
    switch (message.type) {
        case 'SUBSCRIBE_MISSION':
            // Handle mission subscription
            break;
        case 'REQUEST_HISTORICAL_DATA':
            // Handle historical data request
            break;
        default:
            console.log('Unknown message type:', message.type);
    }
};

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Server Error'
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});