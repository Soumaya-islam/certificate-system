const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./auth");
const frontendHtml = require("./api/frontend-html");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/upskills_certificates"
)
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("❌ MongoDB error:", err.message));

app.use("/api/auth", authRoutes);

app.get("/api/certificates", (req, res) => {
    res.json({
        success: true,
        message: "API is working"
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is running"
    });
});

app.get("*", (req, res) => {
    res.send(frontendHtml);
});

module.exports = app;

if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
    });
}
