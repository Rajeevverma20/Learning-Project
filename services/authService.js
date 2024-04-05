// middleware/auth.js
const jwt = require('jsonwebtoken');
const pool = require('../Database/connection'); // Assuming this imports the PostgreSQL connection pool
const queries = require('../Database/queries/userQuery'); // Assuming this imports the SQL queries for database operations
require('dotenv').config();


const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

    const decoded = jwt.verify(token, process.env.JWT_SCERET);
   const email = decoded.email;

   const { rows } = await pool.query(queries.getUserByEmail, [email]);

    const user = rows[0];
    
    if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

    req.user = user;
    next();
  } catch (error) {
    console.log(error)
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      res.status(500).json({ error: 'Internal Server error' });
  }
};

module.exports = authMiddleware;