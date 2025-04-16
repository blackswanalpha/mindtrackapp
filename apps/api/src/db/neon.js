const { Pool } = require('pg');

// Create a new pool using the DATABASE_URL from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon connections
  }
});

/**
 * Initialize database connection pool
 */
const setupDb = async () => {
  try {
    // Test the connection
    const client = await pool.connect();
    console.log('Successfully connected to Neon PostgreSQL database');
    client.release();

    return pool;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
};

/**
 * Get the database pool instance
 */
const getPool = () => {
  return pool;
};

module.exports = {
  setupDb,
  getPool
};
