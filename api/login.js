const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// CORS options
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Wrap the handler with cors
const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    
    try {
      // IMPORTANT: In a real application, NEVER store passwords in plain text.
      // Always use a strong hashing algorithm like bcrypt.
      const query = 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING *';
      const values = [username, password];
      
      const result = await pool.query(query, values);
      
      res.status(200).json({ message: 'Login data stored successfully' });
    } catch (error) {
      console.error('Error storing login data:', error);
      res.status(500).json({ message: 'Failed to store login data' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

module.exports = cors(corsOptions)(handler);