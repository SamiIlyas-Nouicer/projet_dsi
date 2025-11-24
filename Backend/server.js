const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
require('dotenv').config();

// Middleware
app.use(cors()); // Allows React to talk to Express
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database
connectDB();

// Routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`)
);
