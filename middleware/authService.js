const jwt = require('jsonwebtoken');
const pool = require('../Database/connection'); 
const queries = require('../Database/queries/userQuery'); 
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SCERET);
    const email = decoded.email;

    // Fetch user by email
    const { rows: userByEmail } = await pool.query(queries.getUserByEmail, [email]);
    
    // Extract user ID from the decoded token
    const userId = decoded.userId;

    // Fetch user by ID
    const { rows: userById } = await pool.query(queries.getUserById, [userId]);

    // Check if user exists
    const user = userByEmail.length > 0 ? userByEmail[0] : (userById.length > 0 ? userById[0] : null);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
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
