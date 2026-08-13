module.exports = (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Log the request
    console.log('📨 Request:', req.method, req.url);

    // Routing
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
            message: 'Server is running on Vercel!',
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

    // If frontend route, serve index.html
    if (req.url === '/index.html' || req.url === '/') {
        return res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Up Skills Hub Certificates</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial; text-align: center; padding: 50px; background: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    h1 { color: #1a237e; }
                    .btn { display: inline-block; padding: 12px 24px; margin: 10px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; }
                    .btn:hover { background: #2563eb; }
                    .status { color: #22c55e; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🎓 Up Skills Hub</h1>
                    <h2>Certificate Management System</h2>
                    <p class="status">✅ System is running on Vercel!</p>
                    <p>Your certificate system is deployed successfully.</p>
                    <div>
                        <a href="/api/health" class="btn" target="_blank">Check API Health</a>
                        <a href="/api/certificates" class="btn" target="_blank">View Certificates</a>
                    </div>
                    <p style="margin-top: 20px; color: #666; font-size: 14px;">
                        Your certificate system is live! 🎉
                    </p>
                </div>
            </body>
            </html>
        `);
    }

    // 404 for anything else
    return res.status(404).json({
        error: 'Not Found',
        message: 'The requested endpoint does not exist'
    });
};