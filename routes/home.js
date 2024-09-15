const express = require('express');
const { Pool } = require('pg');

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    console.log('Attempting to store user:', username);
    const client = await pool.connect();
    console.log('Database connection successful');

    // Check if the user already exists
    const checkQuery = 'SELECT * FROM users WHERE username = $1';
    const checkResult = await client.query(checkQuery, [username]);

    if (checkResult.rows.length > 0) {
      console.log('User already exists:', username);
      client.release();
      return res.status(409).json({ message: 'User already exists' });
    }

    // Insert new user
    const insertQuery = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    await client.query(insertQuery, [username, password]);
    console.log('User stored successfully:', username);

    client.release();
    res.status(201).json({ message: 'User stored successfully' });
  } catch (error) {
    console.error('Error processing login:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
    });
  }
});

router.get('/setup', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);
    client.release();
    res.json({ message: 'Database setup completed' });
  } catch (error) {
    console.error('Error setting up database:', error);
    res.status(500).json({ message: 'Error setting up database', error: error.message });
  }
});

module.exports = router;