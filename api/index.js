export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    console.log('📨 Request:', req.method, req.url);

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

    if (req.url === '/' || req.url === '' || req.url === '/index.html') {
        return res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Up Skills Hub</title>
                <style>
                    body { font-family: Arial; text-align: center; padding: 50px; background: #f0f4f8; }
                    .box { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    h1 { color: #1a237e; }
                    .btn { display: inline-block; padding: 10px 20px; margin: 5px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; }
                    .green { color: #22c55e; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="box">
                    <h1>🎓 Up Skills Hub</h1>
                    <p class="green">✅ Certificate System is LIVE!</p>
                    <p>Your system is deployed successfully.</p>
                    <div>
                        <a href="/api/health" class="btn" target="_blank">Health Check</a>
                        <a href="/api/certificates" class="btn" target="_blank">API</a>
                    </div>
                    <p style="color:#888; font-size:14px; margin-top:20px;">© 2026 Up Skills Hub</p>
                </div>
            </body>
            </html>
        `);
    }

    return res.status(404).json({
        error: 'Not Found',
        message: 'Endpoint not found: ' + req.url
    });
}
