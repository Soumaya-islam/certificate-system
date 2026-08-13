const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/upskills_certificates')
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.log('❌ MongoDB error:', err));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('✅ Up Skills Hub Certificate API is running');
});

app.get('/api/certificates', async (req, res) => {
    try {
        res.json({ success: true, message: 'API is working' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export for Vercel
module.exports = app;