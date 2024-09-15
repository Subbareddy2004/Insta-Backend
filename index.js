// Import packages
const express = require("express");
const cors = require("cors");
const home = require("./routes/home");

// Middlewares
const app = express();
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // or your frontend URL
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Routes
app.use("/home", home);

// For Vercel, we need to export the app
module.exports = app;

// Only run the server if not on Vercel
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 9001;
  app.listen(port, () => console.log(`Listening on port ${port}`));
}
