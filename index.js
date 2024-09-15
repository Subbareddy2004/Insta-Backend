const dotenv = require('dotenv');

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Import packages
const express = require('express');
const cors = require('cors');
const home = require("./routes/home");

// Middlewares
const app = express();
app.use(cors());
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://insta-hack.vercel.app' 
    : 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/login", home);  // Changed from "/home" to "/api/login"
app.use("/api", home);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

// For Vercel, we need to export the app
module.exports = app;

// Only run the server if not on Vercel
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  const PORT = process.env.PORT || 9001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
