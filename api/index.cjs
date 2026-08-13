module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.url === '/api/health') {
        return res.status(200).json({ status: 'ok', message: 'Server is running' });
    }

    if (req.url === '/api/certificates') {
        return res.status(200).json({ success: true, certificates: [] });
    }

    return res.status(404).json({ error: 'Not Found' });
};