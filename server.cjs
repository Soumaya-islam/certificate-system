const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Up Skills Certificate API is running"
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is running"
    });
});

app.get("/api/certificates", async (req, res) => {
    res.json({
        success: true,
        message: "API is working",
        certificates: []
    });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
    })
    .catch((err) => {
        console.log("❌ MongoDB error:", err.message);
    });

module.exports = app;

if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}