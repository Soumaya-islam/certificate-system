require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./db');

const app = express();

console.log('🚀 Starting server...');

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: 'http://127.0.0.1:5500', // your Live Server frontend
    credentials: true // allow session cookies to be sent
}));
app.use(express.json());
app.use(express.static('public'));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'change-this-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true
    }
}));

// Auth routes (login, logout, me)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('✅ Up Skills Certificate API is running');
});

// GET all certificates
app.get('/api/certificates', async (req, res) => {
    try {
        const Certificate = require('./models/Certificate');
        const certificates = await Certificate.find().sort({ createdAt: -1 });
        res.json({ success: true, count: certificates.length, certificates });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST generate certificate
app.post('/api/certificates', async (req, res) => {
    try {
        const { studentName, courseName, courseCode } = req.body;
        const Certificate = require('./models/Certificate');
        const { generateCertificateNumber } = require('./services/counterService');
        const { generateQR } = require('./services/qrService');
        const { generateCertificatePDF } = require('./services/pdfService');
        const fs = require('fs');
        const path = require('path');

        if (!studentName || !courseName || !courseCode) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const certificateNumber = await generateCertificateNumber(courseCode.toUpperCase());
        const qrDataUrl = await generateQR(certificateNumber);
        const pdfBytes = await generateCertificatePDF({
            studentName,
            courseName,
            certificateNumber,
            issueDate: new Date(),
            qrDataUrl
        });

        const pdfFileName = `${certificateNumber}.pdf`;
        const pdfDir = path.join(__dirname, 'certificates');
        if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);
        const pdfFilePath = path.join(pdfDir, pdfFileName);
        fs.writeFileSync(pdfFilePath, pdfBytes);

        const newCertificate = new Certificate({
            certificateNumber,
            studentName,
            courseName,
            issueDate: new Date(),
            status: 'valid',
            pdfUrl: pdfFilePath
        });
        await newCertificate.save();

        res.status(201).json({
            success: true,
            message: 'Certificate generated successfully!',
            certificate: newCertificate
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET verify certificate
app.get('/api/verify/:certificateNumber', async (req, res) => {
    try {
        const Certificate = require('./models/Certificate');
        const { certificateNumber } = req.params;
        const certificate = await Certificate.findOne({ certificateNumber });
        if (!certificate) {
            return res.status(404).json({ success: false, message: 'Certificate Not Found' });
        }
        if (certificate.status === 'revoked') {
            return res.status(403).json({
                success: false,
                message: 'Certificate Revoked',
                certificate: {
                    studentName: certificate.studentName,
                    courseName: certificate.courseName,
                    certificateNumber: certificate.certificateNumber,
                    issueDate: certificate.issueDate,
                    status: certificate.status
                }
            });
        }
        res.json({
            success: true,
            message: 'Certificate is valid',
            certificate: {
                studentName: certificate.studentName,
                courseName: certificate.courseName,
                certificateNumber: certificate.certificateNumber,
                issueDate: certificate.issueDate,
                status: certificate.status
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET download PDF
app.get('/api/certificates/:id/download', async (req, res) => {
    try {
        const Certificate = require('./models/Certificate');
        const fs = require('fs');
        const certificate = await Certificate.findById(req.params.id);
        if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
        const pdfPath = certificate.pdfUrl;
        if (!fs.existsSync(pdfPath)) return res.status(404).json({ error: 'PDF file not found' });
        res.type('application/pdf');
        res.download(pdfPath, `${certificate.certificateNumber}.pdf`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update certificate
app.put('/api/certificates/:id', async (req, res) => {
    try {
        const Certificate = require('./models/Certificate');
        const { status } = req.body;
        const certificate = await Certificate.findById(req.params.id);
        if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
        if (status) certificate.status = status;
        await certificate.save();
        res.json({ success: true, message: 'Certificate updated', certificate });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET dashboard
app.get('/api/dashboard', async (req, res) => {
    try {
        const Certificate = require('./models/Certificate');
        const certificates = await Certificate.find();
        const total = certificates.length;
        const valid = certificates.filter(c => c.status === 'valid').length;
        const revoked = certificates.filter(c => c.status === 'revoked').length;
        const pending = certificates.filter(c => c.status === 'pending').length;

        const today = new Date();
        const dailyData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dayStart = new Date(date);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);
            const count = certificates.filter(c => {
                const issueDate = new Date(c.issueDate);
                return issueDate >= dayStart && issueDate <= dayEnd;
            }).length;
            dailyData.push({ date: date.toLocaleDateString(), count });
        }

        const courseCounts = {};
        certificates.forEach(c => {
            const courseName = c.courseName || 'Unknown';
            courseCounts[courseName] = (courseCounts[courseName] || 0) + 1;
        });
        const topCourses = Object.entries(courseCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        const recent = certificates
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10)
            .map(c => ({
                certificateNumber: c.certificateNumber,
                studentName: c.studentName,
                status: c.status,
                createdAt: c.createdAt
            }));

        res.json({
            success: true,
            data: { total, valid, revoked, pending, dailyData, topCourses, recent }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});