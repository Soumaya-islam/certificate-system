// Simple API that always works - no database needed
module.exports = (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // API routes
    if (req.url === '/') {
        return res.status(200).json({ 
            status: 'ok', 
            message: 'Up Skills Hub Certificate API is running!',
            endpoints: {
                health: '/api/health',
                certificates: '/api/certificates',
                frontend: '/index.html'
            }
        });
    }

    if (req.url === '/api/health') {
        return res.status(200).json({ 
            status: 'ok', 
            message: 'Server is running',
            timestamp: new Date().toISOString()
        });
    }

    if (req.url === '/api/certificates') {
        return res.status(200).json({ 
            success: true, 
            message: 'Certificate API is working',
            certificates: []
        });
    }

    // Default - serve the frontend
    return res.status(200).json({ 
        message: 'Up Skills Hub Certificate System',
        docs: 'Go to /index.html for the frontend'
    });
};