const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const corsOptions = {
  origin: ['https://insta-hack-fr1j.vercel.app', 'http://localhost:5173'],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};

router.use(cors(corsOptions));

router.options('/', cors(corsOptions));

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    const result = await pool.query(query, [username, password]);
    
    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error processing login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;