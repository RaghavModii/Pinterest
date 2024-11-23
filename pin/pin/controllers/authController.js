import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const JWT_REFRESH = process.env.JWT_REFRESH_KEY;

if (!JWT_SECRET || !JWT_REFRESH) {
    throw new Error("JWT keys are not defined in the environment variables");
}

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const user = new User({ name, email, password });
        await user.save();

        console.log("Registered User:", user);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        if (error.code === 11000) { // Handle duplicate email errors
            return res.status(400).json({ message: "Email is already taken" });
        }
        console.error("Error in registerUser:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        console.log("Fetched User from DB:", user);

        if (!user || !user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const accessToken = jwt.sign(
            { userId: user.id, userName: user.name },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            JWT_REFRESH,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: "User logged in successfully",
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("Error in loginUser:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export default {
    registerUser,
    loginUser,
};


