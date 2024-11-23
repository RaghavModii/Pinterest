import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'], // Email format validation
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Enforces minimum password length
    },
});

// Index for email to ensure uniqueness and performance
userSchema.index({ email: 1 }, { unique: true });

// Pre-save hook to hash the password
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error); // Pass error to the next middleware
    }
});

// Custom m
const User = mongoose.model('User', userSchema);

export default User;