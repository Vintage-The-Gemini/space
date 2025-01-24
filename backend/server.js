const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// Load env vars
dotenv.config();

// Route imports
const instrumentRoutes = require('./routes/instruments');
const nasaRoutes = require('./routes/nasaRoutes');

const app = express();

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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Server Error'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});