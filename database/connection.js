// Import the Pool class from the pg module
const { Pool } = require('pg');

// Import the dotenv module to load environment variables from .env file
require('dotenv').config();

// Destructure environment variables for PostgreSQL connection parameters
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

// Create a new instance of the Pool class with PostgreSQL connection parameters
const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  // Optional: SSL configuration if required
  ssl: {
    require: true,
  },
});

// Export the pool instance to be used in other files
module.exports = pool;
