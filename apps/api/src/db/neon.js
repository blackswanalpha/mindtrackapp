const { Pool } = require('pg');

let pool;

/**
 * Initialize database connection pool
 */
const setupDb = async () => {
  try {
    // Create a new pool using the DATABASE_URL from environment variables
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for Neon connections
      }
    });

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
  if (!pool) {
    throw new Error('Database not initialized. Call setupDb first.');
  }
  return pool;
};

module.exports = {
  setupDb,
  getPool
};
