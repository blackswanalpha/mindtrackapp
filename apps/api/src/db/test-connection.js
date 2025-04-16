require('dotenv').config();
const { Pool } = require('pg');

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Connection string:', process.env.DATABASE_URL);
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    // Add connection timeout
    connectionTimeoutMillis: 10000,
    // Reduce the number of connection attempts
    max: 1
  });
  
  try {
    console.log('Attempting to connect...');
    const client = await pool.connect();
    console.log('Successfully connected to the database!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW()');
    console.log('Current database time:', result.rows[0].now);
    
    client.release();
    await pool.end();
    
    return true;
  } catch (error) {
    console.error('Error connecting to database:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'ETIMEDOUT') {
      console.error('Connection timed out. This could be due to:');
      console.error('1. Network connectivity issues');
      console.error('2. Firewall blocking the connection');
      console.error('3. Database server is down or not accepting connections');
    } else if (error.code === 'ENOTFOUND') {
      console.error('Host not found. Check if the database host is correct.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. The database server might be running but refusing connections.');
    }
    
    await pool.end();
    return false;
  }
}

testConnection()
  .then(success => {
    if (success) {
      console.log('Database connection test completed successfully.');
    } else {
      console.log('Database connection test failed.');
    }
  })
  .catch(err => {
    console.error('Unexpected error during connection test:', err);
  });
