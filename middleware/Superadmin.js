const pool = require('../database/connection');
const queries = require('../database/queries/userQuery');

const Superadmin = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const result = await pool.query(queries.getUserById, [user_id]);
    const user = result.rows[0]; 

    if (!user || user.superadmin === false) {
      return res.status(403).json({ error: 'Forbidden: You do not have superadmin privileges' });
    }


    next(); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = Superadmin;
