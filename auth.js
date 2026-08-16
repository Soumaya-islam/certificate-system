const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// ============================================================
// REGISTER
// POST /api/auth/register
// ============================================================

router.post("/register", async (req, res) => {

    try {

        const {
            username,
            name,
            email,
            password,
            role
        } = req.body;

        const finalUsername =
            (username || name || "").trim();

        const finalEmail =
            (email || "").toLowerCase().trim();

        const finalRole =
            role === "admin"
                ? "admin"
                : "student";

        if (
            !finalUsername ||
            !finalEmail ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                error:
                    "Username, email and password are required."
            });

        }

        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                error:
                    "Password must contain at least 6 characters."
            });

        }

        const existingEmail =
            await User.findOne({
                email: finalEmail
            });

        if (existingEmail) {

            return res.status(409).json({
                success: false,
                error:
                    "An account with this email already exists."
            });

        }

        const existingUsername =
            await User.findOne({
                username: finalUsername
            });

        if (existingUsername) {

            return res.status(409).json({
                success: false,
                error:
                    "This username is already taken."
            });

        }

        const user = new User({
            username: finalUsername,
            email: finalEmail,
            password,
            role: finalRole
        });

        await user.save();

        return res.status(201).json({

            success: true,

            message:
                "Account created successfully.",

            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            error: "Registration failed.",
            message: error.message
        });

    }

});

// ============================================================
// LOGIN
const User = require('./models/User');

// POST /api/auth/login
// ============================================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        const finalEmail =
            (email || "").toLowerCase().trim();

        if (!finalEmail || !password) {

            return res.status(400).json({
                success: false,
                error:
                    "Email and password are required."
            });

        }

        const user =
            await User.findOne({
                email: finalEmail
            });

        if (!user) {

            return res.status(401).json({
                success: false,
                error:
                    "Invalid email or password."
            });

        }

        const isMatch =
            await user.comparePassword(password);

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                error:
                    "Invalid email or password."
            });

        }

        if (!JWT_SECRET) {

            return res.status(500).json({
                success: false,
                error:
                    "JWT_SECRET is not configured."
            });

        }

        const token = jwt.sign(

            {
                id: user._id.toString(),
                email: user.email,
                role: user.role
            },

            JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );

        return res.json({

            success: true,

            message:
                "Login successful.",

            token,

            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            error:
                "Login failed.",

            message:
                error.message

        });

    }

});

// ============================================================
// LOGOUT
// ============================================================

router.post("/logout", (req, res) => {

    return res.json({

        success: true,

        message:
            "Logged out successfully."

    });

});

module.exports = router;
