const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/upskills_certificates')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('✅ Up Skills Certificate API is running');
});

// API Routes
app.get('/api/certificates', async (req, res) => {
    try {
        res.json({ success: true, message: 'API is working' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check for Vercel
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Export for Vercel
module.exports = app;

// Only listen locally (not on Vercel)
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}