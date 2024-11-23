import mongoose from 'mongoose';
import express from 'express';          // Using import for express
import jwt from 'jsonwebtoken';         // Using import for jsonwebtoken
import authRouter  from '../pin/routes/auth.js';

const app = express();

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 50000, // Optional: increases the connection timeout time
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

app.use('/auth', authRouter);

app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});