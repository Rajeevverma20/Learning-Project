const pool = require('../database/connection');
const queries = require('../database/queries/userQuery');

const Superadmin = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const user = await pool.query(queries.getUserById, [user_id]);

    if (!user.superadmin) {
      return res.status(403).json({ error: 'Forbidden: You do not have superadmin privileges' });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = Superadmin;