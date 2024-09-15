const express = require('express');
const { Pool } = require('pg');

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    console.log('Attempting database connection...');
    const client = await pool.connect();
    console.log('Database connection successful');

    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    console.log('Executing query:', query);
    const result = await client.query(query, [username, password]);
    console.log('Query executed successfully');

    client.release();
    
    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error processing login:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;