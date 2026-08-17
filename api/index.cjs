// api/index.js
module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // Health
    if (req.url === '/api/health') {
        return res.status(200).json({ status: 'ok', message: 'Server is running' });
    }

    // Certificates
    if (req.url === '/api/certificates') {
        return res.status(200).json({ success: true, certificates: [] });
    }

    // ---- Mock Auth Routes ----
    if (req.url === '/api/auth/register' && req.method === 'POST') {
        return res.status(201).json({
            message: 'User created successfully',
            token: 'mock-token-123',
            user: { id: '1', username: 'test', email: 'test@test.com', role: 'admin' }
        });
    }
    if (req.url === '/api/auth/login' && req.method === 'POST') {
        return res.status(200).json({
            message: 'Login successful',
            token: 'mock-token-123',
            user: { id: '1', username: 'test', email: 'test@test.com', role: 'admin' }
        });
    }

    return res.status(404).json({ error: 'API not found' });
};
