const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/upskills_certificates';

// Only connect if we have a valid URI
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('✅ MongoDB connected'))
        .catch(err => console.log('❌ MongoDB error:', err.message));
}

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('✅ Up Skills Hub Certificate API is running');
});

// API route - health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        message: 'Server is running',
        mongo: process.env.MONGO_URI ? 'configured' : 'not configured'
    });
});

// API routes
app.get('/api/certificates', async (req, res) => {
    try {
        // Try to get certificates from database if connected
        if (mongoose.connection.readyState === 1) {
            // Get your Certificate model
            // const certificates = await Certificate.find();
            // res.json({ success: true, certificates });
            res.json({ success: true, message: 'API is working', certificates: [] });
        } else {
            res.json({ success: true, message: 'API is working (MongoDB not connected)', certificates: [] });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export for Vercel
module.exports = app;