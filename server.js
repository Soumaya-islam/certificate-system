const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./auth");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "fronted", "index.html"));
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, "fronted")));

mongoose.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/upskills_certificates"
)
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("❌ MongoDB error:", err.message));

// Auth routes
app.use("/api/auth", authRoutes);

// API Routes
app.get("/api/certificates", (req, res) => {
    res.json({
        success: true,
        message: "API is working"
    });
});

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is running"
    });
});

// Fallback - serve frontend index.html for any other route
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "fronted", "index.html"));
});

module.exports = app;

if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
    });
}
