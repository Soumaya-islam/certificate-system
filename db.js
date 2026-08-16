const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables.");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    };
}

async function connectDB() {

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        }).then((mongooseInstance) => {

            console.log("✅ MongoDB connected successfully");

            return mongooseInstance;

        });
    }

    try {

        cached.conn = await cached.promise;

    } catch (error) {

        cached.promise = null;

        console.error(
            "❌ MongoDB connection error:",
            error.message
        );

        throw error;
    }

    return cached.conn;
}

module.exports = connectDB;